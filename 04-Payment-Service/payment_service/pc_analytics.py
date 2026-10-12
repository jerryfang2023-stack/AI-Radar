"""PC acquisition aggregates. No raw identities, IPs or user agents in output/storage."""
import json
import re
from collections import defaultdict
from datetime import datetime, timedelta, timezone

TAG = re.compile(r'^[a-z][a-z0-9_-]{0,47}$', re.I)
SOURCES = {'wechat','xiaohongshu','partner','internal','google','bing','baidu','chatgpt','perplexity','copilot','gemini','deepseek','doubao','kimi','qwen','unattributed','other'}


def tag(value, fallback=''):
    value = str(value or '').lower()
    return value if TAG.fullmatch(value) and not re.search(r'\d{7}', value) else fallback


def sanitize(properties, user_agent='', server=False):
    result = dict(properties)
    for key in ('trafficSource', 'trafficMedium', 'trafficCampaign', 'firstSource', 'firstMedium', 'firstCampaign'):
        if key in result:
            result[key] = tag(result[key])
    for key in ('trafficSource','firstSource'):
        if key in result and result[key] not in SOURCES:
            result[key] = 'unattributed'
    for key in ('attributionEvidence', 'firstEvidence'):
        if key in result and result[key] not in ('utm_source', 'referrer', 'none'):
            result[key] = 'none'
    for key in ('referralHost', 'firstReferralHost'):
        value = str(result.get(key) or '')
        result[key] = value.lower() if re.fullmatch(r'[a-zA-Z0-9.-]{1,120}', value) else ''
    for key in ('landingPath',):
        if key in result:
            path = str(result[key]).split('?', 1)[0].split('#', 1)[0]
            result[key] = path[:160] if path.startswith('/') and not path.startswith('//') else '/'
    # A user-agent declaration is evidence, not verified crawler ownership.
    result.pop('agentClass', None)
    result.pop('serverVerified', None)
    if re.search(r'bot\b|crawler|spider|slurp', user_agent, re.I):
        result['agentClass'] = 'declared_crawler'
    elif re.search(r'headless|playwright|puppeteer|selenium', user_agent, re.I):
        result['agentClass'] = 'automation'
    return result


def acquisition_summary(rows):
    sessions = defaultdict(list)
    for row in rows:
        if row['platform'] == 'pc':
            sessions[(row['visitor_id'], row['session_id'])].append(row)
    channels, first_channels, daily, quality = {}, {}, {}, {}
    conversions = set()

    def item(mapping, key, fields):
        return mapping.setdefault(key, {**fields, '_visitors':set(), '_sessions':set(), '_registrations':set(), 'pageViews':0})

    def count(target, visitor, session, views=0, registered=None):
        target['_visitors'].add(visitor)
        target['_sessions'].add(session)
        target['pageViews'] += views
        if registered is not None:
            target['_registrations'].add(registered)

    def channel(props, first=False):
        return (tag(props.get('firstSource' if first else 'trafficSource'), 'unattributed'),
                tag(props.get('firstMedium' if first else 'trafficMedium'), 'unattributed'),
                tag(props.get('firstCampaign' if first else 'trafficCampaign')), str(props.get('firstReferralHost' if first else 'referralHost') or ''))

    for identity, events in sessions.items():
        events.sort(key=lambda r: datetime.fromisoformat(r['occurred_at'].replace('Z', '+00:00')))
        pages = [r for r in events if r['event_name'] == 'page_view']
        if not pages:
            continue  # Server login/conversion events alone are not visits.
        props = json.loads(pages[0]['properties_json'] or '{}')
        source, medium, campaign, host = channel(props)
        first_source, first_medium, first_campaign, first_host = channel(props, True)
        data = [json.loads(r['properties_json'] or '{}') for r in events]
        times = [datetime.fromisoformat(r['occurred_at'].replace('Z', '+00:00')).timestamp() for r in pages]
        # Require both rapid repetition and breadth; a lone bounce is ordinary/unconfirmed.
        rapid = False
        left = 0
        for right, stamp in enumerate(times):
            while stamp - times[left] > 60:
                left += 1
            if right-left+1 >= 30 and len({r['page_path'] for r in pages[left:right+1]}) >= 20:
                rapid = True
                break
        if source == 'internal' and medium == 'test':
            kind = 'internal'
        elif any(p.get('agentClass') == 'declared_crawler' for p in data):
            kind = 'declared_crawler'
        elif rapid or any(p.get('agentClass') == 'automation' or p.get('automationHint') is True for p in data):
            kind = 'suspected_automation'
        else:
            kind = 'ordinary'
        visitor, session = identity
        c = item(channels, (source,medium,campaign,host,kind), {'source':source,'medium':medium,'campaign':campaign,'referralHost':host,'trafficType':kind})
        f = item(first_channels, (first_source,first_medium,first_campaign,first_host,kind), {'source':first_source,'medium':first_medium,'campaign':first_campaign,'referralHost':first_host,'trafficType':kind})
        q = item(quality, kind, {'key':kind})
        for target in (c,f,q):
            count(target, visitor, identity, len(pages))
        for page in pages:
            day = datetime.fromisoformat(page['occurred_at'].replace('Z','+00:00')).astimezone(timezone(timedelta(hours=8))).date().isoformat()
            d = item(daily, (day,source,medium,campaign,host,kind), {'date':day,'source':source,'medium':medium,'campaign':campaign,'referralHost':host,'trafficType':kind})
            count(d,visitor,identity,1)
        for event in events:
            if event['event_name'] == 'registration_success' and str(event['event_id']).startswith('server:') and event['user_id'] is not None and event['user_id'] not in conversions:
                conversions.add(event['user_id'])
                for target in (c,f,q):
                    target['_registrations'].add(event['user_id'])
                day = datetime.fromisoformat(event['occurred_at'].replace('Z','+00:00')).astimezone(timezone(timedelta(hours=8))).date().isoformat()
                d = item(daily, (day,source,medium,campaign,host,kind), {'date':day,'source':source,'medium':medium,'campaign':campaign,'referralHost':host,'trafficType':kind})
                count(d,visitor,identity,registered=event['user_id'])

    def finish(mapping):
        return sorted([dict({k:v for k,v in r.items() if not k.startswith('_')}, visitors=len(r['_visitors']), sessions=len(r['_sessions']), registrations=len(r['_registrations'])) for r in mapping.values()], key=lambda r:(-r['visitors'],str(r)))
    return {'version':'PC-ACQUISITION-1','channels':finish(channels),'firstChannels':finish(first_channels),'daily':finish(daily),'quality':finish(quality), 'attributedRegistrations':len(conversions)}
