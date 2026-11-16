from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import IntegrityError, transaction

from .interfaces.serializers import ParticipantSerializer
from .models.participant import BotRegistration


ROLES = {'Разработчик': 'developer', 'Дизайнер': 'designer', 'Продакт': 'product', 'Студент': 'student'}
MENU = 'EVO FLARE · Ош\n/register — подать заявку\n/me — моя заявка в боте\n/stats — график заявок\n/info — условия участия\n/cancel — отменить заполнение'
INFO = ('Хакатон EVO FLARE в Оше длится 72 часа. Взнос — 2 000 сомов с команды, '
        'призовой фонд — 100 000 сомов. Можно зарегистрироваться одному.\n'
        'https://evoflare.deo-core.codes/ru')


def reply(text, choices=()):
    markup = {'remove_keyboard': True}
    if choices:
        markup = {'keyboard': [[{'text': label}] for label in choices],
                  'resize_keyboard': True, 'one_time_keyboard': True}
    return {'text': text, 'reply_markup': markup}


def advance(session, text, username):
    draft = session.draft
    if text == '/info':
        return reply(INFO)
    if text == '/me':
        if session.participant_id:
            participant = session.participant
            return reply(f'Заявка №{participant.pk} принята.\n{participant.name}\n{participant.email}\n@{participant.telegram}')
        return reply('С этого аккаунта через бота заявка пока не подана. Начать: /register')
    if text == '/cancel':
        session.step, session.draft = '', {}
        return reply('Заполнение завершено. Начать новую заявку: /register')
    if text == '/register':
        if session.participant_id:
            return reply('Ваша заявка уже принята. Посмотреть: /me')
        session.draft, session.step = {}, 'name'
        return reply('Как вас зовут? Введите имя для заявки. Отмена: /cancel\n'
                     'Обработка данных: https://evoflare.deo-core.codes/ru/privacy')
    if text.startswith('/') or not session.step:
        return reply(MENU)
    if session.step == 'name':
        if not 2 <= len(text) <= 255:
            return reply('Введите имя длиной от 2 до 255 символов.')
        draft['name'], session.step = text, 'email'
        return reply('Введите электронную почту для связи.')
    if session.step == 'email':
        try:
            validate_email(text)
        except ValidationError:
            return reply('Проверьте адрес почты и введите его ещё раз.')
        draft['email'] = text
        if not username:
            session.step = 'telegram'
            return reply('Введите контакт для связи: @username или ссылку t.me.')
        draft['telegram'], session.step = username, 'role'
        return reply('Выберите свою роль.', ROLES)
    if session.step == 'telegram':
        field = ParticipantSerializer(data={**draft, 'telegram': text, 'role': 'student'})
        field.is_valid()
        if 'telegram' in field.errors:
            return reply('Введите корректное имя Telegram или ссылку t.me.')
        draft['telegram'], session.step = text, 'role'
        return reply('Выберите свою роль.', ROLES)
    if session.step == 'role':
        if text not in ROLES:
            return reply('Выберите роль из списка.', ROLES)
        draft['role'], session.step = ROLES[text], 'confirm'
        return reply(f"{draft['name']} · {text}\n{draft['email']}\nTelegram: {draft['telegram']}\n"
                     'Участие — 2 000 сомов с команды. Отправить заявку?', ['Отправить заявку', '/cancel'])
    if text != 'Отправить заявку':
        return reply('Подтвердите отправку или отмените заполнение.', ['Отправить заявку', '/cancel'])
    form = ParticipantSerializer(data=draft)
    if form.is_valid():
        try:
            with transaction.atomic():
                session.participant = form.save()
        except IntegrityError:
            session.step = 'email'
            return reply('Заявку с этой почтой сохранить не удалось. Проверьте адрес или нажмите /cancel.')
        session.step, session.draft = '', {}
        return reply(f'Заявка №{session.participant_id} принята! Посмотреть её: /me')
    session.step = 'email'
    return reply('Проверьте почту: возможно, заявка уже подана через сайт. Введите адрес или нажмите /cancel.')


@transaction.atomic
def handle_message(message):
    session, _ = BotRegistration.objects.select_for_update().get_or_create(chat_id=message['chat']['id'])
    message_id = message['message_id']
    if message_id <= session.last_message:
        return session.last_reply if message_id == session.last_message else None
    result = advance(session, message['text'].strip(), message.get('from', {}).get('username'))
    session.last_message, session.last_reply = message_id, result
    session.save()
    return result
