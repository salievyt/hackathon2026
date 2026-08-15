from django.db import models

from ..domain.localization import pick_translation
from .base import translated_value
from .site_config import SiteConfig


class FaqItem(models.Model):
    """Frequently asked question, managed inside the Site configuration."""

    site_config = models.ForeignKey(
        SiteConfig,
        on_delete=models.CASCADE,
        related_name='faq_items',
        null=True,
        blank=True,
    )
    question = models.JSONField(default=translated_value)
    answer = models.JSONField(default=translated_value)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'FAQ item'
        verbose_name_plural = 'FAQ items'
        ordering = ['order', 'id']

    def translated_question(self, locale):
        return pick_translation(self.question, locale)

    def translated_answer(self, locale):
        return pick_translation(self.answer, locale)

    def __str__(self):
        return self.question.get('en', '') or f'FAQ item #{self.pk}'
