import json
import sqlite3
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import pytest

from payment_service.search_growth import normalize_import, report_summary, traffic_summary
from test_app import client
from test_member_operations import admin_login

QUESTIONS = json.loads((Path(__file__).parents[1] / 'config/growth-questions.json').read_text(encoding='utf-8'))


def report(rows=None):
    return {'provider': 'google_search', 'dimension': 'date', 'startDate': '2026-10-01', 'endDate': '2026-10-02',
            'rows': rows or [{'date': '2026-10-01', 'clicks': 2, 'impressions': 20, 'position': 3}, {'date': '2026-10-02', 'clicks': 1, 'impressions': 10, 'position': 6}]}


def test_import_rejects_invalid_counts_dimensions_and_foreign_pages():
    normalized = normalize_import(report(), date(2026, 10, 2), QUESTIONS)
    assert normalized['rows'][0]['clicks'] == 2
    for value in [-1, 1.2, True, '20', float('nan')]:
        body = report([{'date': '2026-10-01', 'impressions': value}])
        with pytest.raises(ValueError): normalize_import(body, date(2026, 10, 2), QUESTIONS)
    for body in [report([{'date': '2026-10-01', 'clicks': 30, 'impressions': 2}]), report([{'date': '2026-10-03', 'impressions': 2}]), report([{'date': '2026-10-01', 'rawPhone': 'private'}]), report([{'date': '2026-10-01'}, {'date': '2026-10-01'}])]:
        with pytest.raises(ValueError): normalize_import(body, date(2026, 10, 2), QUESTIONS)
    for page in ['https://evil.example/', 'https://www.zkdlj.vip.evil.example/', 'https://www.zkdlj.vip/?token=secret']:
        body = {**report(), 'dimension': 'page', 'rows': [{'page': page, 'impressions': 1}]}
        with pytest.raises(ValueError): normalize_import(body, date(2026, 10, 2), QUESTIONS)
    assert normalize_import(report([{'date': '2026-10-01', 'impressions': None, 'clicks': 0}]), date(2026, 10, 2), QUESTIONS)['rows'][0]['impressions'] is None


def test_traffic_first_page_attribution_dedup_and_shanghai_boundary():
    conn = sqlite3.connect(':memory:'); conn.row_factory = sqlite3.Row
    conn.execute('CREATE TABLE analytics_events(id INTEGER PRIMARY KEY, session_id,event_name,properties_json,page_path,occurred_at,platform)')
    def event(sid, event, props, at, platform='pc'):
        conn.execute('INSERT INTO analytics_events(session_id,event_name,properties_json,page_path,occurred_at,platform) VALUES(?,?,?,?,?,?)', (sid,event,json.dumps(props), '/',at,platform))
    event('secret_session_a', 'page_view', {'trafficSource':'chatgpt','trafficMedium':'ai_referral'}, '2026-10-01T16:00:00Z')
    event('secret_session_a', 'page_view', {'trafficSource':'google','trafficMedium':'organic_search'}, '2026-10-02T00:00:00+08:00')
    for _ in range(2): event('secret_session_a','public_cta_click',{'scope':'full_research'},'2026-10-02T01:00:00+08:00')
    event('secret_session_b','page_view',{},'2026-10-02T01:00:00+08:00')
    event('secret_session_c','page_view',{'trafficSource':'google','trafficMedium':'organic_search'},'2026-10-01T15:59:59Z')
    event('secret_session_d','page_view',{'trafficSource':'google','trafficMedium':'organic_search'},'2026-10-02T01:00:00+08:00','miniprogram')
    event('secret_session_e','page_view',{'trafficSource':'unknown','trafficMedium':'ai_referral'},'2026-10-02T01:00:00+08:00')
    conn.commit()
    result = traffic_summary(conn, datetime.fromisoformat('2026-10-02T00:00:00+08:00'), datetime.fromisoformat('2026-10-02T12:00:00+08:00'), '2026-08-17T15:12:20Z')
    assert result['totals'] == {'sessions':3, 'searchSessions':0, 'aiSessions':1, 'unattributedSessions':2, 'pageViews':4}
    assert result['channels'][1]['researchCtaSessions'] == 1
    assert 'secret_session' not in json.dumps(result)
    assert result['trend'][0]['date'] == '2026-10-02'


