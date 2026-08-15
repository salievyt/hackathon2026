from django.db import models

from ..domain.localization import pick_translation
from .base import ContentBase, translated_value


class Member(ContentBase):
    CATEGORY_MENTOR = 'mentor'
    CATEGORY_JURY = 'jury'
    CATEGORY_CHOICES = [
        (CATEGORY_MENTOR, 'Mentor'),
        (CATEGORY_JURY, 'Jury'),
    ]

    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, db_index=True)
    name = models.CharField(max_length=255)
    role = models.JSONField(default=translated_value)
    company = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(upload_to='members/', blank=True, null=True)

    def translated_role(self, locale):
        return pick_translation(self.role, locale)

    def __str__(self):
        return self.name
