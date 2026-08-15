from django.db import models

from ..domain.localization import pick_translation
from .base import translated_value


class PartnerSectionConfig(models.Model):
    """Singleton settings for the public partner section of the landing."""

    description = models.JSONField(default=translated_value, help_text='Translated section description.')
    contact_name = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Partner section configuration'
        verbose_name_plural = 'Partner section configuration'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def translated_description(self, locale):
        return pick_translation(self.description, locale)

    def __str__(self):
        return 'Partner section'


class PartnerAdvantage(models.Model):
    config = models.ForeignKey(
        PartnerSectionConfig,
        related_name='advantages',
        on_delete=models.CASCADE,
    )
    title = models.JSONField(default=translated_value)
    description = models.JSONField(default=translated_value)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Partner advantage'
        verbose_name_plural = 'Partner advantages'

    def translated_title(self, locale):
        return pick_translation(self.title, locale)

    def translated_description(self, locale):
        return pick_translation(self.description, locale)

    def __str__(self):
        return self.title.get('en', '') or f'Advantage #{self.pk}'


class PartnerPackage(models.Model):
    label = models.JSONField(default=translated_value)
    description = models.JSONField(default=translated_value)
    perks = models.JSONField(default=list, help_text='List of translated perk objects, e.g. [{"en": "...", "ru": "...", "ky": "..."}].')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Partner package'
        verbose_name_plural = 'Partner packages'

    def translated_label(self, locale):
        return pick_translation(self.label, locale)

    def translated_description(self, locale):
        return pick_translation(self.description, locale)

    def translated_perks(self, locale):
        return [pick_translation(perk, locale) for perk in self.perks]

    def __str__(self):
        return self.label.get('en', '') or f'Package #{self.pk}'


class PartnerAsset(models.Model):
    title = models.JSONField(default=translated_value)
    file = models.FileField(upload_to='partner_assets/', help_text='Logo, poster, press-kit, etc.')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Partner asset'
        verbose_name_plural = 'Partner assets'

    def translated_title(self, locale):
        return pick_translation(self.title, locale)

    def __str__(self):
        return self.title.get('en', '') or self.file.name


class PartnerLead(models.Model):
    """Public partnership application, reviewed by the organizers in the admin."""

    STATUS_NEW = 'new'
    STATUS_CONTACTED = 'contacted'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_CONTACTED, 'Contacted'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    company = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=50, blank=True)
    package = models.ForeignKey(
        PartnerPackage,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='Requested partnership level.',
    )
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Partner lead'
        verbose_name_plural = 'Partner leads'

    def __str__(self):
        return f'{self.company} · {self.contact_email}'
