from django.urls import path
from .views import ContactAPIVIew


urlpatterns = [
    path('contact/', ContactAPIVIew.as_view())
]
