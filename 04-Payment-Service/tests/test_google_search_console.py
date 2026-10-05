from contextlib import closing
from datetime import datetime, timedelta, timezone
import json
import sqlite3
from urllib.parse import parse_qs, urlsplit

import pytest

from payment_service.google_search_console import CALLBACK, SCOPE, GoogleError
from test_app import client
from test_member_operations import admin_login

BASE = '/api/v1/admin/growth/google/'
NOW = datetime(2026, 10, 4, 2, tzinfo=timezone.utc)


@pytest.fixture
def connector(client, tmp_path):
    config = tmp_path/'client.json'
    config.write_text(json.dumps({'web':{'client_id':'synthetic.apps.googleusercontent.com','client_secret':'synthetic-client-secret','redirect_uris':[CALLBACK], 'auth_uri':'https://evil.example/', 'token_uri':'https://evil.example/'}}))
    client.application.config['GSC_CLIENT_CONFIG_PATH'] = str(config)
    value = client.application.extensions['google_search_console']
    value.clock = lambda: NOW
    return value


def seed(value):
    with closing(value.db()) as conn:
        conn.execute('INSERT INTO operations_google_connection(id,generation,tokens,actor_hash,connected_at) VALUES(1,?,?,?,?)', ('generation-one',value.seal({'refresh_token':'synthetic-private-refresh'}),'actor',NOW.isoformat()))
        conn.commit()


class Remote:
    def __init__(self, before=None, empty=False):
        self.requests=[]; self.before=before; self.empty=empty
    def __enter__(self): return self
    def __exit__(self,*args): pass
    def get(self,url,**kwargs):
        return Reply({'siteEntry':[{'siteUrl':'sc-domain:zkdlj.vip','permissionLevel':'siteOwner'}]})
    def post(self,url,json,**kwargs):
        self.requests.append((url,json,kwargs))
        if self.before: self.before()
        key={'date':json['endDate'],'page':'https://www.zkdlj.vip/','query':'AI 融资'}[json['dimensions'][0]]
        return Reply({'rows':[] if self.empty else [{'keys':[key],'clicks':2.0,'impressions':20.0,'position':3.5}]})


class Reply:
    status_code=200
    def __init__(self,data): self.data=data
    def json(self): return self.data


def test_routes_require_existing_admin_and_csrf(client, connector):
    for action in ('connect','finish','sync','disconnect'):
        assert client.post(BASE+action,json={}).status_code==401
    _,headers=admin_login(client)
    for action in ('connect','finish','sync','disconnect'):
        assert client.post(BASE+action,headers={'Authorization':headers['Authorization']},json={}).status_code==403
    assert client.post(BASE+'sync',headers=headers,json={}).status_code==409
    client.application.config['GSC_PROPERTY']='https://evil.example/'
    assert client.post(BASE+'connect',headers=headers,json={}).status_code==503


def prepare(client, connector, headers):
    response=client.post(BASE+'connect',headers=headers,json={})
    assert response.status_code==200
    url=response.get_json()['authorizationUrl']
    args=parse_qs(urlsplit(url).query)
    assert url.startswith('https://accounts.google.com/o/oauth2/auth?')
    assert args['scope']==[SCOPE] and args['access_type']==['offline']
    assert args['redirect_uri']==[CALLBACK] and args['code_challenge_method']==['S256']
    state=args['state'][0]
    ticket=connector.callback(state,'synthetic-authorization-code')
    assert ticket and connector.callback(state,'replay-code') is None
    return state,ticket


