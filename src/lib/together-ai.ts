import Together from "together-ai";

if (!process.env.TOGETHER_API_KEY) {
  throw new Error("Missing TOGETHER_API_KEY environment variable");
}

export const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export const CHAT_MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K"; 