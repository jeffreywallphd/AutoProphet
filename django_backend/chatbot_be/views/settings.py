from django.shortcuts import render
from django.http import JsonResponse
import os

def settings_view(request):
    if request.method == 'POST':
        # Fetch form data
        env_data = {
            'DATABASE_NAME': request.POST.get('DATABASE_NAME'),
            'DATABASE_USER': request.POST.get('DATABASE_USER'),
            'DATABASE_PASSWORD': request.POST.get('DATABASE_PASSWORD'),
            'DATABASE_HOST': request.POST.get('DATABASE_HOST'),
            'DATABASE_PORT': request.POST.get('DATABASE_PORT'),
            'WANDB_API_KEY': request.POST.get('WANDB_API_KEY'),
            'HF_API_KEY': request.POST.get('HF_API_KEY'),
            'OPENAI_API_KEY': request.POST.get('OPENAI_API_KEY')
        }

        try:
            # Open the .env file and update with new data
            with open('.env', 'w') as f:
                for key, value in env_data.items():
                    if value:
                        f.write(f"{key}={value}\n")

            return JsonResponse({"status": "success", "message": "Settings updated successfully!"})

        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Failed to update .env file: {e}"})

    return render(request, 'settings.html')
