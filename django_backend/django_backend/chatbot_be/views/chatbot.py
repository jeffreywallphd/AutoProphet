from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Conversation
from ..serializers import ConversationSerializer
import uuid

class SessionCreateView(APIView):
    """
    Handle POST requests to create a new chat session.
    """
    def post(self, request):
        session_id = str(uuid.uuid4())  # Generate a new unique session_id
        return Response({'session_id': session_id}, status=status.HTTP_201_CREATED)

class SessionListView(APIView):
    """
    Handle GET requests to list all existing session IDs.
    """
    def get(self, request):
        sessions = Conversation.objects.values_list('session_id', flat=True).distinct()
        return Response({'sessions': list(sessions)})
    
class ConversationListView(APIView):
    """
    Handle GET requests to retrieve conversation history.
    """
    def get(self, request, session_id):
        conversations = Conversation.objects.filter(session_id=session_id).order_by('timestamp')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)

class ConversationCreateView(APIView):
    """
    Handle POST requests to add a new message to the conversation.
    """
    def post(self, request, session_id):
        data = request.data
        data['session_id'] = session_id  # Associate message with the session ID
        serializer = ConversationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'session_id': session_id, **serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
