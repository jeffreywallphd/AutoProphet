from django.shortcuts import render

def chatbot_view(request):
    return render(request, 'chatbot/chatbot.html')
