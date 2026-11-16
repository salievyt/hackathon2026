import json
import os
from datetime import timedelta
from pathlib import Path
from secrets import compare_digest
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.http import HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Participant


def statistics():
    zone = ZoneInfo('Asia/Bishkek')
    today = timezone.localdate(timezone=zone)
    days = [today - timedelta(days=n) for n in reversed(range(7))]
    counts = dict(Participant.objects.annotate(day=TruncDate('created_at', tzinfo=zone))
                  .filter(day__range=(days[0], today)).values('day')
                  .annotate(n=Count('pk')).values_list('day', 'n'))
    return {'total': Participant.objects.count(),
            'days': [[day.strftime('%d.%m'), counts.get(day, 0)] for day in days]}


@never_cache
def chart(request):
    data = statistics()
    maximum = max(1, *(n for _, n in data['days']))
    rows = [(day, n, round(100 * n / maximum)) for day, n in data['days']]
    return render(request, 'telegram/chart.html', {'total': data['total'], 'rows': rows})


def telegram_call(token, method, payload):
    req = Request(f'https://api.telegram.org/bot{token}/{method}',
                  data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
    with urlopen(req, timeout=8) as response:
        return json.load(response)['result']


@csrf_exempt
@require_POST
def webhook(request):
    secret = os.environ.get('TELEGRAM_WEBHOOK_SECRET', '')
    if not secret or not compare_digest(secret.encode(), request.headers.get(
            'X-Telegram-Bot-Api-Secret-Token', '').encode()):
        return HttpResponse(status=403)
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not token:
        return HttpResponse(status=503)
    update = json.loads(request.body)
    query = update.get('widget_query')
    message = update.get('message', {})
    cmd = message.get('text', '').split()
    try:
        if query and query.get('data') == 'stats':
            telegram_call(token, 'answerWidgetQuery', {
                'widget_query_id': query['id'], 'data': json.dumps(statistics())})
        elif cmd and cmd[0] in ('/start', '/stats') and message['chat']['type'] == 'private':
            data = statistics()
            try:
                telegram_call(token, 'sendWidget', {
                    'chat_id': message['chat']['id'], 'allow_queries': True,
                    'html': Path(__file__).with_name('stats_widget.html').read_text(),
                    'public_data': json.dumps(data), 'width': 320,
                    'caption': f"EVO FLARE · Заявок на момент отправки: {data['total']}",
                    'reply_markup': {'inline_keyboard': [[{
                        'text': 'Подать заявку', 'url': 'https://evoflare.deo-core.codes/ru#register'}]]},
                })
            except HTTPError as error:
                if error.code not in (400, 404):
                    raise
                telegram_call(token, 'sendMessage', {
                    'chat_id': message['chat']['id'],
                    'text': f"EVO FLARE · Всего заявок: {data['total']}\nСегодня по Бишкеку: {data['days'][-1][1]}",
                    'reply_markup': {'inline_keyboard': [
                        [{'text': 'График за 7 дней', 'web_app': {'url': 'https://evoflare.deo-core.codes/api/telegram/chart/'}}],
                        [{'text': 'Подать заявку', 'url': 'https://evoflare.deo-core.codes/ru#register'}],
                    ]},
                })
    except (URLError, TimeoutError):
        return HttpResponse(status=503)
    return HttpResponse(status=200)
