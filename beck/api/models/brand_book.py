from django.core.validators import RegexValidator
from django.db import models

from ..domain.localization import pick_translation
from .base import translated_value

HEX_COLOR = RegexValidator(
    regex=r'^#[0-9A-Fa-f]{6}$',
    message='Enter a hex color, e.g. #4353FE.',
)


class BrandBook(models.Model):
    """Singleton brand identity of the hackathon, controlled from the admin."""

    name = models.JSONField(default=translated_value, help_text='Translated brand name.')
    tagline = models.JSONField(default=translated_value, help_text='Translated tagline.')
    description = models.JSONField(default=translated_value, help_text='Translated brand story.')
    logo = models.ImageField(upload_to='brand/', blank=True, null=True)
    font_family = models.CharField(max_length=100, default='Inter', help_text='Primary typeface.')
    font_mono = models.CharField(max_length=100, default='JetBrains Mono', help_text='Code/mono typeface.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Brand book'
        verbose_name_plural = 'Brand book'

    def __str__(self):
        return 'Brand book'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def translated_name(self, locale):
        return pick_translation(self.name, locale)

    def translated_tagline(self, locale):
        return pick_translation(self.tagline, locale)

    def translated_description(self, locale):
        return pick_translation(self.description, locale)


class BrandColor(models.Model):
    brand_book = models.ForeignKey(
        BrandBook,
        related_name='colors',
        on_delete=models.CASCADE,
    )
    label = models.JSONField(default=translated_value)
    hex_value = models.CharField(max_length=7, validators=[HEX_COLOR])
    usage = models.JSONField(default=translated_value, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Brand color'
        verbose_name_plural = 'Brand colors'

    def translated_label(self, locale):
        return pick_translation(self.label, locale)

    def translated_usage(self, locale):
        return pick_translation(self.usage, locale)

    def __str__(self):
        return f'{self.hex_value} · {self.label.get("en", "")}'


class BrandTypeScale(models.Model):
    brand_book = models.ForeignKey(
        BrandBook,
        related_name='type_scale',
        on_delete=models.CASCADE,
    )
    label = models.JSONField(default=translated_value)
    size = models.CharField(max_length=20)
    weight = models.PositiveIntegerField(default=400)
    tracking = models.CharField(max_length=20, default='-0.5px')
    mono = models.BooleanField(default=False, help_text='Use the mono typeface for this style.')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Type scale entry'
        verbose_name_plural = 'Type scale'

    def translated_label(self, locale):
        return pick_translation(self.label, locale)

    def __str__(self):
        return f'{self.label.get("en", "")} · {self.size}'


class BrandRule(models.Model):
    KIND_DO = 'do'
    KIND_DONT = 'dont'
    KIND_CHOICES = [
        (KIND_DO, 'Do'),
        (KIND_DONT, "Don't"),
    ]

    brand_book = models.ForeignKey(
        BrandBook,
        related_name='rules',
        on_delete=models.CASCADE,
    )
    kind = models.CharField(max_length=4, choices=KIND_CHOICES)
    text = models.JSONField(default=translated_value)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Brand rule'
        verbose_name_plural = 'Brand rules'

    def translated_text(self, locale):
        return pick_translation(self.text, locale)

    def __str__(self):
        return f'[{self.kind}] {self.text.get("en", "")[:40]}'
