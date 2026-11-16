from django.db import models


class Upload(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    data = models.BinaryField()
