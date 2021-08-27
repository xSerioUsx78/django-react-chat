import json
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

User = settings.AUTH_USER_MODEL

# Create your models here.


class Chat(models.Model):
    users = models.ManyToManyField(User, related_name='chats')
    is_private = models.BooleanField(default=False)
    is_group = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=timezone.now)
    last_update = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return str(self.pk)

    def get_messages(self):
        return self.messages.filter(is_removed=False).order_by('timestamp')

    def get_last_message(self):
        last_message = self.get_messages().values('user_id', 'text').last()
        return json.dumps(last_message)


class File(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='chat_files')
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(blank=True, null=True)

    def __str__(self):
        return self.user.username

    def get_file(self):
        if self.file:
            return self.file.url
        return '/static/main/img/default.jpg'


class Message(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='chat_messages')
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name='messages')
    text = models.TextField(blank=True, null=True)
    file = models.ForeignKey(
        File, on_delete=models.CASCADE, related_name='files', blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    unsean = models.BooleanField(default=True)
    is_removed = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