def test_pkce_callback_one_time_encrypted_and_bound_to_original_session(client,connector,monkeypatch):
    _,headers=admin_login(client)
    state,ticket=prepare(client,connector,headers)
    with closing(connector.db()) as conn:
        row=dict(conn.execute('SELECT * FROM operations_google_pending').fetchone())
    serialized=json.dumps(row)
    assert state not in serialized and ticket not in serialized and 'synthetic-authorization-code' not in serialized
    _,other=admin_login(client)
    assert client.post(BASE+'finish',headers=other,json={'ticket':ticket}).status_code==400
    def exchange(verifier,code):
        assert connector.callback(state,'replay-while-exchanging') is None
        return {'refresh_token':'synthetic-private-refresh'}
    monkeypatch.setattr(connector,'exchange',exchange)
    monkeypatch.setattr(connector,'api_session',lambda tokens:Remote())
    assert client.post(BASE+'finish',headers=headers,json={'ticket':ticket}).status_code==200
    assert client.post(BASE+'finish',headers=headers,json={'ticket':ticket}).status_code==400
    with closing(connector.db()) as conn:
        row=dict(conn.execute('SELECT * FROM operations_google_connection').fetchone())
    assert 'synthetic-private-refresh' not in json.dumps(row)
    assert 'synthetic-client-secret' not in json.dumps(connector.status())


def test_callback_does_not_require_cross_site_strict_cookie(client,connector):
    _,headers=admin_login(client)
    response=client.post(BASE+'connect',headers=headers,json={})
    state=parse_qs(urlsplit(response.get_json()['authorizationUrl']).query)['state'][0]
    with client.application.test_client() as visitor:
        callback=visitor.get(BASE+'callback',query_string={'state':state,'code':'synthetic-code'})
        assert callback.status_code==200
        assert 'google_connect=' in callback.text
        assert 'synthetic-code' not in callback.text and state not in callback.text
        assert callback.headers['Referrer-Policy']=='no-referrer'
        assert 'no-store' in callback.headers['Cache-Control']
        assert visitor.get(BASE+'callback',query_string={'state':state,'code':'synthetic-code'}).status_code==400


def test_expired_and_cancelled_state_cannot_connect(client,connector):
    _,headers=admin_login(client)
    response=client.post(BASE+'connect',headers=headers,json={})
    state=parse_qs(urlsplit(response.get_json()['authorizationUrl']).query)['state'][0]
    connector.clock=lambda:NOW+timedelta(minutes=11)
    assert connector.callback(state,'code') is None
    assert client.get(BASE+'callback',query_string={'state':state,'error':'access_denied'}).status_code==400


def test_logout_or_disconnect_during_exchange_cancels_completion(client,connector,monkeypatch):
    for logout in (True,False):
        _,headers=admin_login(client)
        _,ticket=prepare(client,connector,headers)
        def exchange(verifier,code):
            if logout: client.post('/api/v1/admin/auth/logout',headers=headers)
            else: connector.disconnect()
            return {'refresh_token':'synthetic-refresh'}
        monkeypatch.setattr(connector,'exchange',exchange)
        monkeypatch.setattr(connector,'api_session',lambda tokens:Remote())
        assert client.post(BASE+'finish',headers=headers,json={'ticket':ticket}).status_code==400
        assert connector.status()['connected'] is False


def test_sync_daily_timezone_and_window_totals_do_not_sum_details(connector,monkeypatch):
    seed(connector); remote=Remote()
    monkeypatch.setattr(connector,'api_session',lambda tokens:remote)
    assert connector.sync_due() is True
    assert connector.sync_due() is False
    assert len(remote.requests)==7
    payload=remote.requests[0][1]
    assert payload['startDate']=='2026-07-07' and payload['endDate']=='2026-09-30'
    assert payload['dataState']=='final' and payload['rowLimit']==5000
    assert payload['dimensionFilterGroups'][0]['filters'][0]['expression']==r'^https://www\.zkdlj\.vip/'
    assert all(item[0].startswith('https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Azkdlj.vip/') for item in remote.requests)
    result=connector.report(7,'2026-09-28','2026-10-04')
    assert result['metrics']=={'clicks':2,'impressions':20,'ctr':.1,'position':3.5}
    assert result['dimensions']['page']['startDate']=='2026-09-28'
    assert result['dimensions']['query']['topRowsOnly'] is True
    assert result['dimensions']['date']['partialWindow'] is True
    assert result['dimensions']['date']['startDate']=='2026-09-28'
    assert connector.status()['latestDataDate']=='2026-09-30'
    # A stale aggregate cannot masquerade as a newly selected date interval.
    assert 'page' not in connector.report(7,'2026-09-29','2026-10-05')['dimensions']
    connector.clock=lambda:NOW+timedelta(days=1)
    assert connector.sync_due() is True


