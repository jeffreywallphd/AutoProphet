from django.db import models


class Document(models.Model):
    DocID = models.CharField(max_length=255, primary_key= True)
    DocDescription = models.CharField()
    DocLink = models.CharField(max_length=255)
    LastDateScraped = models.DateField()
    DocName = models.CharField(max_length=255)
    SourceID = models.CharField(max_length=255)
    LiscenceID = models.CharField(max_length=255)

    class DocValid(models.IntegerChoices): 
        RANDOM_UNVERIFIED = 1, 'Random/Unverified'
        SOURCED = 2, 'Sourced'
        PUBLISHED_AUDITED_GOVDATA = 3, 'Published/audited/GovData'

    DocValid = models.IntegerField(
        choices=DocValid.choices, 
        default=DocValid.RANDOM_UNVERIFIED
    )
    def str(self):
        return f"Document {self.DocID} - {self.DocDescription} - {self.DocLink} - {self.LastDateScraped} - {self.DocName} - {self.SourceID} - {self.LiscenceID} (Status: {self.get_DocValid_display()})"