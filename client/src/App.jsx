import { BrowserRouter, Routes, Route } from "react-router-dom";

import InterviewSetup from "./InterviewSetup";
import Interview from "./Interview";
import Results from "./Results";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="text-2xl font-bold">
            Interview{" "}
            <span className="text-blue-400">
              Ace AI
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#features"
              className="text-slate-300 hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-slate-300 hover:text-white"
            >
              How It Works
            </a>

            <button className="rounded-lg border border-slate-700 px-5 py-2 text-sm hover:bg-slate-800">
              Login
            </button>

            <button
              onClick={() => window.location.href = "/setup"}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
            >
              Get Started
            </button>

          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <main>

        <section className="mx-auto max-w-7xl px-6 py-24 text-center">

          <div className="mx-auto mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            AI-Powered Interview Preparation
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Ace Your Next
            <span className="block text-blue-400">
              Interview With AI
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Practice realistic interviews, receive instant AI feedback,
            improve your answers, and build the confidence you need to
            land your dream job.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <button
              onClick={() => window.location.href = "/setup"}
              className="rounded-xl bg-blue-500 px-8 py-4 font-semibold transition hover:bg-blue-600"
            >
              Start Mock Interview →
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Explore Features
            </button>

          </div>

        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-6 py-20"
        >

          <div className="mb-12 text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Everything You Need
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Prepare Smarter. Interview Better.
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

              <div className="mb-5 text-4xl">
                🤖
              </div>

              <h3 className="text-xl font-semibold">
                AI Mock Interviews
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Practice realistic technical, HR, and behavioral
                interviews with an AI interviewer.
              </p>

            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

              <div className="mb-5 text-4xl">
                📊
              </div>

              <h3 className="text-xl font-semibold">
                Smart Feedback
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Get detailed feedback on your answers, communication,
                confidence, and areas for improvement.
              </p>

            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

              <div className="mb-5 text-4xl">
                🎯
              </div>

              <h3 className="text-xl font-semibold">
                Track Your Progress
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Monitor your interview performance and see how your
                skills improve over time.
              </p>

            </div>

          </div>

        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="border-y border-slate-800 bg-slate-900/40 px-6 py-20"
        >

          <div className="mx-auto max-w-5xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              How Interview Ace AI Works
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">

              {/* Step 1 */}
              <div>

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold">
                  1
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  Choose Your Interview
                </h3>

                <p className="mt-2 text-slate-400">
                  Select your job role and interview type.
                </p>

              </div>

              {/* Step 2 */}
              <div>

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold">
                  2
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  Practice With AI
                </h3>

                <p className="mt-2 text-slate-400">
                  Answer questions just like a real interview.
                </p>

              </div>

              {/* Step 3 */}
              <div>

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold">
                  3
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  Get Your Score
                </h3>

                <p className="mt-2 text-slate-400">
                  Receive AI feedback and improve your performance.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">

          <h2 className="text-4xl font-bold">
            Ready to Ace Your Interview?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Start practicing today and become interview-ready.
          </p>

          <button
            onClick={() => window.location.href = "/setup"}
            className="mt-8 rounded-xl bg-blue-500 px-8 py-4 font-semibold hover:bg-blue-600"
          >
            Start Practicing →
          </button>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 Interview Ace AI. Built with React and AI.
      </footer>

    </div>
  );
}


/* =========================
   MAIN APP / ROUTES
========================= */

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Interview Setup */}
        <Route
          path="/setup"
          element={<InterviewSetup />}
        />

        {/* Interview */}
        <Route
          path="/interview"
          element={<Interview />}
        />

        {/* Results */}
        <Route
          path="/results"
          element={<Results />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;