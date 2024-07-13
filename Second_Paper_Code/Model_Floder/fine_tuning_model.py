# -*- coding: utf-8 -*-

"""
code is referenced from https://github.com/apple/corenet/tree/main/projects/openelm
https://github.com/apple/corenet/blob/main/projects/openelm/instruction_tuning/openelm-instruct.yaml
https://github.com/geronimi73/3090_shorts/blob/main/nb_OpenELM-450M_finetune-full.ipynb
"""

"""Fine_tuning_model.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1_HRXuc7ScivjNUDUr_jKXLuQb-ki5sSn
"""

# !pip install accelerate bitsandbytes datasets sentence-transformers tokenizers torch transformers trl wandb

# import neccessary libraries
import pandas as pd
import numpy as np
import wandb
import accelerate
import bitsandbytes
import datasets
from datasets import load_dataset
from sentence_transformers import SentenceTransformer
import tokenizers
import torch
import transformers
import trl
from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers import TrainingArguments, set_seed, get_constant_schedule
from trl import SFTTrainer, setup_chat_format, DataCollatorForCompletionOnlyLM
from datasets import load_dataset
import uuid
from datasets import DatasetDict, Dataset
import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "0"

wandb.login()

# Load the dataset using datasets library
ds = load_dataset("FinGPT/fingpt-fiqa_qa")

total_df = ds['train'].train_test_split(test_size = 0.2, seed = 42)

total_df = DatasetDict({
    'train': total_df['train'],
    'test' : total_df['test']
})

def format_data(example):
  return [
      {'content': example['input'], 'role':'user'},
      {'content': example['output'], 'role': 'assistant'}
  ]


format_train = total_df['train'].map(lambda x: {'messages': format_data(x)})
format_test = total_df['test'].map(lambda x: {'messages': format_data(x)})

final_dataset = DatasetDict({
    'train': Dataset.from_dict({'messages':format_train['messages']}),
    'test': Dataset.from_dict({'messages': format_test['messages']})
})

final_dataset

model = AutoModelForCausalLM.from_pretrained(
    "apple/OpenELM-270M",
    trust_remote_code=True,
    device_map = "auto",
    # torch_dtype = torch.bfloat16,
)

# model.to("cuda")

tokenizer = AutoTokenizer.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    use_fast=False)

"""## Train"""

set_seed(42)
lr = 5e-5
run_id = f"OpenELM-270M_LR-{lr}_OA_{str(uuid.uuid4())}"

model, tokenizer = setup_chat_format(model, tokenizer)
if tokenizer.pad_token in [None, tokenizer.eos_token]:
    tokenizer.pad_token = tokenizer.unk_token

dataset = final_dataset

training_arguments = TrainingArguments(
    output_dir = f"out_{run_id}",
    evaluation_strategy = "steps",
    label_names = ["labels"],
    per_device_train_batch_size = 2,
    gradient_accumulation_steps = 2,
    save_steps = 250,
    eval_steps = 250,
    save_total_limit = 1,
    logging_steps = 1,
    learning_rate = lr,
    num_train_epochs = 2,
    lr_scheduler_type = "linear",
    optim = 'adamw_torch',
    bf16 = True,
    gradient_checkpointing = True,
    group_by_length = True,
    load_best_model_at_end=True, 
    metric_for_best_model="eval_loss",
    weight_decay = 0.01,
    warmup_steps = 500,
    max_grad_norm = 1.0,
    report_to = "wandb",
)

trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset["train"],
    eval_dataset = dataset['test'],
    data_collator = DataCollatorForCompletionOnlyLM(
        instruction_template = "<|im_start|>user",
        response_template = "<|im_start|>assistant",
        tokenizer = tokenizer,
        mlm = False),
    max_seq_length = 2048,
    dataset_kwargs = dict(add_special_tokens = False),
    args = training_arguments,
)

wandb.init(
    project = "OpenELM",
    name = run_id,
).log_code(include_fn=lambda path: path.endswith(".py") or path.endswith(".ipynb"))

trainer.train()

# """## Inference"""

# from transformers import AutoModelForCausalLM, AutoTokenizer

# # change me!
# model_path = "out/checkpoint-750"

# model = AutoModelForCausalLM.from_pretrained(
#     model_path,
#     trust_remote_code=True,
#     device_map="auto"
# )

# tokenizer = AutoTokenizer.from_pretrained(
#     model_path,
#     use_fast=False)

# def prompt(question, debug=False, max_new_tokens=500):
#     messages = [
#         {"role": "user", "content": question},
#     ]

#     input_tokens = tokenizer.apply_chat_template(
#         messages,
#         add_generation_prompt=True,
#         return_tensors="pt"
#     ).to("cuda")
#     output_tokens = model.generate(input_tokens, max_new_tokens=max_new_tokens)

#     if debug:
#         for tok in output_tokens[0]:
#             print(tok, tokenizer.decode(tok))

#     output = tokenizer.decode(output_tokens[0], skip_special_tokens=False)

#     print(output)

# prompt("hello, who are you?")



