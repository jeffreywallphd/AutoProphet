from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from evaluate import load
import torch
from django.shortcuts import render
import traceback

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def model_stats(prompt, model_name, max_length=200, min_length=100, top_k=50, top_p=0.95, references=[]):
    try:
        # Load tokenizer and model with your logic
        if "llama" in model_name.lower() or "meta" in model_name.lower() or "openelm" in model_name.lower():
            tokenizer = AutoTokenizer.from_pretrained(
                "meta-llama/Llama-2-7b-hf", use_fast=False, trust_remote_code=True
            )
            tokenizer.add_bos_token = True
            model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True)
        else:
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(model_name)

        tokenizer.pad_token = tokenizer.eos_token
        model.resize_token_embeddings(len(tokenizer))
        model.to(device)

        # Tokenize the input prompt
        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=128
        ).to(device)

        # Generate the response
        outputs = model.generate(
            inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_length=max_length,
            min_length=min_length,
            do_sample=True,
            top_k=top_k,
            top_p=top_p,
            num_return_sequences=1,
            pad_token_id=tokenizer.pad_token_id
        )

        response = tokenizer.decode(outputs[0], skip_special_tokens=True)

        if isinstance(references, str):
            references = [references]  # Wrap the reference in a list if it's a single string
        elif not isinstance(references, list):
            raise ValueError("References must be a string or a list of strings.")
        
        # Ensure response is a string
        if isinstance(response, str):
            predictions = [response]  # Wrap the prediction in a list if it's a single string
        else:
            raise ValueError("Prediction must be a string.")

        # Calculate metrics
        rouge_metric = load("rouge",trusted_remote_code=True)
        bertscore_metric = load("bertscore",trusted_remote_code=True)
        # f1_metric = load("f1")
        # bertscore_metric = pipeline("text-classification", model="google/bert_uncased_L-2_H-128_A-2",device=0 if torch.cuda.is_available() else -1)

        rouge_scores = rouge_metric.compute(predictions=predictions, references=references)
        bertscore_scores = bertscore_metric.compute(predictions=predictions, references=references,lang="en",device=0 if torch.cuda.is_available() else -1)

        # Collect and return scores
        results = {
            "ROUGE": rouge_scores,
            # "F1": f1_scores,
            "BERTScore": bertscore_scores
        }
        return results

    except Exception as e:
        # Log the full exception details for debugging
        print(f"Error in model_stats: {e}")
        print("".join(traceback.format_exception(None, e, e.__traceback__)))
        raise RuntimeError(f"Error in model_stats: {e}")


class ModelStatisticsView(APIView):

    def get(self, request):
        return render(request, 'model_statistics.html')
    
    """
    API endpoint to generate a chatbot response and compute metrics.
    """
    def post(self, request):
        user_message = request.data.get("message")
        model_name = request.data.get("model_name")
        max_length = request.data.get("max_length", 200)
        min_length = request.data.get("min_length", 100)
        top_k = request.data.get("top_k", 50)
        top_p = request.data.get("top_p", 0.95)
        references = request.data.get("references")

        # Validate inputs
        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not model_name:
            return Response({"error": "Model name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            max_length = int(max_length)
            min_length = int(min_length)
            top_k = int(top_k)
            top_p = float(top_p)
        except ValueError:
            return Response(
                {"error": "Invalid parameters. Ensure max_length, min_length, and top_k are integers, and top_p is a float."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Constraints validation
        if not (1 <= min_length <= max_length <= 1024):
            return Response({"error": "min_length must be <= max_length and within valid range."}, status=status.HTTP_400_BAD_REQUEST)
        if not (0 <= top_p <= 1):
            return Response({"error": "top_p must be between 0 and 1."}, status=status.HTTP_400_BAD_REQUEST)
        if top_k < 0:
            return Response({"error": "top_k must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            stats_result = model_stats(
                prompt=user_message,
                model_name=model_name,
                max_length=max_length,
                min_length=min_length,
                top_k=top_k,
                top_p=top_p,
                references=references
            )
            return Response(stats_result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Error during response generation: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def chatbot_view(request):
    return render(request, 'model_statistics.html')
