import OpenAI from "openai";
import { env } from "../../config/env.js";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3-8b-instruct";

const callOpenRouter = async (
  messages,
  response_format = { type: "json_object" },
) => {
  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: messages,
      response_format: response_format,
    });

    const content = completion.choices[0].message.content;

    if (response_format && response_format.type === "json_object") {
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error("JSON Parse Error", content);
        return { error: "Failed to parse AI response" };
      }
    }

    return content;
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to communicate with AI Service");
  }
};

export const generateSummaryService = async (text) => {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant. Provide a detailed, clear paragraph explaining the task in depth, including its purpose, key actions involved, and any important considerations. Return JSON with key 'summary' only.",
    },
    { role: "user", content: `Text: "${text}"` },
  ];
  const result = await callOpenRouter(messages);
  return result.summary || result;
};

export const prioritizeTasksService = async (tasks) => {
  const messages = [
    {
      role: "system",
      content:
        "Analyze tasks and return Top 3 priorities based on deadlines and importance. Return strictly JSON: { 'top_priorities': [{ 'taskId': '...', 'reason': '...' }] }",
    },
    { role: "user", content: `Tasks: ${JSON.stringify(tasks)}` },
  ];
  return await callOpenRouter(messages);
};

export const estimateTimeService = async (taskDetails) => {
  const messages = [
    {
      role: "system",
      content:
        "Estimate time for the task. Return JSON with key 'estimate' (e.g., '2 hours').",
    },
    { role: "user", content: `Task: "${taskDetails}"` },
  ];
  const result = await callOpenRouter(messages);
  return result.estimate || result;
};

export const generateConcisePromptsService = async (taskTitle) => {
  const messages = [
    {
      role: "system",
      content:
        "Provide 3 small starting steps. Return JSON: { 'prompts': ['step 1', 'step 2'] }",
    },
    { role: "user", content: `Task: "${taskTitle}"` },
  ];
  const result = await callOpenRouter(messages);
  return result.prompts || [];
};

export const breakdownTaskService = async (taskDescription) => {
  const messages = [
    {
      role: "system",
      content:
        "Break down the task into clear, actionable subtasks. Each subtask should have a descriptive title and a detailed paragraph explaining what needs to be done, how to do it, and any important considerations or dependencies. Return JSON ONLY in this format: { 'subtasks': [{ 'title': 'Subtask title', 'description': 'Detailed explanation' }] }. Do not include extra text or formatting.",
    },
    { role: "user", content: `Task: "${taskDescription}"` },
  ];

  const result = await callOpenRouter(messages);
  return result.subtasks || [];
};
