from django.urls import path
from . import views

app_name = "database"

urlpatterns = [
    path('query/', views.query, name='query'),
    path('diagnosis/', views.diagnosis, name='diagnosis'),
    path('complain/', views.complain, name='complain'),
    path('ot-procedure/', views.ot_procedure, name='ot-procedure'),
    path('medicine/', views.medicine, name='medicine'),
]