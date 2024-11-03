from django.contrib import admin 
from .models.scraped_data import ScrapedData as ScrapedDataTable
from .models import License as LicenseTable
from .models import Question as QuestionTable
from .models import ReviewAnswer as ReviewAnswerTable
from .models import QuestionAnswer as QuestionAnswerTable
from .models import Reviewer as ReviewerTable
from .models import Answer as AnswerTable
from .models import Source as SourceTable
from .models import Document as DocumentTable

admin.site.register(ScrapedDataTable)
admin.site.register(LicenseTable)
admin.site.register(QuestionTable)
admin.site.register(ReviewAnswerTable)
admin.site.register(QuestionAnswerTable)
admin.site.register(ReviewerTable)
admin.site.register(AnswerTable)
admin.site.register(SourceTable)
admin.site.register(DocumentTable)