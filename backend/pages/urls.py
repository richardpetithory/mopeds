from django.urls import path

from . import views

urlpatterns = [
    path('<slug:slug>', views.render_page),
    path('', views.render_page),
]
