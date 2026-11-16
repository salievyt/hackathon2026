from html import escape
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

from .bot_registration import handle_message
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
    actions = {'🚀 Подать заявку': '/register', 'Моя заявка': '/me',
               'Условия участия': '/info', 'Статистика': '/stats'}
    if message.get('text') in actions:
        message['text'] = actions[message['text']]
        cmd = [message['text']]
    try:
        if query and query.get('data') == 'stats':
            telegram_call(token, 'answerWidgetQuery', {
                'widget_query_id': query['id'], 'data': json.dumps(statistics())})
        elif cmd == ['/start'] and message['chat']['type'] == 'private':
            name = escape(message.get('from', {}).get('first_name', ''))
            greeting = f'Привет, {name}!' if name else 'Привет!'
            telegram_call(token, 'sendMessage', {
                'chat_id': message['chat']['id'], 'parse_mode': 'HTML',
                'text': f'{greeting} 👋\n\nДобро пожаловать на <b>EVO FLARE — хакатон в Оше</b>. '
                        'За 72 часа ты вместе с командой придумаешь и соберёшь свой проект.\n\n'
                        '🏆 Призовой фонд — <b>100 000 сомов</b>\n'
                        'Участие — 2 000 сомов с команды. Можно подать заявку и одному.\n\n'
                        'Нажми «🚀 Подать заявку», и я помогу зарегистрироваться.',
                'reply_markup': {'keyboard': [[{'text': label} for label in row] for row in
                                              (list(actions)[:2], list(actions)[2:])],
                                 'resize_keyboard': True, 'one_time_keyboard': True},
            })
        elif cmd == ['/stats'] and message['chat']['type'] == 'private':
            data = statistics()
            try:
                telegram_call(token, 'sendWidget', {
                    'chat_id': message['chat']['id'], 'allow_queries': True,
                    'html': Path(__file__).with_name('stats_widget.html').read_text(),
                    'public_data': json.dumps(data), 'width': 320,
                    'caption': f"EVO FLARE · Заявок на момент отправки: {data['total']}",
                    'reply_markup': {'inline_keyboard': [[{
                        'text': 'Подать заявку в боте', 'url': 'https://t.me/evoflare_agent?start=register'}]]},
                })
            except HTTPError as error:
                if error.code not in (400, 404):
                    raise
                telegram_call(token, 'sendMessage', {
                    'chat_id': message['chat']['id'],
                    'text': f"EVO FLARE · Всего заявок: {data['total']}\nСегодня по времени Оша: {data['days'][-1][1]}",
                    'reply_markup': {'inline_keyboard': [
                        [{'text': 'График за 7 дней', 'web_app': {'url': 'https://evoflare.deo-core.codes/api/telegram/chart/'}}],
                        [{'text': 'Подать заявку в боте', 'url': 'https://t.me/evoflare_agent?start=register'}],
                    ]},
                })
        elif cmd and message['chat']['type'] == 'private':
            if cmd == ['/start', 'register']:
                message['text'] = '/register'
            result = handle_message(message)
            if result:
                telegram_call(token, 'sendMessage', {'chat_id': message['chat']['id'], **result})
    except (URLError, TimeoutError):
        return HttpResponse(status=503)
    return HttpResponse(status=200)