def test_evaluation_reuses_question_ids_and_does_not_infer_accuracy():
    case = QUESTIONS['cases'][0]
    body = {'provider':'ai_evaluation','rows':[{'caseId':case['id'],'engine':'ChatGPT Search','observedAt':'2026-10-02T00:00:00Z','citations':[case['expectedCitationURLs'][0]+'?tracking=private','https://other.example/a']}]}
    value = normalize_import(body,date(2026,10,2),QUESTIONS)['rows'][0]
    assert value['expectedPageCited'] is True
    assert value['accuracyReview'] == 'unreviewed'
    assert value['citationURLs'] == [case['expectedCitationURLs'][0]]
    assert 'private' not in json.dumps(value)
    body['rows'][0]['observedAt'] = '2026-10-01T16:01:00Z'
    assert normalize_import(body,date(2026,10,2),QUESTIONS)['rows'][0]['date'] == '2026-10-02'
    body['rows'][0]['caseId'] = 'unknown'
    with pytest.raises(ValueError): normalize_import(body,date(2026,10,2),QUESTIONS)


def test_protected_routes_csrf_replay_and_no_private_projection(client):
    url = '/api/v1/admin/growth/'
    assert client.get(url+'summary').status_code == 401
    assert client.post(url+'import',json=report()).status_code == 401
    session, headers = admin_login(client)
    assert client.get(url+'summary?days=1',headers=headers).status_code == 400
    assert client.post(url+'import',headers={'Authorization':headers['Authorization']},json=report()).status_code == 403
    # API fixtures use the current service clock; use a recent report instead of assuming wall-clock dates.
    today = datetime.now(timezone(timedelta(hours=8))).date().isoformat()
    body = {**report(), 'startDate':today, 'endDate':today, 'rows':[{'date':today,'clicks':1,'impressions':10,'position':3}]}
    first = client.post(url+'import',headers=headers,json=body)
    assert first.status_code == 201
    second = client.post(url+'import',headers=headers,json=body)
    assert second.status_code == 200
    assert second.get_json()['replayed'] is True
    assert first.get_json()['id'] == second.get_json()['id']
    response = client.get(url+'summary',headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    google = next(r for r in data['reports'] if r['provider']=='google_search')
    assert google['metrics']['clicks'] == 1
    assert google['metrics']['ctr'] == .1
    assert next(r for r in data['reports'] if r['provider']=='bing_ai')['status']=='not_connected'
    assert all(r['status']=='not_measured' for r in data['evaluation']['engines'])
    for forbidden in ['actor_hash','sessionToken','email_hash','openid','visitor_id','session_id']:
        assert forbidden not in json.dumps(data)
    assert 'no-store' in response.headers['Cache-Control']


def test_report_weighted_rank_and_no_page_double_count(client):
    _, headers = admin_login(client)
    today=datetime.now(timezone(timedelta(hours=8))).date().isoformat()
    previous=(date.fromisoformat(today)-timedelta(days=1)).isoformat()
    body={**report(),'startDate':previous,'endDate':today,'rows':[{'date':previous,'clicks':1,'impressions':10,'position':2},{'date':today,'clicks':2,'impressions':20,'position':5}]}
    assert client.post('/api/v1/admin/growth/import',headers=headers,json=body).status_code==201
    pages={**body,'dimension':'page','rows':[{'page':'https://www.zkdlj.vip/','clicks':3,'impressions':30,'position':4}]}
    assert client.post('/api/v1/admin/growth/import',headers=headers,json=pages).status_code==201
    data=client.get('/api/v1/admin/growth/summary',headers=headers).get_json()
    google=next(r for r in data['reports'] if r['provider']=='google_search')
    assert google['metrics']['impressions']==30
    assert google['metrics']['position']==4
    # Unknown exposure remains null while known click count can still be displayed.
    body['rows'][0]['impressions']=None
    assert client.post('/api/v1/admin/growth/import',headers=headers,json=body).status_code==201
    google=next(r for r in client.get('/api/v1/admin/growth/summary',headers=headers).get_json()['reports'] if r['provider']=='google_search')
    assert google['metrics']['impressions'] is None
    assert google['metrics']['position'] is None


def test_google_ai_cannot_be_imported_as_citation_count():
    body={**report(),'provider':'google_ai','rows':[{'date':'2026-10-01','citations':100}]}
    with pytest.raises(ValueError): normalize_import(body,date(2026,10,2),QUESTIONS)


def test_concurrent_import_replays_without_duplicate_rows(client):
    _, headers = admin_login(client)
    today = datetime.now(timezone(timedelta(hours=8))).date().isoformat()
    body = {**report(), 'startDate':today, 'endDate':today, 'rows':[{'date':today,'clicks':1,'impressions':2}]}
    def send(_):
        with client.application.test_client() as other:
            response = other.post('/api/v1/admin/growth/import',headers=headers,json=body)
            return response.status_code, response.get_json()['id']
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(send, range(2)))
    assert sorted(status for status, _ in results) == [200,201]
    assert results[0][1] == results[1][1]


