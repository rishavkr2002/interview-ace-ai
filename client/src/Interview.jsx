import { useState } from "react";

function Interview() {
  const questions = [
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

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const nextQuestion = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer before continuing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: questions[currentQuestion],
            answer: answer
          })
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer("");
      } else {
        window.location.href = "/results";
      }

    } catch (error) {
      console.error("Backend error:", error);
      alert("Unable to connect to the server.");
    }

    setLoading(false);
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
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 resize-none"
          />

          {/* Bottom Section */}
          <div className="flex justify-between items-center mt-6">

            <span className="text-slate-400">
              Take your time and answer confidently.
            </span>

            <button
              onClick={nextQuestion}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold"
            >
              {loading
                ? "Submitting..."
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