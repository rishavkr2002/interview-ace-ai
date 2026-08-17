const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Interview Ace AI API is running"
  });
});

// Interview API
app.post("/api/interview", (req, res) => {
  const { question, answer } = req.body;

  console.log("Question:", question);
  console.log("Answer:", answer);

  res.json({
    success: true,
    feedback: "Answer received successfully!",
    score: 8
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});