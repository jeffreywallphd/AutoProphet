# views/conversation.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Conversation
from ..serializers import ConversationSerializer

class ConversationListView(APIView):
    """
    Handle GET requests to retrieve conversation history
    and POST requests to add a new message to the conversation.
    """
    def get(self, request, session_id):
        conversations = Conversation.objects.filter(session_id=session_id).order_by('timestamp')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)

    def post(self, request, session_id):
        data = request.data
        data['session_id'] = session_id  # Associate message with the session ID
        serializer = ConversationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
