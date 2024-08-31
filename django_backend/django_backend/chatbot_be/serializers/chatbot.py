from rest_framework import serializers
from ..models.chatbot import Chatbots

class ChatbotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatbots
        fields = '__all__'
