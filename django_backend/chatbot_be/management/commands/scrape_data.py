from django.core.management.base import BaseCommand
import requests
import os
import mimetypes
import csv
import json
import pandas as pd
from lxml import etree
from bs4 import BeautifulSoup

class Command(BaseCommand):
    help = 'Scrapes data from the provided URL, detects its format, and saves it appropriately'

    def add_arguments(self, parser):
        parser.add_argument('url', type=str, help='The URL to scrape data from')
        parser.add_argument('output_file', type=str, help='The base name of the output file (without extension)')

    def handle(self, *args, **kwargs):
        url = kwargs['url']
        output_file_base = kwargs['output_file']

        # Get the data from the URL
        response = requests.get(url)

        if response.status_code == 200:
            content_type = response.headers['Content-Type']

            # Handle content type detection
            if 'application/json' in content_type:
                self.handle_json(response, output_file_base)
            elif 'application/xml' in content_type or 'text/xml' in content_type:
                self.handle_xml(response, output_file_base)
            elif 'text/html' in content_type:
                self.handle_html(response, output_file_base)
            elif 'text/csv' in content_type or 'application/csv' in content_type:
                self.handle_csv(response, output_file_base)
            elif 'application/vnd.ms-excel' in content_type or 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' in content_type:
                self.handle_excel(response, output_file_base)
            else:
                self.stdout.write(self.style.ERROR(f'Unsupported content type: {content_type}'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to retrieve data. Status code: {response.status_code}'))

    def handle_json(self, response, output_file_base):
        """Save JSON data"""
        output_file = f'{output_file_base}.json'
        data = response.json()
        with open(output_file, 'w') as file:
            json.dump(data, file, indent=4)
        self.stdout.write(self.style.SUCCESS(f'Successfully saved JSON data to {output_file}'))

    def handle_xml(self, response, output_file_base):
        """Save XML data"""
        output_file = f'{output_file_base}.xml'
        with open(output_file, 'wb') as file:
            file.write(response.content)
        self.stdout.write(self.style.SUCCESS(f'Successfully saved XML data to {output_file}'))

    def handle_html(self, response, output_file_base):
        """Save HTML data"""
        output_file = f'{output_file_base}.html'
        soup = BeautifulSoup(response.content, 'html.parser')
        with open(output_file, 'w') as file:
            file.write(soup.prettify())
        self.stdout.write(self.style.SUCCESS(f'Successfully saved HTML data to {output_file}'))

    def handle_csv(self, response, output_file_base):
        """Save CSV data"""
        output_file = f'{output_file_base}.csv'
        content = response.content.decode('utf-8')
        with open(output_file, 'w', newline='') as file:
            file.write(content)
        self.stdout.write(self.style.SUCCESS(f'Successfully saved CSV data to {output_file}'))

    def handle_excel(self, response, output_file_base):
        """Save Excel data"""
        output_file = f'{output_file_base}.xlsx'
        with open(output_file, 'wb') as file:
            file.write(response.content)
        self.stdout.write(self.style.SUCCESS(f'Successfully saved Excel data to {output_file}'))
