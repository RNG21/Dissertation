from django.urls import path

from .views import FlowsView

urlpatterns = [
    path('flows/', FlowsView.as_view(), name='flows'),
]

