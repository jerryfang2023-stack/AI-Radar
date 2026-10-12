from test_app import client, analytics_event
from test_app import pc_login
from datetime import datetime, timedelta, timezone


def test_channel_report_keeps_unknown_and_deduplicates_events(client):
    e = analytics_event(platform='pc', properties={'trafficSource':'wechat','trafficMedium':'group','trafficCampaign':'season2','attributionEvidence':'utm_source','firstSource':'wechat','firstMedium':'group'})
    assert client.post('/api/v1/analytics/events', json={'events':[e,e]}).status_code == 200
    payload = client.get('/api/v1/analytics/summary?platform=pc').get_json()
    report = payload['pcAcquisition']
    assert report['channels'][0]['source'] == 'wechat'
    assert report['channels'][0]['visitors'] == 1
    assert report['channels'][0]['pageViews'] == 1
    assert report['quality'][0]['key'] == 'ordinary'
    assert 'visitor-0001' not in str(report)


def test_pc_registration_is_server_owned_and_attached_to_acquisition(client):
    headers = {'X-Analytics-Visitor':'pc-visitor-0001','X-Analytics-Session':'pc-session-0001'}
    event = analytics_event(platform='pc', visitorId='pc-visitor-0001',sessionId='pc-session-0001',properties={'trafficSource':'wechat','trafficMedium':'group','firstSource':'wechat','firstMedium':'group'})
    client.post('/api/v1/analytics/events',json={'events':[event]})
    forged = dict(event,eventId='event-fake-register',event='registration_success')
    client.post('/api/v1/analytics/events',json={'events':[forged]})
    assert client.get('/api/v1/analytics/summary?platform=pc').get_json()['pcAcquisition']['attributedRegistrations'] == 0
    for _ in range(2):
        challenge=client.post('/api/v1/auth/challenges',json={'type':'email','value':'channel@example.com'}).get_json()
        response=client.post('/api/v1/auth/challenges/'+challenge['challengeId']+'/verify',json={'code':challenge['testCode']},headers=headers)
        assert response.status_code == 200
    summary=client.get('/api/v1/analytics/summary?platform=pc').get_json()
    assert summary['overview']['newRegistrations'] == 1
    assert summary['pcAcquisition']['attributedRegistrations'] == 1
    assert summary['pcAcquisition']['channels'][0]['registrations'] == 1
    assert client.get('/api/v1/analytics/summary?platform=miniprogram').get_json()['overview']['newRegistrations'] == 0


def test_automation_evidence_is_separate_from_bounces_and_cannot_forge_server_events(client):
    now = datetime.now(timezone.utc)-timedelta(seconds=40)
    for index in range(30):
        e=analytics_event(platform='pc',eventId=f'fast-event-{index:04}',visitorId='fast-visitor-0001',sessionId='fast-session-0001',page=f'/funding/FI-{index}/',occurredAt=(now+timedelta(seconds=index)).isoformat(),properties={})
        assert client.post('/api/v1/analytics/events',json=e).status_code == 200
    for suffix,props,ua in [('normal',{'agentClass':'declared_crawler'},'Mozilla/5.0'),('webdriver',{'automationHint':True},'Mozilla/5.0'),('crawler',{},'Googlebot/2.1'),('test',{'trafficSource':'internal','trafficMedium':'test'},'Mozilla/5.0')]:
        e=analytics_event(platform='pc',eventId='event-'+suffix,visitorId='visitor-'+suffix,sessionId='session-'+suffix,properties=props)
        client.post('/api/v1/analytics/events',json=e,headers={'User-Agent':ua})
    report=client.get('/api/v1/analytics/summary?platform=pc').get_json()['pcAcquisition']
    groups={r['key']:r for r in report['quality']}
    assert groups['ordinary']['visitors'] == 1
    assert groups['suspected_automation']['visitors'] == 2
    assert groups['declared_crawler']['visitors'] == 1
    assert groups['internal']['visitors'] == 1
    assert sum(r['pageViews'] for r in report['channels']) == 34
    assert client.post('/api/v1/analytics/events',json=analytics_event(platform='pc',eventId='server:registration_success:spoof')).status_code == 400


def test_registration_without_tracking_does_not_invent_a_visitor_or_channel(client):
    pc_login(client)
    summary=client.get('/api/v1/analytics/summary?platform=pc').get_json()
    assert summary['overview']['newRegistrations'] == 1
    assert summary['overview']['visitors'] == 0
    assert summary['pcAcquisition']['attributedRegistrations'] == 0
