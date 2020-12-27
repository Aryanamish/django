from django.urls import path
from . import views

app_name = "slip"

urlpatterns = [

    path('', views.home, name='home'),
]