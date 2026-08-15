from django.db import models

from ..domain.localization import pick_translation
from .base import ContentBase, translated_value


class Track(ContentBase):
    name = models.JSONField(default=translated_value)
    description = models.JSONField(default=translated_value)

    def translated_name(self, locale):
        return pick_translation(self.name, locale)

    def translated_description(self, locale):
        return pick_translation(self.description, locale)

    def __str__(self):
        return self.name.get('en', '') or f'Track #{self.pk}'
