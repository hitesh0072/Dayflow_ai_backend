import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../src/config/env.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("No API Key found!");
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach(m => console.log(m.name));
    } else {
      console.log("No models found or error:", data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

listModels();
