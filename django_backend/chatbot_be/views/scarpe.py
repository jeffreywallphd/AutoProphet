from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json
from bs4 import BeautifulSoup
from django.shortcuts import render
from openpyxl import load_workbook
from io import BytesIO
from ..models.scraped_data import ScrapedData  # Import the model to save data

class ScrapeDataView(APIView):
    def get(self, request):
        url = request.GET.get('url')

        if not url:
            return Response({'error': 'Please provide a URL.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the data from the URL
            response = requests.get(url)
            response.raise_for_status()  # Raise an error for bad status codes
        except requests.RequestException as e:
            return Response({'error': f'Failed to retrieve data from the URL. Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Detect the content type
        content_type = response.headers.get('Content-Type', '').lower()

        # Initialize variables for content storage
        scraped_content = None
        binary_content = None
        file_type = None

        if 'application/json' in content_type:
            file_type = 'json'
            scraped_content = json.dumps(response.json(), indent=4)  # Convert JSON to string

        elif 'application/xml' in content_type or 'text/xml' in content_type:
            file_type = 'xml'
            scraped_content = response.content.decode('utf-8')  # Decode XML content

        elif 'text/html' in content_type:
            file_type = 'html'
            scraped_content = BeautifulSoup(response.content, 'html.parser').prettify()  # Clean up HTML

        elif 'text/csv' in content_type or 'application/csv' in content_type:
            file_type = 'csv'
            scraped_content = response.content.decode('utf-8')  # Decode CSV content

        elif 'application/vnd.ms-excel' in content_type or 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' in content_type:
            file_type = 'xlsx'

            # For xlsx, we store the binary content
            try:
                binary_content = response.content  # Store the binary content as is
            except Exception as e:
                return Response({'error': f'Error processing xlsx file: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return Response({'error': f'Unsupported content type: {content_type}'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the scraped data to the database
        scraped_data = ScrapedData.objects.create(
            url=url,
            file_type=file_type,
            content=scraped_content if scraped_content else None,  # Store text content if available
            binary_content=binary_content if binary_content else None  # Store binary content if available
        )

        # return Response({'success': f'Successfully saved data from {url} to the database.'}, status=status.HTTP_200_OK)
    
        # Fetch the latest scraped data after saving
        latest_scraped_data = ScrapedData.objects.latest('created_at')

        # API response after saving the data
        return Response({
            'success': f'Successfully saved data from {url} to the database.',
            'url': latest_scraped_data.url,
            'file_type': latest_scraped_data.file_type,
            'content': latest_scraped_data.content
        }, status=status.HTTP_200_OK)

# Template view to render the latest scraped data
def scrape_view(request):
    # Fetch the most recent scraped data
    try:
        latest_scraped_data = ScrapedData.objects.latest('created_at')  # Get the latest entry
    except ScrapedData.DoesNotExist:
        latest_scraped_data = None  # Handle case if no data exists

    # Pass the latest data to the template
    return render(request, 'scrape.html', {'latest_scraped_data': latest_scraped_data})
