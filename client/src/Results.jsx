
import { useState } from "react";

function Results() {
  const [showAnswers, setShowAnswers] = useState(true);

  // Read Gemini evaluation results from localStorage.
  const [results] = useState(() => {
    try {
      const savedResults = JSON.parse(
        localStorage.getItem("interviewResults") || "[]"
      );

      return Array.isArray(savedResults) ? savedResults : [];
    } catch (error) {
      console.error("Unable to read interview results:", error);
      return [];
    }
  });

  const totalQuestions = 10;

  const answeredQuestions = results.filter(
    (item) =>
      item &&
      typeof item.answer === "string" &&
      item.answer.trim() !== ""
  ).length;

  // Calculate average Gemini score out of 10.
  const totalScore = results.reduce((sum, item) => {
    const score = Number(item?.evaluation?.score);

    return sum + (
      Number.isFinite(score)
        ? Math.min(10, Math.max(0, score))
        : 0
    );
  }, 0);

  const averageScore =
    answeredQuestions > 0
      ? totalScore / answeredQuestions
      : 0;

  const percentage =
    answeredQuestions > 0
      ? Math.round((averageScore / 10) * 100)
      : 0;

  const completionPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100
  );

  // Collect feedback from all evaluated answers.
  const strengths = [
    ...new Set(
      results.flatMap((item) =>
        Array.isArray(item?.evaluation?.strengths)
          ? item.evaluation.strengths
          : []
      )
    )
  ];

  const improvements = [
    ...new Set(
      results.flatMap((item) =>
        Array.isArray(item?.evaluation?.improvements)
          ? item.evaluation.improvements
          : []
      )
    )
  ];

  const recommendations = answeredQuestions === 0
    ? ["Complete an interview to receive personalized recommendations."]
    : percentage >= 80
      ? ["Excellent performance! Continue practising advanced interview questions."]
      : percentage >= 60
        ? ["Good effort! Practise explaining concepts with relevant examples."]
        : ["Revise the fundamentals and practise answering questions clearly and confidently."];

  const startNewInterview = () => {
    localStorage.removeItem("interviewResults");
    localStorage.removeItem("interviewCompleted");
    localStorage.removeItem("interviewAnswers");
    localStorage.removeItem("interviewQuestions");

    window.location.href = "/setup";
  };

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
            Here is your interview performance evaluated by Gemini AI.
          </p>

        </div>

        {/* Main Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center mb-8">

          <p className="text-slate-400 text-lg">
            Your Average Score
          </p>

          <div className="text-7xl font-bold text-blue-400 mt-3">
            {percentage}%
          </div>

          <p className="text-slate-400 mt-4">
            Average: {averageScore.toFixed(1)} / 10
          </p>

          <p className="text-slate-400 mt-2">
            You answered {answeredQuestions} out of {totalQuestions} questions.
          </p>

        </div>

        {/* Performance Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Total Questions
            </p>

            <p className="text-3xl font-bold mt-2">
              {totalQuestions}
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
              {completionPercentage}%
            </p>
          </div>

        </div>

        {/* AI Feedback */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            🤖 Gemini AI Feedback
          </h2>

          {answeredQuestions === 0 ? (

            <p className="text-slate-400">
              No interview evaluations found. Please complete an interview first.
            </p>

          ) : (

            <div className="space-y-6">

              {/* Strengths */}
              <div>
                <h3 className="font-semibold text-green-400 text-lg">
                  Strengths
                </h3>

                {strengths.length > 0 ? (
                  <ul className="list-disc pl-6 text-slate-400 mt-2 space-y-2">
                    {strengths.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 mt-2">
                    Keep practising to identify your strengths.
                  </p>
                )}
              </div>

              {/* Improvements */}
              <div>
                <h3 className="font-semibold text-yellow-400 text-lg">
                  Areas to Improve
                </h3>

                {improvements.length > 0 ? (
                  <ul className="list-disc pl-6 text-slate-400 mt-2 space-y-2">
                    {improvements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 mt-2">
                    Continue improving your technical knowledge and communication.
                  </p>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-blue-400 text-lg">
                  Recommendation
                </h3>

                <ul className="list-disc pl-6 text-slate-400 mt-2 space-y-2">
                  {recommendations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}

        </div>

        {/* Individual Answer Evaluations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex justify-between items-center gap-4">

            <h2 className="text-2xl font-bold">
              Your Answers & Evaluations
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

              {results.length === 0 ? (

                <p className="text-slate-400">
                  No answers are available yet.
                </p>

              ) : (

                results.map((item, index) => (

                  <div
                    key={index}
                    className="border border-slate-800 rounded-xl p-5"
                  >

                    <div className="flex justify-between items-start gap-4">

                      <p className="font-semibold text-lg">
                        {index + 1}. {item.question}
                      </p>

                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg font-bold whitespace-nowrap">
                        {Number(item?.evaluation?.score) || 0}/10
                      </span>

                    </div>

                    {/* Candidate Answer */}
                    <div className="mt-5">

                      <h3 className="text-sm font-semibold text-slate-300">
                        Your Answer
                      </h3>

                      <p className="text-slate-400 mt-2 whitespace-pre-wrap">
                        {item.answer || "No answer provided."}
                      </p>

                    </div>

                    {/* Gemini Feedback */}
                    <div className="mt-5">

                      <h3 className="text-sm font-semibold text-green-400">
                        Gemini Feedback
                      </h3>

                      <p className="text-slate-400 mt-2">
                        {item?.evaluation?.feedback || "No feedback available."}
                      </p>

                    </div>

                    {/* Individual Improvements */}
                    {Array.isArray(item?.evaluation?.improvements) &&
                      item.evaluation.improvements.length > 0 && (

                        <div className="mt-4">

                          <h3 className="text-sm font-semibold text-yellow-400">
                            Suggested Improvements
                          </h3>

                          <ul className="list-disc pl-6 text-slate-400 mt-2 space-y-1">
                            {item.evaluation.improvements.map(
                              (improvement, improvementIndex) => (
                                <li key={improvementIndex}>
                                  {improvement}
                                </li>
                              )
                            )}
                          </ul>

                        </div>
                      )}

                  </div>

                ))
              )}

            </div>
          )}

        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">

          <button
            onClick={startNewInterview}
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

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-10">
          Interview Ace AI · Powered by Google Gemini
        </p>

      </div>

    </div>
  );
}

export default Results;
