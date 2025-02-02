from django.shortcuts import render, redirect
from ..forms.forms import DocumentForm, DocumentProcessingForm
from ..models.scraped_data import ScrapedData
from PyPDF2 import PdfReader
from django.shortcuts import get_object_or_404
from django.contrib import messages
import json
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from django.http import HttpResponseRedirect

def generate_q_and_a(request):
    documents = ScrapedData.objects.all()[::-1]
    if request.method == "POST":
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            document = form.save(commit=False)

            if 'pdf_file' in request.FILES:
                pdf_file = request.FILES['pdf_file']
                reader = PdfReader(pdf_file)
                pdf_text = ""
                for page in reader.pages:
                    pdf_text += page.extract_text()
                
                document.large_text = pdf_text  

            document.save()
            messages.success(request, 'The document has been submitted successfully!')
            return redirect('generate_q_and_a')
    else:
        form = DocumentForm()

    return render(request, "generate_q_and_a.html", {"form": form, "documents":documents})



def document_detail(request, document_id):
    document = get_object_or_404(ScrapedData, id=document_id)
    fake_json_data = None

    if request.method == "POST":
        form = DocumentProcessingForm(request.POST)
        if form.is_valid():
            # Load fake JSON data from file
            with open("F:/Github_Cloned_Branches/AutoProphet/AutoProphet/django_backend/media/JSON/Introduction to Text Segmentation.json", 'r', encoding='utf-8') as file:
                fake_json_data = json.load(file)
    else:
        form = DocumentProcessingForm()

    return render(request, 'document_detail.html', {
        'document': document,
        'form': form,
        'fake_json_data': fake_json_data
    })

def download_json(request, document_id):
    """Serve the fake JSON data as a downloadable file."""
    try:
        with open("F:/Github_Cloned_Branches/AutoProphet/AutoProphet/django_backend/media/JSON/Introduction to Text Segmentation.json", 'r', encoding='utf-8') as file:
            fake_json_data = json.load(file)

        response = HttpResponse(
            json.dumps(fake_json_data, indent=4),
            content_type="application/json"
        )
        response['Content-Disposition'] = f'attachment; filename="document_{document_id}.json"'
        return response

    except FileNotFoundError:
        return JsonResponse({"error": "JSON file not found"}, status=404)
    


def delete_document(request, document_id):
    document = get_object_or_404(ScrapedData, id=document_id)
    if request.method == "POST":
        document.delete()
        messages.success(request, 'The document has been deleted successfully!')
        return redirect('generate_q_and_a')
    else:
        # If the request is not POST, redirect to the generate_q_and_a page
        return redirect('generate_q_and_a')