from django.db.models import query
from rest_framework import generics
from rest_framework import permissions
from .serializers import ContactSerializer
from ..models import Chat


class ContactAPIVIew(generics.ListAPIView):
    permissions = (permissions.IsAuthenticated,)
    queryset = Chat.objects.all().order_by('-last_update')
    serializer_class = ContactSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(users=self.request.user)
        return queryset
