import Groq from 'groq-sdk';

let client: Groq | null = null;

export function getAIClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Missing GROQ_API_KEY environment variable');
  }

  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return client;
}

export const MODEL = 'llama-3.3-70b-versatile';
