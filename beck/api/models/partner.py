from django.db import models

from .base import ContentBase


class Partner(ContentBase):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='partners/')
    url = models.URLField(blank=True)

    def __str__(self):
        return self.name
