import datetime
from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import (
    BrandBook,
    BrandColor,
    BrandRule,
    BrandTypeScale,
    FaqItem,
    Member,
    Partner,
    PartnerAdvantage,
    PartnerPackage,
    PartnerSectionConfig,
    SiteConfig,
    Track,
)

EVENT_START = datetime.datetime(2026, 11, 21, 10, 0, 0, tzinfo=datetime.timezone.utc)

PALETTE = [
    '#4353FE', '#E91E63', '#009688', '#FF9800',
    '#7C4DFF', '#00ACC1', '#8BC34A', '#F4511E',
]


def make_svg(width, height, background, label, label_color='#FFFFFF', font_scale=0.30):
    font_size = int(max(width, height) * font_scale)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}">'
        f'<rect width="{width}" height="{height}" fill="{background}"/>'
        f'<text x="50%" y="50%" font-family="Inter, Arial, sans-serif" '
        f'font-size="{font_size}" fill="{label_color}" text-anchor="middle" '
        f'dominant-baseline="central" font-weight="700">{label}</text>'
        f'</svg>'
    )


def initials(name):
    return ''.join(part[0] for part in name.split()[:2]).upper()


def store_svg(instance, attribute, filename, svg):
    field = getattr(instance, attribute)
    if field.name:
        return False
    field.save(filename, ContentFile(svg.encode('utf-8')), save=False)
    return True


def seed_tracks():
    data = [
        {
            'slug': 'fintech',
            'name': {'en': 'FinTech', 'ru': 'FinTech', 'ky': 'FinTech'},
            'description': {
                'en': 'Build the future of finance.',
                'ru': 'Создавай будущее финансов.',
                'ky': 'Каржынын келечегин жарат.',
            },
        },
        {
            'slug': 'edtech',
            'name': {'en': 'EdTech', 'ru': 'EdTech', 'ky': 'EdTech'},
            'description': {
                'en': 'Innovate in education.',
                'ru': 'Инновации в образовании.',
                'ky': 'Билим берүүдөгү инновациялар.',
            },
        },
        {
            'slug': 'web3',
            'name': {'en': 'Web3', 'ru': 'Web3', 'ky': 'Web3'},
            'description': {
                'en': 'Decentralized applications.',
                'ru': 'Децентрализованные приложения.',
                'ky': 'Борборлоштурулбаган тиркемелер.',
            },
        },
    ]
    for order, item in enumerate(data):
        Track.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'name': item['name'],
                'description': item['description'],
                'order': order,
            },
        )


