# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):

    """
    i tried to keep the project as simple as it can be
    """

    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.chat_group_id = f'chat_{self.chat_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.chat_group_id,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.chat_group_id,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        command = text_data_json['command']
        await self.command_management(command, text_data_json)

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = event['user']
        image = event['image']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': {
                'text': message,
                'user': user,
                'user__profile__image': image
            },
            'command': 'new_message',
        }))

    async def fetch_messages(self, event):
        messages = event['messages']

        await self.send(text_data=json.dumps({
            'messages': messages,
            'command': 'messages',
        }))

    async def send_message_to_room_group(self, data):
        await self.channel_layer.group_send(self.chat_group_id, data)

    async def command_management(self, command, data):
        if command == 'new_message':
            message = data['message']
            user = data['user']
            image = data['image']
            await self.save_message(user, message)

            room_group_message = {
                'type': 'chat_message',
                'message': message,
                'user': user,
                'image': image
            }

            await self.send_message_to_room_group(room_group_message)
        elif command == 'fetch_messages':
            messages = await self.fetch_message()
            room_group_message = {
                'type': 'fetch_messages',
                'messages': messages
            }
            await self.send_message_to_room_group(room_group_message)

    @database_sync_to_async
    def save_message(self, user, text):
        Message.objects.create(user_id=user, text=text, chat_id=self.chat_id)

    @database_sync_to_async
    def fetch_message(self):
        return list(
            Message.objects.filter(chat_id=self.chat_id).values(
                'user', 'text', 'user__profile__image')
        )
