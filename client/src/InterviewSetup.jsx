import { useState } from "react";

function InterviewSetup() {
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [questions, setQuestions] = useState("5");

  const startInterview = () => {
    const interviewData = {
      jobRole,
      experience,
      interviewType,
      questions: Number(questions),
    };

    localStorage.setItem(
      "interviewData",
      JSON.stringify(interviewData)
    );

    window.location.href = "/interview";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-3">
          Set Up Your Interview
        </h1>

        <p className="text-slate-400 text-center mb-10">
          Customize your interview according to your preparation needs.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Job Role
            </label>

            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            >
              <option value="">Select Job Role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Java Developer">Java Developer</option>
              <option value="Python Developer">Python Developer</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Experience Level
            </label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1 Years">0-1 Years</option>
              <option value="1-3 Years">1-3 Years</option>
              <option value="3+ Years">3+ Years</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Interview Type
            </label>

            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            >
              <option value="">Select Interview Type</option>
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
              <option value="Technical + HR">Technical + HR</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Number of Questions
            </label>

            <select
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>

          <button
            onClick={startInterview}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold text-lg"
          >
            Start Interview →
          </button>

        </div>
      </div>
    </div>
  );
}

export default InterviewSetup;