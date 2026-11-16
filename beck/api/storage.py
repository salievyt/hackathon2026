from urllib.parse import quote

from django.core.files.base import ContentFile
from django.core.files.storage import Storage

from .models import Upload


class DatabaseStorage(Storage):
    def _save(self, name, content):
        Upload.objects.create(name=name, data=content.read())
        return name

    def _open(self, name, mode='rb'):
        return ContentFile(bytes(Upload.objects.get(pk=name).data), name=name)

    def exists(self, name):
        return Upload.objects.filter(pk=name).exists()

    def delete(self, name):
        Upload.objects.filter(pk=name).delete()

    def size(self, name):
        return self._open(name).size

    def url(self, name):
        return '/media/' + quote(name)
