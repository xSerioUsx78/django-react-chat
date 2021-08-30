from django.urls import path
from .views import LoginAPIView, RegisterAPIView, UserAPIView


urlpatterns = [
    path('login/', LoginAPIView.as_view()),
    path('register/', RegisterAPIView.as_view()),
    path('user/', UserAPIView.as_view())
]