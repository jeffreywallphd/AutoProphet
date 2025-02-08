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
import openai
from openai import OpenAI

from decouple import config

client = OpenAI(
    api_key=config('OPENAI_API_KEY'),
)
def extract_qa(text, model="gpt-4", paragraph_size = 1, questions_num = 5):
    prompt = f"""
    I would like to generate some questions and answers from the following text and turn it into a JSON format. 
    so I would like to have {paragraph_size} parts, those parts are going to based on the number of paragraphs, and generate {questions_num} questions from them
    here is how I would like the format to be: 
    [
        {{
            "part": [
                {{
                    "question": "",
                    "answer": ""
                }}
            ]
        }},
        {{
            "part": [
                {{
                    "question": "",
                    "answer": ""
                }}
            ]
        }}
    ]
    part: is going to represent the combined paragraphs 

    
    Text:
    {text}

    I need you to only return the JSON response without anything else. 
    """

    print(prompt)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5  # Adjust for more or less creativity
    )
    return response.choices[0].message.content.strip()

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
    generated_json_data = None

    if request.method == "POST":
        form = DocumentProcessingForm(request.POST)
        if form.is_valid():
            num_paragraphs = form.cleaned_data['num_paragraphs']
            num_questions = form.cleaned_data['num_questions']
            generated_json_text = extract_qa(text=document.content[:3000], paragraph_size=num_paragraphs, questions_num=num_questions)
            print(generated_json_text)
            try:
                generated_json_data = json.loads(generated_json_text)  # Convert string to JSON
                request.session[f'generated_json_{document_id}'] = generated_json_text  # Store in session
            except json.JSONDecodeError:
                generated_json_data = {"error": "Invalid JSON response from OpenAI"}

    else:
        form = DocumentProcessingForm()

    return render(request, 'document_detail.html', {
        'document': document,
        'form': form,
        'json_data': generated_json_data  
    })

def download_json(request, document_id):
    """Serve the generated JSON data as a downloadable file."""
    session_key = f'generated_json_{document_id}'
    generated_json_text = request.session.get(session_key, None)

    if generated_json_text is None:
        return JsonResponse({"error": "No generated JSON available for this document"}, status=404)

    response = HttpResponse(
        generated_json_text,
        content_type="application/json"
    )
    response['Content-Disposition'] = f'attachment; filename="document_{document_id}.json"'
    return response
    


def delete_document(request, document_id):
    document = get_object_or_404(ScrapedData, id=document_id)
    if request.method == "POST":
        document.delete()
        messages.success(request, 'The document has been deleted successfully!')
        return redirect('generate_q_and_a')
    else:
        # If the request is not POST, redirect to the generate_q_and_a page
        return redirect('generate_q_and_a')