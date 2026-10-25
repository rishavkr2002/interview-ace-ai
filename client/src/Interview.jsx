
import { useEffect, useState } from "react";

function Interview() {
  // Read the selected interview settings from InterviewSetup.jsx
  const interviewData = JSON.parse(
    localStorage.getItem("interviewData") || "{}"
  );

  const allQuestions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "What is React and why is it used?",
    "What is the difference between let, const and var?",
    "Why should we hire you?",
    "What is the difference between props and state in React?",
    "What is a component in React?",
    "What is the Virtual DOM?",
    "What is JavaScript?",
    "What are your career goals?"
  ];

  // Use the number selected by the user (default: 10)
  const selectedCount = Number(interviewData.questions) || 10;

  const questions = allQuestions.slice(
    0,
    Math.min(Math.max(selectedCount, 1), allQuestions.length)
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Save the selected questions for the Results page
  useEffect(() => {
    localStorage.setItem(
      "interviewQuestions",
      JSON.stringify(questions)
    );

    localStorage.setItem("interviewAnswers", JSON.stringify([]));
    localStorage.setItem("interviewEvaluations", JSON.stringify([]));
  }, []);

  const nextQuestion = async () => {
    if (!answer.trim()) {
      setError("Please enter your answer before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send the answer to the Gemini backend
      const response = await fetch(
        "http://localhost:5001/api/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: questions[currentQuestion],
            answer: answer.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to evaluate your answer."
        );
      }

      // Save the current answer and its AI evaluation
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = answer.trim();

      const updatedEvaluations = [...evaluations];
      updatedEvaluations[currentQuestion] = data;

      setAnswers(updatedAnswers);
      setEvaluations(updatedEvaluations);

      localStorage.setItem(
        "interviewAnswers",
        JSON.stringify(updatedAnswers)
      );

      localStorage.setItem(
        "interviewEvaluations",
        JSON.stringify(updatedEvaluations)
      );

      // Move to the next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((previous) => previous + 1);
        setAnswer("");
      } else {
        // All selected questions have been evaluated
        window.location.href = "/results";
      }

    } catch (err) {
      console.error("Interview evaluation error:", err);

      setError(
        err.message ||
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Interview{" "}
            <span className="text-blue-400">
              Ace AI
            </span>
          </h1>

          <div className="text-slate-400">
            Question {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestion + 1) / questions.length) * 100
              }%`
            }}
          />
        </div>

        {/* Interview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          {/* Question */}
          <h2 className="text-2xl font-semibold mb-8">
            {questions[currentQuestion]}
          </h2>

          {/* Answer */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={loading}
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 resize-none disabled:opacity-60"
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-400 mt-4">
              {error}
            </p>
          )}

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">

            <span className="text-slate-400">
              Take your time and answer confidently.
            </span>

            <button
              onClick={nextQuestion}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
            >
              {loading
                ? "Evaluating with AI..."
                : currentQuestion === questions.length - 1
                  ? "Finish Interview"
                  : "Next Question →"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Interview;
