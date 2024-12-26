from django.shortcuts import render
from django.http import JsonResponse
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer, LlamaForCausalLM, LlamaTokenizer
from datasets import load_dataset
import os
import wandb
import gc
import torch
from decouple import config
from huggingface_hub import login

# Set environment variables for CUDA debugging
# os.environ["CUDA_LAUNCH_BLOCKING"] = "1"  # Ensures synchronous error reporting

# Retrieve API keys from environment variables
DEFAULT_WANDB_API_KEY = config("WANDB_API_KEY", default="")
DEFAULT_HF_API_KEY = config("HF_API_KEY", default="")

print(f"CUDA available: {torch.cuda.is_available()}")

def train_model_view(request):
    if request.method == "POST":
        try:
            # Parse user-configurable parameters from the request
            model_name = request.POST.get("model_name", "gpt2")
            learning_rate = float(request.POST.get("learning_rate", 2e-5))
            num_epochs = int(request.POST.get("num_epochs", 3))
            batch_size = int(request.POST.get("batch_size", 1))
            project_name = request.POST.get("project_name", "your_project_name")
            gradient_checkpointing = request.POST.get("gradient_checkpointing") == "on"
            max_grad_norm = float(request.POST.get("max_grad_norm", 1.0))
            fp16 = request.POST.get("fp16") == "off"
            bf16 = request.POST.get("bf16") == "off"
            weight_decay = float(request.POST.get("weight_decay", 0.01))
            model_repo = request.POST.get("model_repo", "OpenFinAL/your-model-name")

            # Retrieve API keys from the form or fall back to .env values
            wandb_key = request.POST.get("wandb_key") or DEFAULT_WANDB_API_KEY
            hf_key = request.POST.get("hf_key") or DEFAULT_HF_API_KEY

            if not wandb_key or not hf_key:
                return JsonResponse({
                    "status": "error",
                    "message": "Both W&B and Hugging Face API keys are required either in the .env file or via the form."
                })

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

            # Login to Hugging Face
            login(token=hf_key)

            # Load dataset
            dataset = load_dataset("FinGPT/fingpt-fiqa_qa")
            dataset = dataset.rename_column("input", "Question").rename_column("output", "Answer")
            dataset = dataset.remove_columns([col for col in dataset.column_names["train"] if col not in ["Question", "Answer"]])

            # Load model and tokenizer dynamically with Meta and OpenELM support
            if "llama" in model_name.lower() or "meta" in model_name.lower() or "openelm" in model_name.lower():
                # tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-1B-Instruct",trust_remote_code=True)
                tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf", use_fast=False, trust_remote_code=True)
                tokenizer.add_bos_token = True
                model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True)
            else:
                # Default to Hugging Face Auto classes
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                if bf16:
                    model = LlamaForCausalLM.from_pretrained(model_name, torch_dtype=torch.bfloat16)
                elif fp16:
                    model = LlamaForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)
                else:
                    model = AutoModelForCausalLM.from_pretrained(model_name)
                
            # Set padding token
            tokenizer.pad_token = tokenizer.eos_token
            model.resize_token_embeddings(len(tokenizer))
            model.to(device)
            
            # Tokenization function
            def tokenize_function(examples):
               inputs = tokenizer(
                    [f"{q} {a}" for q, a in zip(examples["Question"], examples["Answer"])],
                    padding="max_length",
                    truncation=True,
                    max_length=128  # Adjust max_length as needed
                )
               inputs["labels"] = inputs["input_ids"]
               return inputs
                
            # Split dataset and preprocess
            train_test_split = dataset["train"].train_test_split(test_size=0.1)
            train_dataset = train_test_split['train'].map(tokenize_function, batched=True)
            eval_dataset = train_test_split['test'].map(tokenize_function, batched=True)

            # Debugging tensor shapes
            print("Sample tokenized data:", train_dataset[0])

            # Training arguments
            training_args = TrainingArguments(
                output_dir=os.path.join("results", model_name),  # Results directory
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
                gradient_checkpointing=gradient_checkpointing,
                max_grad_norm=max_grad_norm,
                fp16=fp16,
                bf16=bf16,
                # use_cache=False,
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

            # Save model to Hugging Face directly
            model.push_to_hub(model_repo, use_auth_token=hf_key)
            tokenizer.push_to_hub(model_repo, use_auth_token=hf_key)

            # Cleanup
            del train_dataset, eval_dataset
            gc.collect()

            return JsonResponse({"status": "success", "message": f"Training completed successfully for {model_name}!"})

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})

    return render(request, "model_training.html")
