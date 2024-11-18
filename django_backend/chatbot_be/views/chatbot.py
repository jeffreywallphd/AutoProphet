from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Conversation
from ..serializers import ConversationSerializer
import uuid
from django.shortcuts import render
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from django.conf import settings
from django.conf.urls.static import static


# Load the GPT-2 model and tokenizer once during server initialization
MODEL_PATH = "chatbot_be/trained_models/trained_model_GPT_16K"
tokenizer = GPT2Tokenizer.from_pretrained(MODEL_PATH)
model = GPT2LMHeadModel.from_pretrained(MODEL_PATH)

def generate_gpt2_response(prompt, max_length=50):
    """
    Generate a response from the GPT-2 model based on the input prompt.
    """
    inputs = tokenizer.encode(prompt, return_tensors='pt')
    outputs = model.generate(inputs, max_length=max_length, num_return_sequences=1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

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

class ChatbotGenerateResponseView(APIView):
    """
    Handle POST requests to generate a chatbot response using GPT-2
    and save the chat to the database.
    """
    def post(self, request, session_id):
        # Ensure that 'message' exists in the request body
        if 'message' not in request.data:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_message = request.data['message']  # Access the message directly
        if not user_message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate GPT-2 response
        bot_response = generate_gpt2_response(user_message)

        # Save user message to the database
        user_message_data = {
            'session_id': session_id,
            'message': user_message,
            'sender': 'user',  # Assuming 'sender' distinguishes user and bot
        }
        user_serializer = ConversationSerializer(data=user_message_data)
        if user_serializer.is_valid():
            user_serializer.save()

        # Save bot response to the database
        bot_message_data = {
            'session_id': session_id,
            'message': bot_response,
            'sender': 'bot',  # Assuming 'sender' distinguishes user and bot
        }
        bot_serializer = ConversationSerializer(data=bot_message_data)
        if bot_serializer.is_valid():
            bot_serializer.save()

        return Response({'user_message': user_message, 'bot_response': bot_response}, status=status.HTTP_200_OK)

def chatbot_view(request):
    return render(request, 'chatbot.html')