def seed_members():
    data = [
        {
            'category': Member.CATEGORY_MENTOR, 'slug': 'alex-johnson',
            'name': 'Alex Johnson', 'company': 'TechNova',
            'role': {
                'en': 'Backend Architect', 'ru': 'Бэкенд-архитектор',
                'ky': 'Бэкенд-архитектор',
            },
        },
        {
            'category': Member.CATEGORY_MENTOR, 'slug': 'maria-garcia',
            'name': 'Maria Garcia', 'company': 'DataCorp',
            'role': {'en': 'ML Engineer', 'ru': 'ML-инженер', 'ky': 'ML-инженер'},
        },
        {
            'category': Member.CATEGORY_MENTOR, 'slug': 'james-chen',
            'name': 'James Chen', 'company': 'PixelWorks',
            'role': {
                'en': 'Design Lead', 'ru': 'Ведущий дизайнер',
                'ky': 'Дизайн-лидер',
            },
        },
        {
            'category': Member.CATEGORY_MENTOR, 'slug': 'aisha-patel',
            'name': 'Aisha Patel', 'company': 'InnovateX',
            'role': {
                'en': 'Product Strategist', 'ru': 'Продуктовый стратег',
                'ky': 'Продукт стратеги',
            },
        },
        {
            'category': Member.CATEGORY_JURY, 'slug': 'elena-petrova',
            'name': 'Elena Petrova', 'company': 'InnovateX',
            'role': {'en': 'CEO, InnovateX', 'ru': 'CEO, InnovateX', 'ky': 'CEO, InnovateX'},
        },
        {
            'category': Member.CATEGORY_JURY, 'slug': 'david-kim',
            'name': 'David Kim', 'company': 'CloudPeak',
            'role': {
                'en': 'VP Engineering, CloudPeak', 'ru': 'VP Engineering, CloudPeak',
                'ky': 'VP Engineering, CloudPeak',
            },
        },
        {
            'category': Member.CATEGORY_JURY, 'slug': 'sara-ahmed',
            'name': 'Sara Ahmed', 'company': 'BuildLab',
            'role': {
                'en': 'Founder, BuildLab', 'ru': 'Основатель, BuildLab',
                'ky': 'Founder, BuildLab',
            },
        },
    ]
    media_dir = Path(settings.MEDIA_ROOT) / 'members'
    media_dir.mkdir(parents=True, exist_ok=True)

    for order, item in enumerate(data):
        member, _ = Member.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'category': item['category'],
                'name': item['name'],
                'role': item['role'],
                'company': item['company'],
                'order': order,
            },
        )
        color = PALETTE[order % len(PALETTE)]
        svg = make_svg(400, 400, color, initials(item['name']))
        if store_svg(member, 'avatar', f"{item['slug']}.svg", svg):
            member.save(update_fields=['avatar'])


def seed_partners():
    names = ['TechNova', 'DataCorp', 'CloudPeak', 'PixelWorks', 'BuildLab', 'DevHive']
    media_dir = Path(settings.MEDIA_ROOT) / 'partners'
    media_dir.mkdir(parents=True, exist_ok=True)

    for order, name in enumerate(names):
        slug = name.lower()
        partner, _ = Partner.objects.update_or_create(
            slug=slug,
            defaults={'name': name, 'url': f'https://example.com/{slug}', 'order': order},
        )
        color = PALETTE[(order + 2) % len(PALETTE)]
        svg = make_svg(400, 160, color, name, font_scale=0.28)
        if store_svg(partner, 'logo', f'{slug}.svg', svg):
            partner.save(update_fields=['logo'])


def seed_site_config():
    config, _ = SiteConfig.objects.update_or_create(
        pk=1,
        defaults={'event_start': EVENT_START},
    )
    return config.event_start == EVENT_START


