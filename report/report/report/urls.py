
from django.conf.urls import url
from . import views
from django.urls import path, include

app_name = 'report'

urlpatterns = [

    # url(r'^(?P<pk>[0-9]+)/$', views.indexView.as_view(), name="index"),
    url(r'^$', views.homePage.as_view(), name="index"),
    path('report/<slug:slug_val>/', views.report, name='report'),
    #path('lay/', views.layout, name="layout")


]
