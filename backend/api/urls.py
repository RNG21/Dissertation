from django.urls import path

from .views import FlowsView, RunBotView

urlpatterns = [
    path('flows/', FlowsView.as_view(), name='flows'),
    path('run_bot/', RunBotView.as_view(), name='run_bot'),
]

