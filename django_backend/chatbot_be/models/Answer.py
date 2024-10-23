from django.db import models


class Answer(models.Model):
    AnswerID = models.IntegerField(primary_key= True)
    Link = models.CharField(max_length=255, null=True)
    PageNum = models.IntegerField()
    Answer = models.CharField(max_length=255)
    LastDayScraped = models.DateField()
    CopyrightDate = models.DateField()
    OutdatedFlag = models.IntegerChoices()
    FlagNewAnswerID = models.IntegerChoices()
    AnswerRating = models.IntegerChoices()

    class AnswerValid(models.IntegerChoices): 
        RANDOM_UNVERIFIED = 1, 'Random/Unverified'
        SOURCED = 2, 'Sourced'
        PUBLISHED_AUDITED_GOVDATA = 3, 'Published/audited/GovData'

    AnswerValid = models.IntegerField(
        choices=AnswerValid.choices, 
        default=AnswerValid.RANDOM_UNVERIFIED
    )
    DocID = models.CharField(max_length=255)
    LiscenseID = models.CharField(max_length=255)
    QuestionID = models.CharField(max_length=255)

    def str(self):
        return f"Answer {self.AnswerID} - {self.Link} - {self.PageNum} - {self.Answer} - {self.LastDayScraped} - {self.CopyrightDate} - {self.OutdatedFlag} - {self.FlagNewAnswerID} - {self.DocID} - {self.LiscenseID} - {self.QuestionID} (Status: {self.get_AnswerValid_display()})"