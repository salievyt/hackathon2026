from django.db import models


class Participant(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    telegram = models.CharField(max_length=32, blank=True)
    role = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "заявка участника"
        verbose_name_plural = "заявки участников"

    def __str__(self):
        return self.name


class BotRegistration(models.Model):
    chat_id = models.BigIntegerField(primary_key=True)
    participant = models.OneToOneField(Participant, null=True, on_delete=models.SET_NULL)
    step = models.CharField(max_length=16, blank=True)
    draft = models.JSONField(default=dict)
    last_message = models.BigIntegerField(default=0)
    last_reply = models.JSONField(default=dict)
