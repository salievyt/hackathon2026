from django.db import models


class Translation(models.Model):
    LOCALE_CHOICES = [
        ('en', 'English'),
        ('ru', 'Russian'),
        ('ky', 'Kyrgyz'),
    ]

    key = models.CharField(max_length=255)
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES, db_index=True)
    value = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key']
        constraints = [
            models.UniqueConstraint(fields=['key', 'locale'], name='unique_translation_key_locale'),
        ]

    def __str__(self):
        return f'{self.locale}: {self.key}'
