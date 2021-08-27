from django.urls import path
from django.conf.urls import include


urlpatterns = [
    path('api/', include('users.api.urls'))
]
