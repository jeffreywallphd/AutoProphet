from django.contrib import admin
from .models import chatbot

class ChatbotAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

admin.site.register(chatbot,ChatbotAdmin)