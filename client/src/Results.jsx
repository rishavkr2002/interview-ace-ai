    import { useState } from "react";

function Results() {
  const questions = JSON.parse(
    localStorage.getItem("interviewQuestions") || "[]"
  );

  const answers = JSON.parse(
    localStorage.getItem("interviewAnswers") || "[]"
  );

  const [showAnswers, setShowAnswers] = useState(false);

  const answeredQuestions = answers.filter(
    (answer) => answer && answer.trim() !== ""
  ).length;

  const score = Math.round(
    (answeredQuestions / questions.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold">
            Interview{" "}
            <span className="text-blue-400">
              Results
            </span>
          </h1>

          <p className="text-slate-400 mt-3">
            Great job! Here is your interview performance.
          </p>

        </div>

        {/* Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center mb-8">

          <p className="text-slate-400 text-lg">
            Your Score
          </p>

          <div className="text-7xl font-bold text-blue-400 mt-3">
            {score}%
          </div>

          <p className="text-slate-400 mt-4">
            You answered {answeredQuestions} out of{" "}
            {questions.length} questions.
          </p>

        </div>

        {/* Performance */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Questions
            </p>

            <p className="text-3xl font-bold mt-2">
              {questions.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Answered
            </p>

            <p className="text-3xl font-bold text-green-400 mt-2">
              {answeredQuestions}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Completion
            </p>

            <p className="text-3xl font-bold text-blue-400 mt-2">
              {score}%
            </p>
          </div>

        </div>

        {/* AI Feedback */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            🤖 AI Feedback
          </h2>

          <div className="space-y-4">

            <div>
              <h3 className="font-semibold text-green-400">
                Strengths
              </h3>

              <p className="text-slate-400 mt-1">
                You completed the interview and attempted the
                available questions. Keep practicing to improve
                your confidence and technical knowledge.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-400">
                Areas to Improve
              </h3>

              <p className="text-slate-400 mt-1">
                Try to give detailed answers with examples.
                Practice explaining technical concepts clearly
                and confidently.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-blue-400">
                Recommendation
              </h3>

              <p className="text-slate-400 mt-1">
                Continue taking mock interviews regularly and
                review the questions where you found it difficult
                to answer.
              </p>
            </div>

          </div>

        </div>

        {/* Answers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-bold">
              Your Answers
            </h2>

            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg font-semibold"
            >
              {showAnswers ? "Hide Answers" : "View Answers"}
            </button>

          </div>

          {showAnswers && (
            <div className="mt-8 space-y-6">

              {questions.map((question, index) => (

                <div
                  key={index}
                  className="border border-slate-800 rounded-xl p-5"
                >

                  <p className="font-semibold text-lg">
                    {index + 1}. {question}
                  </p>

                  <p className="text-slate-400 mt-3">
                    {answers[index] || "No answer provided."}
                  </p>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-10">

          <button
            onClick={() => {
              localStorage.removeItem("interviewAnswers");
              localStorage.removeItem("interviewQuestions");
              window.location.href = "/setup";
            }}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold"
          >
            Start New Interview
          </button>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="border border-slate-700 hover:bg-slate-800 px-6 py-3 rounded-lg font-semibold"
          >
            Back Home
          </button>

        </div>

      </div>

    </div>
  );
}

export default Results;