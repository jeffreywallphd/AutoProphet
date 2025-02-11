from django import forms
from ..models.Document_Y import Document_y

class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document_y
        fields = ['pdf_file', 'large_text']




class DocumentProcessingForm(forms.Form):
    TEST_CHOICES = [
        ('real', 'Real Test'),
        ('mockup', 'Mock-up Test'),
    ]

    test_type = forms.ChoiceField(
        choices=TEST_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'}),
        label="Test Type"
    )

    num_paragraphs = forms.IntegerField(
        label="Number of Paragraphs",
        min_value=1,
        widget=forms.NumberInput(attrs={'class': 'form-control'})
    )
    num_questions = forms.IntegerField(
        label="Number of Questions",
        min_value=1,
        widget=forms.NumberInput(attrs={'class': 'form-control'})
    )