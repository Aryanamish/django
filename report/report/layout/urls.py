from . import views
from django.urls import path, include

app_name = 'layout'

urlpatterns = [


   path('', views.main, name='main'),
   path('templates/save/', views.saveTemp, name='saveTemp'),
   path('templates/load/', views.loadTemp, name="loadTemp"),
   path('templates/check/', views.checkTemp, name='checkTemp'),


]
