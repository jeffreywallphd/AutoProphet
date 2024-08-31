from django.contrib import admin
from .models import Chatbots

class ChatbotAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

admin.site.register(Chatbots,ChatbotAdmin)