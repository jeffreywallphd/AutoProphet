from django.shortcuts import render
from django.conf import settings
from django.conf.urls.static import static

def home_view(request):
    return render(request, 'home.html')