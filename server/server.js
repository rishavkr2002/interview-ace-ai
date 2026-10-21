
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;
const MODEL_NAME = "gemini-3.7-flash";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

let geminiClientPromise = null;

async function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error("GEMINI_API_KEY is missing from server/.env");
  }

  if (!geminiClientPromise) {
    geminiClientPromise = import("@google/genai")
      .then(({ GoogleGenAI }) => new GoogleGenAI({ apiKey }))
      .catch((error) => {
        geminiClientPromise = null;
        throw error;
      });
  }

  return geminiClientPromise;
}

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Interview Ace AI API is running",
    aiProvider: "Google Gemini",
    model: MODEL_NAME,
    port: PORT,
  });
});

// Evaluate an interview answer
app.post("/api/evaluate", async (req, res) => {
  try {
    const { question, answer } = req.body || {};

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid interview question.",
      });
    }

    if (typeof answer !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide the candidate's answer as text.",
      });
    }

    if (!answer.trim()) {
      return res.json({
        success: true,
        score: 0,
        feedback: "No answer was provided for this question.",
        strengths: [],
        improvements: [
          "Attempt the question and explain your reasoning.",
          "Include relevant concepts and a simple example.",
        ],
      });
    }

    const ai = await getGeminiClient();

    const prompt = `
You are an experienced technical interview evaluator.
Evaluate the candidate's answer fairly and constructively.

QUESTION:
${question.trim()}

CANDIDATE ANSWER:
${answer.trim()}

Return only valid JSON in this format:
{
  "score": 0,
  "feedback": "Concise explanation of the evaluation",
  "strengths": ["Positive observation"],
  "improvements": ["Specific improvement"]
}

Rules:
- Score must be an integer from 0 to 10.
- Assess correctness, relevance, clarity, and completeness.
- Do not reward an answer just because it is long.
- Do not invent statements the candidate did not make.
- Be encouraging but honest.
- Include up to 3 strengths and 3 improvements.
- Return JSON only, without Markdown fences.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 700,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const evaluation = JSON.parse(response.text);
    const score = Number(evaluation.score);

    if (
      !Number.isInteger(score) ||
      score < 0 ||
      score > 10 ||
      typeof evaluation.feedback !== "string"
    ) {
      throw new Error("Gemini returned an invalid evaluation format.");
    }

    return res.json({
      success: true,
      score,
      feedback: evaluation.feedback,
      strengths: Array.isArray(evaluation.strengths)
        ? evaluation.strengths.filter(
            (item) => typeof item === "string"
          )
        : [],
      improvements: Array.isArray(evaluation.improvements)
        ? evaluation.improvements.filter(
            (item) => typeof item === "string"
          )
        : [],
    });
  } catch (error) {
    const details = String(
      error.message || error.status || error.code || ""
    );

    console.error("Interview evaluation failed:", details);

    const normalized = details.toLowerCase();

    if (normalized.includes("gemini_api_key is missing")) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing. Check server/.env.",
      });
    }

    if (
      normalized.includes("429") ||
      normalized.includes("resource_exhausted") ||
      normalized.includes("quota")
    ) {
      return res.status(429).json({
        success: false,
        message: "Gemini quota or rate limit reached. Check your API usage.",
      });
    }

    if (
      normalized.includes("401") ||
      normalized.includes("403") ||
      normalized.includes("api_key_invalid") ||
      normalized.includes("api key not valid") ||
      normalized.includes("permission_denied") ||
      normalized.includes("unauthorized")
    ) {
      return res.status(401).json({
        success: false,
        message: "Gemini authentication failed. Check your API key and permissions.",
      });
    }

    if (
      normalized.includes("503") ||
      normalized.includes("unavailable") ||
      normalized.includes("high demand")
    ) {
      return res.status(503).json({
        success: false,
        message: "Gemini is temporarily busy. Please try again shortly.",
      });
    }

    if (
      normalized.includes("404") ||
      normalized.includes("not_found") ||
      normalized.includes("no longer available")
    ) {
      return res.status(502).json({
        success: false,
        message: `The model ${MODEL_NAME} is unavailable. Check the available models for your API key.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Answer evaluation failed. Check the backend terminal.",
    });
  }
});

// Handle invalid JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  console.error("Server error:", error.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log(`Interview Ace AI server running on http://localhost:${PORT}`);
  console.log(`Gemini model: ${MODEL_NAME}`);
});
