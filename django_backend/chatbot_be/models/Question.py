from django.db import models

class Question(models.Model):
    Question_ID = models.AutoField(primary_key=True)  # Primary key auto-increment
    Question = models.CharField(max=255)  # The question itself
    answer = models.ForeignKey(
  #FOREIGN KEY
  #       Answer, on_delete=models.CASCADE, related_name='review_answers'
    )  # Foreign key linking to Answer model
    #
    def __str__(self):
        return f"ReviewAnswer {self.RevAnswer_ID} - Score: {self.ScoreScale}"