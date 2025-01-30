from django.shortcuts import render
from django.http import JsonResponse



def train_model_view(request):
    return JsonResponse(request, "Hello World")