def seed_faq():
    if FaqItem.objects.exists():
        return False
    config = SiteConfig.objects.first()
    if not config:
        config, _ = SiteConfig.objects.update_or_create(
            pk=1, defaults={'event_start': EVENT_START}
        )
    data = [
        {
            'question': {
                'en': 'Who can participate?',
                'ru': 'Кто может участвовать?',
                'ky': 'Ким катыша алат?',
            },
            'answer': {
                'en': 'Anyone aged 16 or older — developers, designers, product managers, and students. All skill levels are welcome.',
                'ru': 'Любой человек старше 16 лет — разработчики, дизайнеры, продакты и студенты. Приветствуются все уровни подготовки.',
                'ky': '16 жаштан жогорку ар ким — иштеп чыгуучулар, дизайнерлер, продукт менеджерлер жана студенттер. Бардык деңгээлдер кабыл алынат.',
            },
        },
        {
            'question': {
                'en': 'How much does it cost to participate?',
                'ru': 'Сколько стоит участие?',
                'ky': 'Катышуу канча турат?',
            },
            'answer': {
                'en': 'Participation is completely free. We cover meals, workspace, and swag for all accepted participants.',
                'ru': 'Участие полностью бесплатное. Мы покрываем питание, рабочее место и мерч для всех принятых участников.',
                'ky': 'Катышуу толугу менен бекер. Бардык кабыл алынган катышуучуларга тамак, жумуш орду жана мерч менен камсыздайбыз.',
            },
        },
        {
            'question': {
                'en': 'Do I need a team to apply?',
                'ru': 'Нужна ли команда для подачи заявки?',
                'ky': 'Катталуу үчүн команда керекпи?',
            },
            'answer': {
                'en': 'No. You can apply solo and we will help you form a team at the start of the event, or bring your own team of up to 5 people.',
                'ru': 'Нет. Можно подать заявку соло, и мы поможем собрать команду в начале мероприятия, или прийти со своей командой до 5 человек.',
                'ky': 'Жок. Жалгыз катталсаңыз болот, иш-чаранын башында команда түзүүгө жардам беребиз, же 5 кишиге чейин өз командаңыз менен келе аласыз.',
            },
        },
        {
            'question': {
                'en': 'What should I bring?',
                'ru': 'Что взять с собой?',
                'ky': 'Эмне ала келиш керек?',
            },
            'answer': {
                'en': 'Bring your laptop, charger, and any hardware you may need for your project. We provide the rest.',
                'ru': 'Возьмите ноутбук, зарядку и всё необходимое для вашего проекта. Остальное мы предоставляем.',
                'ky': 'Ноутбук, зарядка жана долбоор үчүн керектүү нерселерди ала келиңиз. Калганын биз камсыздайбыз.',
            },
        },
        {
            'question': {
                'en': 'What can I build?',
                'ru': 'Что можно создавать?',
                'ky': 'Эмне жаратса болот?',
            },
            'answer': {
                'en': 'Anything you like — an app, a website, a hardware prototype, or an AI model. Projects are judged within the event tracks.',
                'ru': 'Что угодно — приложение, сайт, аппаратный прототип или ИИ-модель. Проекты оцениваются в рамках направлений хакатона.',
                'ky': 'Каалаганыңызды — тиркеме, сайт, аппараттык прототип же AI модели. Долбоорлор хакатондун багыттары боюнча бааланат.',
            },
        },
        {
            'question': {
                'en': 'How are projects judged?',
                'ru': 'Как оцениваются проекты?',
                'ky': 'Долбоорлор кантип бааланат?',
            },
            'answer': {
                'en': 'Projects are evaluated by our jury based on innovation, technical complexity, impact, and presentation.',
                'ru': 'Проекты оценивает наше жюри по инновационности, технической сложности, влиянию и качеству презентации.',
                'ky': 'Долбоорлорду казылар алкагы инновация, техникалык татаалдык, таасир жана презентация боюнча баалайт.',
            },
        },
    ]
    for order, item in enumerate(data):
        FaqItem.objects.create(
            site_config=config,
            question=item['question'],
            answer=item['answer'],
            order=order,
        )
    return True


BRAND_COLORS = [
    {
        'hex_value': '#4353FE',
        'label': {'en': 'Primary', 'ru': 'Основной', 'ky': 'Негизги'},
        'usage': {
            'en': 'Buttons, links, key accents',
            'ru': 'Кнопки, ссылки, ключевые акценты',
            'ky': 'Баскычтар, шилтемелер, негизги акценттер',
        },
    },
    {
        'hex_value': '#3444E8',
        'label': {'en': 'Primary Hover', 'ru': 'Основной (hover)', 'ky': 'Негизги (hover)'},
        'usage': {
            'en': 'Interactive hover states',
            'ru': 'Состояния наведения',
            'ky': 'Hover абалдары',
        },
    },
    {
        'hex_value': '#EEF0FF',
        'label': {'en': 'Primary Soft', 'ru': 'Мягкий основной', 'ky': 'Жумшак негизги'},
        'usage': {
            'en': 'Subtle backgrounds, tags',
            'ru': 'Мягкие фоны, теги',
            'ky': 'Жумшак фондор, тегдер',
        },
    },
    {
        'hex_value': '#0B0D17',
        'label': {'en': 'Ink', 'ru': 'Чернила', 'ky': 'Сыя'},
        'usage': {
            'en': 'Headings, dark sections',
            'ru': 'Заголовки, тёмные секции',
            'ky': 'Башкы сөздөр, караңгы бөлүктөр',
        },
    },
    {
        'hex_value': '#62677A',
        'label': {'en': 'Ink Muted', 'ru': 'Чернила (приглушённый)', 'ky': 'Сыя (боз)'},
        'usage': {
            'en': 'Secondary text',
            'ru': 'Вторичный текст',
            'ky': 'Экинчи даражадагы текст',
        },
    },
    {
        'hex_value': '#FFFFFF',
        'label': {'en': 'Canvas', 'ru': 'Холст', 'ky': 'Канвас'},
        'usage': {
            'en': 'Page background',
            'ru': 'Фон страницы',
            'ky': 'Барактын фону',
        },
    },
    {
        'hex_value': '#E4E6EF',
        'label': {'en': 'Border', 'ru': 'Границы', 'ky': 'Чек аралар'},
        'usage': {
            'en': 'Cards, dividers',
            'ru': 'Карточки, разделители',
            'ky': 'Карточкалар, бөлүктөр',
        },
    },
]

