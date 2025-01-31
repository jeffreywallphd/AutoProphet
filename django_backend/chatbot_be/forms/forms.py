from django import forms
from ..models.Document_Y import Document_y

class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document_y
        fields = ['pdf_file', 'large_text']