def test_geo_landing_attribution_keeps_first_page_and_strips_sensitive_parts():
    conn = sqlite3.connect(':memory:'); conn.row_factory = sqlite3.Row
    conn.execute('CREATE TABLE analytics_events(id INTEGER PRIMARY KEY, session_id,event_name,properties_json,page_path,occurred_at,platform)')
    rows = [
        ('one','page_view',{'trafficSource':'chatgpt','trafficMedium':'ai_referral','attributionEvidence':'utm_source','landingPath':'/companies/profile/EN-demo/?email=private#token'},'/','2026-10-02T00:00:00Z','pc'),
        ('one','page_view',{'trafficSource':'google','trafficMedium':'organic_search','attributionEvidence':'referrer','landingPath':'/about/'},'/about/','2026-10-02T00:01:00Z','pc'),
        ('one','public_cta_click',{'scope':'full_research'},'/','2026-10-02T00:02:00Z','pc'),
        ('two','page_view',{'trafficSource':'chatgpt','trafficMedium':'ai_referral','landingPath':'/ops/?secret=private'},'/ops/','2026-10-02T00:00:00Z','pc'),
        ('three','page_view',{'trafficSource':'chatgpt','trafficMedium':'ai_referral','landingPath':'https://evil.example/private'},'/funding/','2026-10-02T00:00:00Z','pc'),
        ('four','page_view',{'trafficSource':'unattributed','trafficMedium':'unattributed','attributionEvidence':'none','landingPath':'/about/'},'/about/','2026-10-02T00:00:00Z','pc'),
    ]
    for sid,event,props,page,stamp,platform in rows:
        conn.execute('INSERT INTO analytics_events(session_id,event_name,properties_json,page_path,occurred_at,platform) VALUES(?,?,?,?,?,?)',(sid,event,json.dumps(props),page,stamp,platform))
    value=traffic_summary(conn,datetime.fromisoformat('2026-10-02T00:00:00Z'),datetime.fromisoformat('2026-10-02T12:00:00Z'),'2026-10-01T00:00:00Z')
    assert value['totals']['aiSessions']==3
    assert sum(x['sessions'] for x in value['landingPages'])==4
    assert value['totals']['unattributedSessions']==1
    first=next(x for x in value['landingPages'] if x['path']=='/companies/profile/EN-demo/')
    assert first['source']=='chatgpt' and first['researchCtaSessions']==1
    assert any(x['path'] is None for x in value['landingPages'])
    assert any(x['path']=='/funding/' for x in value['landingPages'])
    assert {x['evidence'] for x in value['attributionEvidence']}=={'utm_source','unknown','none'}
    assert value['conversions']['status']=='not_connected'
    assert value['conversions']['registrations'] is None
    assert not any(secret in json.dumps(value) for secret in ['private','evil.example','/ops/'])


def test_geo_observation_modes_and_fact_denominators_are_separate():
    from payment_service.search_growth import evaluation_summary
    case=QUESTIONS['cases'][0]
    def observation(stamp,**extra):
        return {'caseId':case['id'],'engine':'ChatGPT Search','observedAt':stamp,'citations':[],**extra}
    body={'provider':'ai_evaluation','rows':[
        observation('2026-10-02T00:00:00Z',observationType='discovery',searchMode='web_search',collectionMethod='manual_ui',brandMentioned=True,citations=[case['expectedCitationURLs'][0]],reviewedClaims=3,correctClaims=2,incorrectClaims=1,evidenceRef='sha256:'+'a'*64),
        observation('2026-10-02T00:01:00Z',observationType='discovery',searchMode='web_search',collectionMethod='manual_ui',brandMentioned=False),
        observation('2026-10-02T00:02:00Z',observationType='direct_url',searchMode='web_search',collectionMethod='manual_ui',citations=[case['expectedCitationURLs'][0]]),
        observation('2026-10-02T00:03:00Z',observationType='discovery',searchMode='web_search',collectionMethod='manual_ui',answerStatus='failed'),
        observation('2026-10-02T00:04:00Z',observationType='discovery',searchMode='web_search',collectionMethod='api_search',citations=[case['expectedCitationURLs'][0]]),
    ]}
    normalized=normalize_import(body,date(2026,10,2),QUESTIONS)
    value=evaluation_summary(normalized['rows'],QUESTIONS)
    group=next(x for x in value['cohorts'] if x['observationType']=='discovery' and x['collectionMethod']=='manual_ui')
    assert group['observations']==3 and group['validAnswers']==2 and group['failedAnswers']==1
    assert group['citationRate']==.5 and group['mentionRate']==.5
    assert group['reviewedClaims']==3 and group['factAccuracyRate']==pytest.approx(2/3)
    assert group['evidenceReferenced']==1
    assert len(value['cohorts'])==3
    assert len(value['cases'])==3
    assert group['siteCitations']==1


