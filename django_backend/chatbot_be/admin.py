from django.contrib import admin
# (EXAMPLE) from .models import Conversation as ConversationTable
from .models import License as LicenseTable
from .models import Question as QuestionTable
from .models import ReviewAnswer as ReviewAnswerTable
from .models import ScrapeRawData as ScrapeRawDataTable
from .models import Reviewer as ReviewerTable
from .models import Answer as AnswerTable
from .models import Source as SourceTable
from .models import Document as DocumentTable







#(EXAMPLE) admin.site.register(ConversationTable)
admin.site.register(LicenseTable)
admin.site.register(QuestionTable)
admin.site.register(ReviewAnswerTable)
admin.site.register(ScrapeRawDataTable)
admin.site.register(ReviewerTable)
admin.site.register(AnswerTable)
admin.site.register(SourceTable)
admin.site.register(DocumentTable)