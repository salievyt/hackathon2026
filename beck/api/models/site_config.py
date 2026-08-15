from django.db import models


class SiteConfig(models.Model):
    """Singleton configuration for the site, controlled from the admin."""

    event_start = models.DateTimeField(
        verbose_name='Event start',
        help_text='Date and time when the hackathon starts (shown in the countdown).',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site configuration'
        verbose_name_plural = 'Site configuration'

    def __str__(self):
        return f'Event start: {self.event_start.isoformat()}'
