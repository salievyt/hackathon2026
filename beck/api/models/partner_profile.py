from django.conf import settings
from django.db import models

from .partner import Partner


class PartnerProfile(models.Model):
    """Links an authenticated partner user to their card on the landing."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='partner_profile',
    )
    partner = models.OneToOneField(
        Partner,
        on_delete=models.SET_NULL,
        related_name='profile',
        null=True,
        blank=True,
        help_text='Partner card shown in the landing partners section.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Partner account'
        verbose_name_plural = 'Partner accounts'

    def __str__(self):
        return self.user.get_username()