def test_geo_import_rejects_invalid_metadata_and_inconsistent_claims():
    base={'caseId':QUESTIONS['cases'][0]['id'],'engine':'ChatGPT Search','observedAt':'2026-10-02T00:00:00Z','citations':[]}
    invalid=[{'brandMentioned':'yes'},{'evidenceRef':'C:/private/answer.txt'},{'observationType':'guaranteed_rank'},{'searchMode':'unknown_mode'},{'collectionMethod':'api_guess'},{'language':'xx'},{'variantId':'private email@example.com'},
             {'reviewedClaims':2,'correctClaims':3,'incorrectClaims':0},{'reviewedClaims':True,'correctClaims':1,'incorrectClaims':0},{'correctClaims':1},
             {'answerStatus':'failed','citations':[QUESTIONS['cases'][0]['expectedCitationURLs'][0]]},{'answerText':'private full answer'}]
    for extra in invalid:
        with pytest.raises(ValueError): normalize_import({'provider':'ai_evaluation','rows':[{**base,**extra}]},date(2026,10,2),QUESTIONS)


def test_geo_legacy_observations_remain_unknown_and_not_inferred():
    from payment_service.search_growth import evaluation_summary
    row={'caseId':QUESTIONS['cases'][0]['id'],'engine':'ChatGPT Search','model':'','observedAt':'2026-10-02T00:00:00Z','citationURLs':[QUESTIONS['cases'][0]['expectedCitationURLs'][0],'https://www.zkdlj.vip/ops/?secret=private','https://www.zkdlj.vip/about/?email=private'],'expectedPageCited':True,'accuracyReview':'correct'}
    group=evaluation_summary([row],QUESTIONS)['cohorts'][0]
    assert group['observationType']=='legacy' and group['searchMode']=='unknown'
    assert group['brandMentioned'] is None and group['mentionRate'] is None
    assert group['factAccuracyRate'] is None
    assert group['answerAccuracyRate']==1
    assert 'https://www.zkdlj.vip/about/' in group['citedPages']
    assert 'private' not in json.dumps(group) and '/ops/' not in json.dumps(group)


def test_geo_same_timestamp_different_modes_do_not_overwrite(client):
    _,headers=admin_login(client)
    stamp=datetime.now(timezone.utc).isoformat()
    base={'caseId':QUESTIONS['cases'][0]['id'],'engine':'ChatGPT Search','observedAt':stamp,'citations':[],'observationType':'discovery','collectionMethod':'manual_ui','searchMode':'web_search'}
    url='/api/v1/admin/growth/'
    for row in [base,{**base,'observationType':'direct_url'},{**base,'collectionMethod':'api_search'}]:
        assert client.post(url+'import',headers=headers,json={'provider':'ai_evaluation','rows':[row]}).status_code==201
    value=client.get(url+'summary',headers=headers).get_json()
    assert value['measurementVersion']=='GEO-MEASUREMENT-V2'
    assert len(value['evaluation']['cohorts'])==3
    assert sum(x['validAnswers'] for x in value['evaluation']['cohorts'])==3


def test_geo_historical_payload_stays_stable_and_normalized_duplicates_rejected():
    from payment_service.search_growth import normalize_import
    from datetime import date
    base={'caseId':QUESTIONS['cases'][0]['id'],'engine':'ChatGPT Search','observedAt':'2026-10-02T00:00:00Z','citations':[]}
    row=normalize_import({'provider':'ai_evaluation','rows':[base]},date(2026,10,2),QUESTIONS)['rows'][0]
    assert set(row)=={'caseId','engine','model','observedAt','date','citationURLs','expectedPageCited','accuracyReview'}
    assert row['model']=='' and row['accuracyReview']=='unreviewed'
    with pytest.raises(ValueError):
        normalize_import({'provider':'ai_evaluation','rows':[base,{**base,'model':None}]},date(2026,10,2),QUESTIONS)
    with pytest.raises(ValueError):
        normalize_import({'provider':'ai_evaluation','rows':[{**base,'searchMode':'web_search'}]},date(2026,10,2),QUESTIONS)


def test_topic_permalinks_are_public_but_invalid_and_private_paths_remain_unknown():
    from payment_service.search_growth import public_path, public_citation_url
    for path in ['/topics/', '/topics/2026-09/', '/topics/2026-09/industry/', '/en/topics/2026-09/models/']:
        assert public_path(path+'?utm_source=chatgpt#distribution') == path
        assert public_citation_url('https://www.zkdlj.vip'+path) == 'https://www.zkdlj.vip'+path
    for path in ['/topics/2026-13/', '/topics/2026-09/private/', '/topics/../../ops/', '/topics/config/']:
        assert public_path(path) is None
