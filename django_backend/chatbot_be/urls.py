from django.urls import path
from .views.chatbot import chatbot_view
from .views.home import home_view
from .views.scarpe import ScrapeDataView, scrape_view
# from .views.scrape import ScrapeDataView, scrape_view
# from .views.home_template import home_view
from .views import SessionCreateView, ConversationListView, ConversationCreateView, SessionListView

urlpatterns = [
    path('chatbot/', SessionCreateView.as_view(), name='create-session'),
    path('chatbot/sessions/', SessionListView.as_view(), name='list-sessions'),
    path('chatbot/<str:session_id>/', ConversationListView.as_view(), name='get-conversation'),
    path('chatbot/<str:session_id>/add/', ConversationCreateView.as_view(), name='post-message'),
    path('scrape/', ScrapeDataView.as_view(), name='scrape-data'),
    path('chatbot_view/', chatbot_view, name='chatbot-view'),  
    path('home_view/', home_view, name='home-view'),  
    path('scrape_view/', scrape_view, name='scrape-view'),
]