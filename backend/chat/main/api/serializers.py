from rest_framework import serializers
from ..models import Chat, Message
from users.models import User, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user', 'image')


class UsersSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'profile')


class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'user', 'text')


class ContactSerializer(serializers.ModelSerializer):

    users = UsersSerializer(many=True, read_only=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ('id', 'users', 'messages', 'is_private', 'is_group')

    def get_messages(self, obj):
        return MessagesSerializer(instance=obj.messages.order_by('-timestamp').first()).data
