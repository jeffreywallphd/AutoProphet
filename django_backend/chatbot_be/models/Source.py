from django.db import models


class Source(models.Model):
    SourceID = models.CharField(max_length=255, primary_key=True)
    SourceName = models.CharField(max_length=255)
    LiscenseID = models.CharField(max_length=255)
    SourceDescription = models.CharField(max_length=255)
    SourceLink = models.CharField(max_length=255)

    class SourceValid(models.IntegerChoices): 
        RANDOM_UNVERIFIED = 1, 'Random/Unverified'
        SOURCED = 2, 'Sourced'
        PUBLISHED_AUDITED_GOVDATA = 3, 'Published/audited/GovData'

    SourceValid = models.IntegerField(
        choices=SourceValid.choices, 
        default=SourceValid.RANDOM_UNVERIFIED
    )
    def str(self):
        return f"Source {self.sourceID} - {self.SourceName} - {self.LiscenseID} - {self.SourceDescription} - {self.SourceLink} (Status: {self.get_SourceValid_display()})"