from django.db import models


def translated_value():
    """Default factory for JSON fields storing ``{locale: value}`` translations."""
    return {}


class ContentBase(models.Model):
    """Shared shape for backend-driven landing content."""

    slug = models.SlugField(max_length=100, unique=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['order', 'id']
