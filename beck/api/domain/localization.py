"""Domain helpers for localized, backend-driven content."""

DEFAULT_LOCALE = 'en'
SUPPORTED_LOCALES = ('en', 'ru', 'ky')


def resolve_locale(value):
    """Normalize a raw locale value to a supported one, falling back to default."""
    return value if value in SUPPORTED_LOCALES else DEFAULT_LOCALE


def pick_translation(value, locale):
    """Pick a single value from a translated dict, with safe fallbacks."""
    if not isinstance(value, dict):
        return str(value or '')
    return (
        value.get(locale)
        or value.get(DEFAULT_LOCALE)
        or next(iter(value.values()), '')
    )


def build_message_tree(translations):
    """Group flat ``key.locale`` translation rows into a nested message tree.

    A key like ``"Hero.title"`` becomes ``{"Hero": {"title": value}}``.
    """
    messages = {}
    for item in translations:
        parts = item.key.split('.')
        node = messages
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        node[parts[-1]] = item.value
    return messages
