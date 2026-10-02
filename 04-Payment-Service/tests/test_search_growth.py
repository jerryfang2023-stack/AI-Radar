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
