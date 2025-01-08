from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import evaluate
from django.shortcuts import render

class ModelEvaluationAPIView(APIView):
    def post(self, request):
        try:
            # Parse inputs and expected references from the request
            inputs = request.data.get("inputs", [])
            references = request.data.get("references", [])
            model_name = request.data.get("model_name", "facebook/bart-large-cnn")

            # Validate inputs
            if not inputs or not references or len(inputs) != len(references):
                return Response(
                    {"error": "Inputs and references must be provided and of the same length."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Load model and tokenizer
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

            # Generate predictions
            predictions = []
            for input_text in inputs:
                inputs_tokenized = tokenizer(input_text, return_tensors="pt", truncation=True, padding=True)
                outputs = model.generate(**inputs_tokenized)
                decoded_output = tokenizer.decode(outputs[0], skip_special_tokens=True)
                predictions.append(decoded_output)

            # Compute evaluation metrics
            rouge = evaluate.load("rouge")
            bert_score = evaluate.load("bertscore")

            # ROUGE
            rouge_results = rouge.compute(predictions=predictions, references=references)
            rouge_lsum = rouge_results["rougeLsum"].mid.fmeasure

            # BERTScore
            bert_results = bert_score.compute(predictions=predictions, references=references, model_type="bert-base-uncased")
            bert_f1 = sum(bert_results["f1"]) / len(bert_results["f1"])

            # Return evaluation results
            return Response(
                {
                    "inputs": inputs,
                    "predictions": predictions,
                    "references": references,
                    "metrics": {
                        "ROUGE-LSUM": rouge_lsum,
                        "BERTScore F1": bert_f1,
                    },
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request):
        return render(request, "model_statistics.html")

def model_evaluation_page(request):
    return render(request, "model_statistics.html")
