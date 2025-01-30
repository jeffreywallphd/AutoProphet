from django.shortcuts import render


def generate_q_and_a(request):
    return render(request, "generate_q_and_a.html")