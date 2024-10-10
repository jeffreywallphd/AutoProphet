from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json
import os
from bs4 import BeautifulSoup
from django.shortcuts import render

class ScrapeDataView(APIView):
    def get(self, request):
        url = request.GET.get('url')
        output_file_base = request.GET.get('output_file')

        if not url or not output_file_base:
            return Response({'error': 'Please provide both URL and output file name.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the data from the URL
            response = requests.get(url)
            response.raise_for_status()  # Raise an error for bad status codes
        except requests.RequestException as e:
            return Response({'error': f'Failed to retrieve data from the URL. Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Detect the content type
        content_type = response.headers.get('Content-Type', '').lower()

        # Save the output file in the current working directory
        output_file = f'{output_file_base}'  # No need for settings.MEDIA_ROOT

        if 'application/json' in content_type:
            extension = 'json'
            output_file += f'.{extension}'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(response.json(), f, indent=4)
            message = f'Successfully saved JSON data to {output_file}'

        elif 'application/xml' in content_type or 'text/xml' in content_type:
            extension = 'xml'
            output_file += f'.{extension}'
            with open(output_file, 'wb') as f:
                f.write(response.content)
            message = f'Successfully saved XML data to {output_file}'

        elif 'text/html' in content_type:
            extension = 'html'
            output_file += f'.{extension}'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(BeautifulSoup(response.content, 'html.parser').prettify())
            message = f'Successfully saved HTML data to {output_file}'

        elif 'text/csv' in content_type or 'application/csv' in content_type:
            extension = 'csv'
            output_file += f'.{extension}'
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                f.write(response.content.decode('utf-8'))
            message = f'Successfully saved CSV data to {output_file}'

        elif 'application/vnd.ms-excel' in content_type or 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' in content_type:
            extension = 'xlsx'
            output_file += f'.{extension}'
            with open(output_file, 'wb') as f:
                f.write(response.content)
            message = f'Successfully saved Excel data to {output_file}'

        else:
            return Response({'error': f'Unsupported content type: {content_type}'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': message}, status=status.HTTP_200_OK)

# Template view to render the HTML file
def scrape_view(request):
    return render(request, 'scrape.html')