def test_empty_report_is_not_fabricated_zero_and_failures_keep_success(connector,monkeypatch):
    seed(connector)
    monkeypatch.setattr(connector,'api_session',lambda tokens:Remote(empty=True))
    connector.sync_due()
    assert connector.report(30,'2026-09-05','2026-10-04')['metrics']['impressions'] is None
    assert connector.status()['latestDataDate'] is None
    success=connector.status()['syncedAt']
    def fail(tokens): raise GoogleError('network')
    monkeypatch.setattr(connector,'api_session',fail)
    connector.request_sync();connector.sync_due()
    assert connector.status()['status']=='failed'
    assert connector.status()['syncedAt']==success
    def expired(tokens): raise GoogleError('reauthorize')
    monkeypatch.setattr(connector,'api_session',expired)
    connector.request_sync();connector.sync_due()
    assert connector.status()['status']=='reauthorize'
    assert connector.sync_due() is False


def test_lease_prevents_duplicate_and_disconnect_prevents_stale_write(connector,monkeypatch):
    seed(connector)
    def before():
        assert connector.sync_due() is False
        connector.disconnect()
    remote=Remote(before=before)
    # Only the first request triggers the concurrency condition.
    def first(): remote.before=None;before()
    remote.before=first
    monkeypatch.setattr(connector,'api_session',lambda tokens:remote)
    assert connector.sync_due() is True
    assert connector.status()['connected'] is False
    with closing(connector.db()) as conn:
        assert conn.execute('SELECT count(*) FROM operations_google_snapshots').fetchone()[0]==0


def test_expired_lease_recovers_an_interrupted_job(connector,monkeypatch):
    seed(connector)
    with closing(connector.db()) as conn:
        conn.execute('UPDATE operations_google_connection SET requested=0,lease=?,lease_until=?,attempted_at=?',('abandoned',(NOW-timedelta(seconds=1)).isoformat(),NOW.isoformat()))
        conn.commit()
    monkeypatch.setattr(connector,'api_session',lambda tokens:Remote())
    assert connector.sync_due() is True
    assert connector.status()['status']=='connected'


def test_refresh_transport_has_bounded_timeout(connector,monkeypatch):
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    captured=[]
    monkeypatch.setattr(Request,'__call__',lambda self,**kwargs:captured.append(kwargs))
    monkeypatch.setattr(Credentials,'refresh',lambda self,request:request(url='https://oauth2.googleapis.com/token',method='POST',timeout=120))
    remote=connector.api_session({'refresh_token':'synthetic-refresh'});remote.close()
    assert captured[0]['timeout']==10


def test_temporary_refresh_error_does_not_require_new_consent(connector,monkeypatch):
    from google.oauth2.credentials import Credentials
    from google.auth.exceptions import RefreshError
    def fail(self,request): raise RefreshError('synthetic upstream failure',retryable=True)
    monkeypatch.setattr(Credentials,'refresh',fail)
    with pytest.raises(GoogleError) as error:
        connector.api_session({'refresh_token':'synthetic-refresh'})
    assert error.value.code=='network'


def test_manual_import_preserved_and_summary_projection_has_no_secrets(client,connector,monkeypatch):
    _,headers=admin_login(client)
    seed(connector)
    monkeypatch.setattr(connector,'api_session',lambda tokens:Remote())
    connector.sync_due()
    response=client.get('/api/v1/admin/growth/summary',headers=headers)
    assert response.status_code==200
    data=response.get_json()
    assert data['googleConnection']['connected'] is True
    for forbidden in ('refresh_token','client_secret','synthetic-private','actor_hash','verifier','state_hash'):
        assert forbidden not in json.dumps(data)