BRAND_TYPE_SCALE = [
    {
        'label': {'en': 'Hero Display', 'ru': 'Герой-дисплей', 'ky': 'Хиро-дисплей'},
        'size': '72px', 'weight': 700, 'tracking': '-3.2px', 'mono': False,
    },
    {
        'label': {'en': 'Display XL', 'ru': 'Дисплей XL', 'ky': 'Дисплей XL'},
        'size': '56px', 'weight': 700, 'tracking': '-2.4px', 'mono': False,
    },
    {
        'label': {'en': 'Display LG', 'ru': 'Дисплей LG', 'ky': 'Дисплей LG'},
        'size': '44px', 'weight': 700, 'tracking': '-1.8px', 'mono': False,
    },
    {
        'label': {'en': 'Display MD', 'ru': 'Дисплей MD', 'ky': 'Дисплей MD'},
        'size': '36px', 'weight': 700, 'tracking': '-1.2px', 'mono': False,
    },
    {
        'label': {'en': 'Heading', 'ru': 'Заголовок', 'ky': 'Башкы сөз'},
        'size': '28px', 'weight': 650, 'tracking': '-0.7px', 'mono': False,
    },
    {
        'label': {'en': 'Lead', 'ru': 'Лид', 'ky': 'Лид'},
        'size': '22px', 'weight': 400, 'tracking': '-0.3px', 'mono': False,
    },
    {
        'label': {'en': 'Body', 'ru': 'Основной текст', 'ky': 'Негизги текст'},
        'size': '17px', 'weight': 400, 'tracking': '-0.2px', 'mono': False,
    },
    {
        'label': {'en': 'Label', 'ru': 'Подпись', 'ky': 'Белги'},
        'size': '14px', 'weight': 600, 'tracking': '-0.1px', 'mono': False,
    },
    {
        'label': {'en': 'Caption', 'ru': 'Сноска', 'ky': 'Капшон'},
        'size': '13px', 'weight': 500, 'tracking': '0', 'mono': False,
    },
    {
        'label': {'en': 'Eyebrow', 'ru': 'Айбрау', 'ky': 'Eyebrow'},
        'size': '12px', 'weight': 600, 'tracking': '0.08em', 'mono': True,
    },
    {
        'label': {'en': 'Code', 'ru': 'Код', 'ky': 'Код'},
        'size': '14px', 'weight': 400, 'tracking': '0', 'mono': True,
    },
]

