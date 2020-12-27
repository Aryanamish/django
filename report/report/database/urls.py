from . import views
from django.urls import path

app_name = 'database'

urlpatterns = [


   path('', views.main, name='main'),
   path('save/', views.ajaxSave, name='ajax_save'),
   path('load/', views.ajaxLoad, name='ajax_load'),
   path('update/', views.ajaxUpdate, name='ajax_update'),



]
