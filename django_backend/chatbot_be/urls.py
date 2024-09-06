from django.urls import path
from .views.chatbot_template import chatbot_view
from .views import SessionCreateView, ConversationListView, ConversationCreateView, SessionListView

urlpatterns = [
     path('chatbot/', SessionCreateView.as_view(), name='create-session'),
    path('chatbot/sessions/', SessionListView.as_view(), name='list-sessions'),
    path('chatbot/<str:session_id>/', ConversationListView.as_view(), name='get-conversation'),
    path('chatbot/<str:session_id>/add/', ConversationCreateView.as_view(), name='post-message'),
    path('chatbot_view/', chatbot_view, name='chatbot-view'),  # New URL for serving the HTML file
]