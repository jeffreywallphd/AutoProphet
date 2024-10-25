from django.db import models

from .Answer import Answer


class Question(models.Model):
    Question_ID = models.AutoField(primary_key=True)  # Primary key auto-increment
    Question = models.CharField(max_length=255)  # The question itself
    answer_id = models.ForeignKey(Answer,  on_delete=models.CASCADE, blank= False, null = False)

    def __str__(self):
      return f"Question: {self.Question} - Answer: {self.answer_id}"
