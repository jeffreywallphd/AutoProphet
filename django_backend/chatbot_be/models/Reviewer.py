from django.db import models

class Reviewer(models.Model):
    Review_ID = models.IntegerField(primary_key=True)  # Unique identifier for each conversation
    FirstName = models.CharField(max=255)  # First Name
    LastName = models.CharField(max=255)  # Last Name

    def __str__(self):
        return f"Reviewer {self.Review_ID}: {self.FirstName} {self.LastName}"