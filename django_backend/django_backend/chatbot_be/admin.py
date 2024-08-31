from django.contrib import admin
from .models import chatbot

class chatbot(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

