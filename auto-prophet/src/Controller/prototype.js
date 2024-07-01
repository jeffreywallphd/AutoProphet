const { HfInference } = require('@huggingface/inference');

const HF_TOKEN = ''; // Replace with your actual token

const inference = new HfInference(HF_TOKEN);

async function generateText(prompt) {
  const response = await inference.textGeneration({
    model: 'istralai/Mixtral-8x7B-Instruct-v0.1',
    inputs: prompt,
    parameters: {
      max_new_tokens: 128,
      num_beams: 5,
      no_repeat_ngram_size: 5,
      early_stopping: true,
      // do_sample: true,
      // top_p: 0.9,
      // temperature: 0.7,
      // top_k : 50,
    },
    options: {
      use_cache: false,
      wait_for_model: true,
    },
  });

  // console.log(response);
  return response.generated_text;
}

module.exports = { generateText };
