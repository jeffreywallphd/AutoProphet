from django.shortcuts import render, redirect
from ..forms.forms import DocumentForm
from ..models.scraped_data import ScrapedData
from PyPDF2 import PdfReader
from django.shortcuts import get_object_or_404
from django.contrib import messages

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
    return render(request, "document_detail.html", {"document": document})