from django.urls import path

from . views import ChatbotListView

urlpatterns = [
    path('chatbots/', ChatbotListView.as_view(), name='chatbot-list'),
    # Add more API endpoints as needed
]
