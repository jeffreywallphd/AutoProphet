from django.contrib import admin
from .models.scraped_data import ScrapedData as ScrapedDataTable
from .models import Conversation as ConversationTable

admin.site.register(ConversationTable),
admin.site.register(ScrapedDataTable)