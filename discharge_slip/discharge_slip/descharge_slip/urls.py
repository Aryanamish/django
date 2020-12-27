"""descharge_slip URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.conf.urls.static import static
from django.conf import settings
import webbrowser
import django.conf as conf
from django.conf.urls import (
handler400, handler403, handler404, handler500
)

handler404 = 'descharge_slip.error_view.page_not_found'
handler403 = 'descharge_slip.error_view.forbidden'
handler500 = 'descharge_slip.error_view.server_error'
handler400 = 'descharge_slip.error_view.bad_request'



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('slip.urls'), name='slip'),
    path('database/', include('database.urls'), name='database'),
    path('print/', include('print.urls'), name='print'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if conf.settings.RUN_BROWSER is True:
    webbrowser.open(conf.settings.LOCAL_SERVER)