BRAND_RULES = [
    {
        'kind': BrandRule.KIND_DO,
        'text': {
            'en': 'Use the primary blue for the main calls to action.',
            'ru': 'Используйте основной синий для главных кнопок действия.',
            'ky': 'Негизги аракет баскычтары үчүн негизги көк түстү колдонуңуз.',
        },
    },
    {
        'kind': BrandRule.KIND_DO,
        'text': {
            'en': 'Keep generous white space around the logo.',
            'ru': 'Соблюдайте достаточно воздуха вокруг логотипа.',
            'ky': 'Логотиптин айланасында кенен боштук сактаңыз.',
        },
    },
    {
        'kind': BrandRule.KIND_DO,
        'text': {
            'en': 'Use Inter for interfaces and JetBrains Mono for code labels.',
            'ru': 'Используйте Inter для интерфейсов и JetBrains Mono для кодовых меток.',
            'ky': 'Интерфейстер үчүн Inter, код белгилери үчүн JetBrains Mono колдонуңуз.',
        },
    },
    {
        'kind': BrandRule.KIND_DO,
        'text': {
            'en': 'Prefer the dark ink background for hero and footer sections.',
            'ru': 'Используйте тёмный фон для hero-блоков и футера.',
            'ky': 'Hero-блоктор жана футер үчүн караңгы фонду колдонуңуз.',
        },
    },
    {
        'kind': BrandRule.KIND_DONT,
        'text': {
            'en': "Don't stretch, recolor, or rotate the logo.",
            'ru': 'Не растягивайте, не перекрашивайте и не поворачивайте логотип.',
            'ky': 'Логотипти созбоңуз, боёбоңуз жана айландырбаңыз.',
        },
    },
    {
        'kind': BrandRule.KIND_DONT,
        'text': {
            'en': "Don't place the logo on clashing or busy backgrounds.",
            'ru': 'Не размещайте логотип на пёстрых и конфликтующих фонах.',
            'ky': 'Логотипти ала-була фондорго коюуга болбойт.',
        },
    },
    {
        'kind': BrandRule.KIND_DONT,
        'text': {
            'en': "Don't introduce new fonts outside the brand system.",
            'ru': 'Не добавляйте новые шрифты вне бренд-системы.',
            'ky': 'Бренд-системадан сырткаркы жаңы шрифттерди кошпоңуз.',
        },
    },
    {
        'kind': BrandRule.KIND_DONT,
        'text': {
            'en': "Don't mix the brand blue with other accent colors.",
            'ru': 'Не смешивайте фирменный синий с другими акцентными цветами.',
            'ky': 'Фирмалык көктү башка акцент түстөрү менен аралаштырбаңыз.',
        },
    },
]


def seed_brand_book():
    if BrandBook.objects.exists():
        return False
    book, _ = BrandBook.objects.update_or_create(
        pk=1,
        defaults={
            'name': {'en': 'EVO FLARE HACKATHON', 'ru': 'EVO FLARE HACKATHON', 'ky': 'EVO FLARE HACKATHON'},
            'tagline': {
                'en': 'Electric Blue System — the visual identity of the hackathon.',
                'ru': 'Electric Blue System — визуальный язык хакатона.',
                'ky': 'Electric Blue System — хакатондун визуалдык тили.',
            },
            'description': {
                'en': 'This brand book describes how we look, speak, and feel. It keeps every touchpoint consistent — from the landing page to printed badges, from the countdown timer to the closing ceremony stage.',
                'ru': 'Этот брендбук описывает, как мы выглядим, говорим и ощущаемся. Он сохраняет единый стиль на всех точках контакта — от лендинга до печатных бейджей, от таймера обратного отсчёта до сцены церемонии закрытия.',
                'ky': 'Бул брендбук биздин көрүнүшүбүздү, стилибизди жана маанайыбызды сүрөттөйт. Ал бардык байланыш чекиттеринде бирдиктүү стилди сактайт — лендингден басма бейдждерге чейин, таймерден жабуу аземинин сахнасына чейин.',
            },
            'font_family': 'Inter',
            'font_mono': 'JetBrains Mono',
        },
    )
    for order, item in enumerate(BRAND_COLORS):
        BrandColor.objects.create(brand_book=book, order=order, **item)
    for order, item in enumerate(BRAND_TYPE_SCALE):
        BrandTypeScale.objects.create(brand_book=book, order=order, **item)
    for order, item in enumerate(BRAND_RULES):
        BrandRule.objects.create(brand_book=book, order=order, **item)
    return True


