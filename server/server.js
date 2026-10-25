
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5001;
const MODEL_NAME = "gemini-3.5-flash-lite";
const REQUEST_TIMEOUT = 90000; // 90 seconds

app.use(cors());
app.use(express.json({ limit: "1mb" }));

let geminiClientPromise = null;

// Initialize Gemini
async function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error("GEMINI_API_KEY is missing from server/.env");
  }

  if (!geminiClientPromise) {
    geminiClientPromise = import("@google/genai")
      .then(({ GoogleGenAI }) => {
        return new GoogleGenAI({ apiKey });
      })
      .catch((error) => {
        geminiClientPromise = null;
        throw error;
      });
  }

  return geminiClientPromise;
}

// Timeout handler
function withTimeout(promise, milliseconds) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("GEMINI_REQUEST_TIMEOUT"));
    }, milliseconds);
  });

  return Promise.race([promise, timeoutPromise])
    .finally(() => clearTimeout(timeoutId));
}

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Interview Ace AI API is running",
    aiProvider: "Google Gemini",
    model: MODEL_NAME,
    timeout: REQUEST_TIMEOUT,
    port: PORT
  });
});

// Evaluate interview answer
app.post("/api/evaluate", async (req, res) => {
  const requestStarted = Date.now();

  console.log("\n======================================");
  console.log("NEW INTERVIEW EVALUATION REQUEST");
  console.log("Time:", new Date().toISOString());

  try {
    const { question, answer } = req.body || {};

    // Validate question
    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid interview question."
      });
    }

    // Validate answer
    if (typeof answer !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide the candidate's answer."
      });
    }

    // Handle empty answer
    if (!answer.trim()) {
      return res.json({
        success: true,
        score: 0,
        feedback: "No answer was provided.",
        strengths: [],
        improvements: [
          "Attempt the interview question.",
          "Explain your answer using relevant concepts and examples."
        ]
      });
    }

    console.log("Question received successfully.");
    console.log("Initializing Gemini...");

    const ai = await getGeminiClient();

    const prompt = `
You are an experienced technical interview evaluator.

Evaluate the candidate's answer fairly and objectively.

QUESTION:
${question.trim()}

CANDIDATE ANSWER:
${answer.trim()}

Evaluate the answer based on:
1. Technical correctness
2. Relevance to the question
3. Clarity of explanation
4. Completeness of the answer

Return ONLY valid JSON in this exact format:

{
  "score": 0,
  "feedback": "A concise explanation of the evaluation.",
  "strengths": [
    "Positive observation about the answer."
  ],
  "improvements": [
    "Specific suggestion for improvement."
  ]
}

IMPORTANT RULES:
- Score must be an integer between 0 and 10.
- Give 0 for an irrelevant or completely incorrect answer.
- Give partial marks for partially correct answers.
- Do not give 10/10 unless the answer is genuinely excellent.
- Do not reward unnecessarily long answers.
- Do not invent statements the candidate did not make.
- Be encouraging but honest.
- Include up to 3 strengths.
- Include up to 3 improvements.
- Return JSON only.
- Do not use Markdown code fences.
`;

    console.log("Sending request to Gemini:", MODEL_NAME);
    console.log("Timeout:", REQUEST_TIMEOUT / 1000, "seconds");

    const response = await withTimeout(
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 600
        }
      }),
      REQUEST_TIMEOUT
    );

    console.log("Gemini response received.");

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    // Parse AI response
    const evaluation = JSON.parse(response.text);

    const score = Number(evaluation.score);

    // Validate AI output
    if (
      !Number.isInteger(score) ||
      score < 0 ||
      score > 10 ||
      typeof evaluation.feedback !== "string"
    ) {
      throw new Error("Gemini returned an invalid evaluation format.");
    }

    const result = {
      success: true,
      score,
      feedback: evaluation.feedback,
      strengths: Array.isArray(evaluation.strengths)
        ? evaluation.strengths
            .filter(item => typeof item === "string")
            .slice(0, 3)
        : [],
      improvements: Array.isArray(evaluation.improvements)
        ? evaluation.improvements
            .filter(item => typeof item === "string")
            .slice(0, 3)
        : []
    };

    console.log("Evaluation completed successfully.");
    console.log("Score:", score + "/10");
    console.log(
      "Time taken:",
      Date.now() - requestStarted,
      "ms"
    );
    console.log("======================================\n");

    return res.json(result);

  } catch (error) {
    const details = String(
      error.message || error.status || error.code || ""
    );

    console.error("Evaluation error:", details);

    const normalized = details.toLowerCase();

    // Application timeout
    if (details === "GEMINI_REQUEST_TIMEOUT") {
      return res.status(504).json({
        success: false,
        message: "Gemini took too long to respond. Please try again."
      });
    }

    // Missing API key
    if (normalized.includes("gemini_api_key is missing")) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing. Check server/.env."
      });
    }

    // Quota errors
    if (
      normalized.includes("429") ||
      normalized.includes("quota") ||
      normalized.includes("resource_exhausted")
    ) {
      return res.status(429).json({
        success: false,
        message: "Gemini API quota or rate limit reached. Please try again later."
      });
    }

    // Authentication errors
    if (
      normalized.includes("401") ||
      normalized.includes("403") ||
      normalized.includes("api key") ||
      normalized.includes("permission_denied") ||
      normalized.includes("unauthorized")
    ) {
      return res.status(401).json({
        success: false,
        message: "Gemini authentication failed. Check your API key."
      });
    }

    // Model errors
    if (
      normalized.includes("404") ||
      normalized.includes("not_found") ||
      normalized.includes("no longer available")
    ) {
      return res.status(502).json({
        success: false,
        message: `The configured Gemini model (${MODEL_NAME}) is unavailable.`
      });
    }

    // Gemini service errors
    if (
      normalized.includes("503") ||
      normalized.includes("unavailable") ||
      normalized.includes("high demand") ||
      normalized.includes("deadline_exceeded")
    ) {
      return res.status(503).json({
        success: false,
        message: "Gemini is temporarily busy or its request deadline expired. Please retry."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Evaluation failed. Check the backend Terminal."
    });
  }
});

// Invalid JSON handler
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body."
    });
  }

  console.error("Server error:", error.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred."
  });
});

// Start server
app.listen(PORT, () => {
  console.log("======================================");
  console.log(
    `Interview Ace AI server running on http://localhost:${PORT}`
  );
  console.log("AI Provider: Google Gemini");
  console.log("Gemini Model:", MODEL_NAME);
  console.log("Request Timeout: 90 seconds");
  console.log("======================================");
});
