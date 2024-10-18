from django.db import models

class ScrapedData(models.Model):
    url = models.URLField(max_length=500)
    file_type = models.CharField(max_length=50)
    content = models.TextField(null=True, blank=True)  # For non-binary content
    binary_content = models.BinaryField(null=True, blank=True)  # For binary content
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Scraped from {self.url} ({self.file_type})'