from django.shortcuts import render
from django.http import JsonResponse
from transformers import GPT2LMHeadModel, GPT2Tokenizer, TrainingArguments, Trainer
from datasets import load_dataset
import os
import wandb
import gc
import torch

print(torch.cuda.is_available())
def train_model_view(request):
    if request.method == "POST":
        try:
            # Parse user-configurable parameters from the request
            learning_rate = float(request.POST.get("learning_rate", 2e-5))
            num_epochs = int(request.POST.get("num_epochs", 3))
            batch_size = int(request.POST.get("batch_size", 1))
            project_name = request.POST.get("project_name", "your_project_name")
            wandb_key = request.POST.get("wandb_key")
            fp16 = request.POST.get("fp16", True)
            weight_decay = float(request.POST.get("weight_decay", 0.01))

            print(torch.cuda.is_available())
            # Check for GPU
            device = "cuda" if torch.cuda.is_available() else "cpu"
            if device == "cpu":
                return JsonResponse({
                    "status": "error",
                    "message": "No GPU found. Please ensure a GPU is available and properly configured."
                })

            # Initialize W&B
            wandb.login(key=wandb_key)
            wandb.init(project=project_name)

            # Load dataset
            dataset = load_dataset("FinGPT/fingpt-fiqa_qa")
            dataset = dataset.rename_column("input", "Question").rename_column("output", "Answer")
            dataset = dataset.remove_columns([col for col in dataset.column_names["train"] if col not in ["Question", "Answer"]])

            # Load model and tokenizer
            model_name = "gpt2"
            tokenizer = GPT2Tokenizer.from_pretrained(model_name)
            model = GPT2LMHeadModel.from_pretrained(model_name)
            tokenizer.pad_token = tokenizer.eos_token

            # Move model to GPU
            model.to(device)

            # Tokenization function
            def tokenize_function(examples):
                inputs = tokenizer(
                    [f"{q} {a}" for q, a in zip(examples["Question"], examples["Answer"])],
                    padding="max_length",
                    truncation=True,
                    max_length=128
                )
                inputs["labels"] = inputs["input_ids"]
                return inputs

            # Split dataset and preprocess
            train_test_split = dataset["train"].train_test_split(test_size=0.1)
            train_dataset = train_test_split['train'].map(tokenize_function, batched=True)
            eval_dataset = train_test_split['test'].map(tokenize_function, batched=True)

            # Training arguments
            training_args = TrainingArguments(
                output_dir=os.path.join("results"),  # Results directory
                evaluation_strategy="epoch",
                learning_rate=learning_rate,
                per_device_train_batch_size=batch_size,
                per_device_eval_batch_size=batch_size,
                num_train_epochs=num_epochs,
                weight_decay=weight_decay,
                logging_dir=os.path.join("logs"),
                load_best_model_at_end=True,
                save_strategy="epoch",
                report_to="wandb",
                gradient_checkpointing=True,
                fp16=fp16,
            )

            # Trainer
            trainer = Trainer(
                model=model,
                args=training_args,
                train_dataset=train_dataset,
                eval_dataset=eval_dataset,
                tokenizer=tokenizer,  # Add tokenizer for tokenized output
            )

            # Train the model
            trainer.train()

            # Cleanup
            del train_dataset, eval_dataset
            gc.collect()

            return JsonResponse({"status": "success", "message": "Training completed successfully!"})

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    
    return render(request, "model_training.html")