PARTNER_ADVANTAGES = [
    {
        'title': {
            'en': 'Reach 1,000+ builders',
            'ru': 'Доступ к 1 000+ разработчиков',
            'ky': '1 000+ иштеп чыгуучуларга жетүү',
        },
        'description': {
            'en': 'Show your brand to hackers, designers, and product minds during 48 intense hours.',
            'ru': 'Покажите ваш бренд разработчикам, дизайнерам и продактам за 48 напряжённых часов.',
            'ky': '48 сааттын ичинде брендиңизди иштеп чыгуучуларга, дизайнерлерге жана продукт адистерге көрсөтүңүз.',
        },
    },
    {
        'title': {
            'en': 'Brand exposure',
            'ru': 'Охват бренда',
            'ky': 'Бренддин жеткиликтүүлүгү',
        },
        'description': {
            'en': 'Your logo in front of thousands online and at the venue itself.',
            'ru': 'Ваш логотип перед тысячами людей онлайн и на площадке.',
            'ky': 'Логотипиңиз миңдеген адамдардын алдында — онлайн жана жайда.',
        },
    },
    {
        'title': {
            'en': 'Direct access to talent',
            'ru': 'Прямой доступ к талантам',
            'ky': 'Таланттарга түз жетүү',
        },
        'description': {
            'en': 'Meet and hire motivated developers, designers, and managers.',
            'ru': 'Знакомьтесь и нанимайте мотивированных разработчиков, дизайнеров и менеджеров.',
            'ky': 'Мотивациялуу иштеп чыгуучулар, дизайнерлер жана менеджерлер менен таанышып, ишке алсаңыз болот.',
        },
    },
    {
        'title': {
            'en': 'Content & PR',
            'ru': 'Контент и PR',
            'ky': 'Контент жана PR',
        },
        'description': {
            'en': 'Mention in posts, press releases, and the closing ceremony.',
            'ru': 'Упоминание в постах, пресс-релизах и на церемонии закрытия.',
            'ky': 'Посттордо, пресс-релиздерде жана жабуу аземинин алкагында эскерүү.',
        },
    },
]

PARTNER_PACKAGES = [
    {
        'label': {'en': 'Title Partner', 'ru': 'Титульный партнёр', 'ky': 'Титулдук өнөктөш'},
        'description': {
            'en': 'Top-level visibility across all channels.',
            'ru': 'Максимальная видимость во всех каналах.',
            'ky': 'Бардык каналдарда эң жогорку көрүнүү.',
        },
        'perks': [
            {'en': 'Main logo on stage and materials', 'ru': 'Главный логотип на сцене и материалах', 'ky': 'Сахнада жана материалдарда башкы логотип'},
            {'en': '10-minute opening speech', 'ru': 'Приветственное слово 10 минут', 'ky': '10 мүнөттүк баштоо сөзү'},
            {'en': 'Logo in all posts', 'ru': 'Логотип во всех постах', 'ky': 'Бардык посттордо логотип'},
            {'en': '5 tickets to demo day', 'ru': '5 билетов на демо-день', 'ky': 'Демо-күнгө 5 билет'},
        ],
    },
    {
        'label': {'en': 'Platinum Partner', 'ru': 'Платиновый партнёр', 'ky': 'Платина өнөктөш'},
        'description': {
            'en': 'Maximum exposure for your brand.',
            'ru': 'Максимальный охват для вашего бренда.',
            'ky': 'Брендиңиз үчүн максималдуу охват.',
        },
        'perks': [
            {'en': 'Logo on the stage banner', 'ru': 'Логотип на баннере сцены', 'ky': 'Сахна баннеринде логотип'},
            {'en': 'Booth at the venue', 'ru': 'Стенд на площадке', 'ky': 'Жайда стенд'},
            {'en': 'Logo in posts', 'ru': 'Логотип в постах', 'ky': 'Посттордо логотип'},
            {'en': '3 tickets to demo day', 'ru': '3 билета на демо-день', 'ky': 'Демо-күнгө 3 билет'},
        ],
    },
    {
        'label': {'en': 'Gold Partner', 'ru': 'Золотой партнёр', 'ky': 'Алтын өнөктөш'},
        'description': {
            'en': 'Reliable brand support.',
            'ru': 'Надёжная поддержка бренда.',
            'ky': 'Брендге ишенимдүү колдоо.',
        },
        'perks': [
            {'en': 'Logo on the website', 'ru': 'Логотип на сайте', 'ky': 'Сайтта логотип'},
            {'en': 'Logo in posts', 'ru': 'Логотип в постах', 'ky': 'Посттордо логотип'},
            {'en': '2 tickets to demo day', 'ru': '2 билета на демо-день', 'ky': 'Демо-күнгө 2 билет'},
        ],
    },
]


