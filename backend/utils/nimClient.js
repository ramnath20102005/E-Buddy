const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const NIM_API_KEY =
  process.env.NVIDIA_API_KEY ||
  process.env.NIM_API_KEY ||
  process.env.NVIDIA_NIM_API_KEY ||
  process.env.NVIDIA_NGC_API_KEY;

if (!NIM_API_KEY) {
  console.error(
    "❌ Error: Missing NVIDIA NIM API key. Set NVIDIA_API_KEY (or NIM_API_KEY)."
  );
}

const NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "meta/llama-4-maverick-17b-128e-instruct";

async function chatCompletion(messages, options = {}) {
  try {
    const payload = {
      model: options.model || DEFAULT_MODEL,
      messages,
      max_tokens: options.max_tokens ?? 1024,
      temperature: options.temperature ?? 0.7,
      top_p: options.top_p ?? 1.0,
      frequency_penalty: options.frequency_penalty ?? 0.0,
      presence_penalty: options.presence_penalty ?? 0.0,
      stream: false,
    };

    const headers = {
      Authorization: `Bearer ${NIM_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await axios.post(NIM_API_URL, payload, { headers });
    const choice = response.data?.choices?.[0];
    const content = choice?.message?.content;

    if (typeof content === "string") {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((part) => (typeof part === "string" ? part : part?.text || part?.content || ""))
        .join("");
    }

    return choice?.message?.content || JSON.stringify(response.data);
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error("🔴 NVIDIA NIM API Error:", { status, data, message: error.message });
    throw error;
  }
}

async function generateTextFromPrompt(prompt, options = {}) {
  const messages = [{ role: "user", content: prompt }];
  return chatCompletion(messages, options);
}

module.exports = {
  chatCompletion,
  generateTextFromPrompt,
};


