from django.urls import path
from . import views

app_name = "print"

urlpatterns = [

    path('pdf/', views.show_pdf, name='pdf'),

]