def seed_partner_section():
    if PartnerSectionConfig.objects.exists():
        return False
    config, _ = PartnerSectionConfig.objects.update_or_create(
        pk=1,
        defaults={
            'description': {
                'en': 'Become a partner of EVO FLARE HACKATHON — the most exciting coding marathon of 2026 in Osh. Grow your brand and meet the sharpest minds in tech.',
                'ru': 'Станьте партнёром EVO FLARE HACKATHON — самого яркого марафона разработчиков 2026 года в Оше. Развивайте бренд и знакомьтесь с самыми сильными специалистами.',
                'ky': 'EVO FLARE HACKATHON өнөктөшү болуңуз — Оштогу 2026-жылдагы эң кызыктуу код марафону. Брендиңизди өстүрүңүз жана IT тармагындагы эң мыкты адистер менен таанышыңыз.',
            },
            'contact_name': 'Partnership Team',
            'contact_email': 'partners@evoflare.example',
            'contact_phone': '+996 700 000 000',
        },
    )
    for order, item in enumerate(PARTNER_ADVANTAGES):
        PartnerAdvantage.objects.create(config=config, order=order, **item)
    for order, item in enumerate(PARTNER_PACKAGES):
        PartnerPackage.objects.create(order=order, **item)
    return True


class Command(BaseCommand):
    help = 'Seeds landing content (tracks, mentors, jury, partners) with placeholder assets'

    def handle(self, *args, **options):
        seed_tracks()
        seed_members()
        seed_partners()
        if seed_site_config():
            self.stdout.write(self.style.SUCCESS(
                f'SiteConfig seeded: event_start = {EVENT_START.isoformat()}'
            ))
        if seed_faq():
            self.stdout.write(self.style.SUCCESS(
                f'FaqItem seeded: {FaqItem.objects.count()}'
            ))
        else:
            self.stdout.write('FaqItem: already exists, skipped')
        if seed_brand_book():
            self.stdout.write(self.style.SUCCESS(
                f'BrandBook seeded: {BrandColor.objects.count()} colors, '
                f'{BrandTypeScale.objects.count()} type styles, '
                f'{BrandRule.objects.count()} rules'
            ))
        else:
            self.stdout.write('BrandBook: already exists, skipped')
        if seed_partner_section():
            self.stdout.write(self.style.SUCCESS(
                f'Partner section seeded: {PartnerAdvantage.objects.count()} advantages, '
                f'{PartnerPackage.objects.count()} packages'
            ))
        else:
            self.stdout.write('Partner section: already exists, skipped')
        self.stdout.write(self.style.SUCCESS(
            f'Done. Tracks: {Track.objects.count()}, Members: {Member.objects.count()}, '
            f'Partners: {Partner.objects.count()}'
        ))
