from django.db import models
import Question as QuestionTable
import Answer as AnswerTable

class QuestionAnswer(models.Model):
    question_id = models.ForeignKey(QuestionTable, on_delete=models.CASCADE, blank= False, null = False)
    answer_id = models.ForeignKey(AnswerTable,  on_delete=models.CASCADE, blank= False, null = False)


    def __str__(self):
        return f"Question: {self.question_id.question_text} - Answer: {self.answer_id.answer_text}"

