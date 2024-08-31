from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.chatbot import Chatbots
from ..serializers.chatbot import ChatbotSerializer

class ChatbotListView(APIView):
 def get(self, request):
        chatbots = Chatbots.objects.all()
        serializer = ChatbotSerializer(chatbots, many=True)
        return Response(serializer.data)
