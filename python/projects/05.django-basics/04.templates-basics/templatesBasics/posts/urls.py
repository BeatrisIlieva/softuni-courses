from django.urls import path

from templatesBasics.posts.views import index, dashboard


urlpatterns = [
    path('', index, name = 'index'),
    path('dashboard', dashboard, name='dashboard'),
]

