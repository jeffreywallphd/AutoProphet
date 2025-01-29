from django.urls import path
from .views.model_statistics import ModelStatisticsView
from .views.chatbot import chatbot_view
from .views.home import home_view
from .views.model_training import train_model_view, stream_training_output
from .views.scrape import ScrapeDataView, UploadPDFView, scrape_view
from .views import SessionCreateView, ConversationListView, ConversationCreateView, SessionListView, ChatbotGenerateResponseView

urlpatterns = [
    path('chatbot/', SessionCreateView.as_view(), name='create-session'),
    path('chatbot/sessions/', SessionListView.as_view(), name='list-sessions'),
    path('chatbot/<str:session_id>/', ConversationListView.as_view(), name='get-conversation'),
    path('chatbot/<str:session_id>/add/', ConversationCreateView.as_view(), name='post-message'),
    path('chatbot/<str:session_id>/response/', ChatbotGenerateResponseView.as_view(), name='generate-response'),
    path("model_statistics/", ModelStatisticsView.as_view(), name="model-statistics"),
    path('chatbot_view/', chatbot_view, name='chatbot-view'),  
    path('home_view/', home_view, name='home-view'),  
    path('scrape_view/', scrape_view, name='scrape-view'),
    path("train_model/", train_model_view, name="train-view"),
    path("stream-training/",stream_training_output, name="stream-training"),
    path('scrape/', ScrapeDataView.as_view(), name='scrape-data'),
    path('upload_pdf/', UploadPDFView.as_view(), name='upload-pdf'),
]