
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// =====================================
// ROLE-SPECIFIC TECHNICAL QUESTIONS
// =====================================

const technicalQuestions = {
  "Frontend Developer": [
    "What is HTML and what is its role in web development?",
    "What is the difference between HTML and HTML5?",
    "What is the difference between CSS Flexbox and Grid?",
    "What is responsive web design?",
    "What is JavaScript and why is it used?",
    "What is the difference between let, const and var?",
    "What is the difference between == and === in JavaScript?",
    "What are JavaScript promises?",
    "What is React and why is it used?",
    "What is the difference between props and state in React?",
  ],

  "Backend Developer": [
    "What is backend development?",
    "What is the difference between frontend and backend?",
    "What is a REST API?",
    "What are HTTP methods such as GET, POST, PUT and DELETE?",
    "What is the difference between authentication and authorization?",
    "What is middleware in backend development?",
    "What is the difference between SQL and NoSQL databases?",
    "What is database normalization?",
    "How do you handle errors in a backend application?",
    "What is the purpose of environment variables?",
  ],

  "Full Stack Developer": [
    "What is full stack development?",
    "Explain the role of frontend and backend technologies.",
    "How does a React frontend communicate with a backend?",
    "What is a REST API?",
    "What is the difference between GET and POST requests?",
    "How does data flow from a frontend form to a database?",
    "What is authentication in a web application?",
    "What is database normalization?",
    "What is the difference between client-side and server-side validation?",
    "How would you debug an issue in a full stack application?",
  ],

  "Java Developer": [
    "What is Java and what are its main features?",
    "What is the difference between JDK, JRE and JVM?",
    "What are the four principles of object-oriented programming?",
    "What is the difference between an abstract class and an interface?",
    "What is the difference between method overloading and overriding?",
    "What is exception handling in Java?",
    "What is the difference between checked and unchecked exceptions?",
    "What is the Java Collections Framework?",
    "What is multithreading in Java?",
    "What is JDBC and how is it used?",
  ],

  "Python Developer": [
    "What is Python and what are its main features?",
    "What is the difference between a list and a tuple?",
    "What are dictionaries in Python?",
    "What is the difference between == and is in Python?",
    "What are Python functions?",
    "What is object-oriented programming in Python?",
    "What is exception handling in Python?",
    "What are Python modules and packages?",
    "What is the purpose of virtual environments in Python?",
    "What is Django and why is it used?",
  ],
};

// Additional technical questions that adapt to the selected role.
const additionalTechnicalQuestions = [
  (role) => `What are the most important skills required for a ${role}?`,
  (role) => `Explain a technical project you would build as a ${role}.`,
  (role) => `How would you debug a problem related to ${role} development?`,
  (role) => `How do you ensure code quality in your work as a ${role}?`,
  (role) => `What development tools would you use as a ${role}?`,
  (role) => `How would you improve the performance of an application as a ${role}?`,
  (role) => `How do you approach learning a new technology relevant to ${role}?`,
  (role) => `How would you handle a technical challenge in a ${role} project?`,
  (role) => `How do you test your work as a ${role}?`,
  (role) => `Describe how you would work with other developers as a ${role}.`,
];

// =====================================
// HR QUESTIONS
// =====================================

const hrQuestions = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "What is your biggest weakness, and how are you improving it?",
  "Why do you want to work for our company?",
  "Why should we hire you?",
  "Where do you see yourself in five years?",
  "What motivates you?",
  "How do you handle pressure and deadlines?",
  "Tell me about a challenge you faced and how you handled it.",
  "How do you handle criticism?",
  "Do you prefer working independently or in a team?",
  "How do you manage your time?",
  "What do you know about this job role?",
  "What are your career goals?",
  "Describe a situation where you worked in a team.",
  "How would you handle a disagreement with a colleague?",
  "Are you comfortable learning new technologies?",
  "What makes you different from other candidates?",
  "What are your salary expectations?",
  "Do you have any questions for the interviewer?",
];

// =====================================
// GENERATE QUESTIONS
// =====================================

function generateQuestions(interviewData) {
  const {
    jobRole,
    interviewType,
    questions: selectedCount,
  } = interviewData;

  const roleQuestions = technicalQuestions[jobRole] || [];

  const extraQuestions = additionalTechnicalQuestions.map((createQuestion) =>
    createQuestion(jobRole)
  );

  const allTechnicalQuestions = [
    ...roleQuestions,
    ...extraQuestions,
  ];

  let questionBank = [];

  if (interviewType === "Technical") {
    questionBank = allTechnicalQuestions;
  } else if (interviewType === "HR") {
    questionBank = hrQuestions;
  } else if (interviewType === "Technical + HR") {
    questionBank = [
      ...roleQuestions,
      ...hrQuestions.slice(0, 10),
    ];
  }

  const count = Math.min(
    Math.max(Number(selectedCount) || 5, 1),
    questionBank.length
  );

  return questionBank.slice(0, count);
}

// =====================================
// INTERVIEW COMPONENT
// =====================================

function Interview() {
  const [interviewData] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("interviewData") || "{}"
      );
    } catch {
      return {};
    }
  });

  const questions = generateQuestions(interviewData);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if interview settings are missing.
  if (!interviewData.jobRole || !interviewData.interviewType || questions.length === 0) {
    return <Navigate to="/setup" replace />;
  }

  // Save the newly generated questions for the Results page.
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
      const response = await fetch(
        "http://localhost:5001/api/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: questions[currentQuestion],
            answer: answer.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to evaluate your answer."
        );
      }

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

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((previous) => previous + 1);
        setAnswer("");
      } else {
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Interview <span className="text-blue-400">Ace AI</span>
            </h1>

            <p className="mt-2 text-slate-400">
              {interviewData.jobRole} | {interviewData.experience}
            </p>
          </div>

          <div className="text-slate-400">
            Question {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* INTERVIEW CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="mb-6">
            <span className="inline-block rounded-full bg-blue-500/10 text-blue-400 px-3 py-1 text-sm">
              {interviewData.interviewType} Interview
            </span>
          </div>

          {/* QUESTION */}
          <h2 className="text-2xl font-semibold mb-8">
            {questions[currentQuestion]}
          </h2>

          {/* ANSWER */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={loading}
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 resize-none disabled:opacity-60"
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-400 mt-4">
              {error}
            </p>
          )}

          {/* BOTTOM SECTION */}
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
