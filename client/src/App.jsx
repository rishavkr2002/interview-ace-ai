
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  Outlet,
} from "react-router-dom";

import InterviewSetup from "./InterviewSetup";
import Interview from "./Interview";
import Results from "./Results";

// =========================
// PROTECTED ROUTES
// =========================

function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

// =========================
// LOGOUT FUNCTION
// =========================

function logoutUser(navigate) {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");

  navigate("/", { replace: true });
}

// =========================
// HOME PAGE
// =========================

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold">
            Interview <span className="text-blue-400">Ace AI</span>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <a href="#features" className="text-slate-300 hover:text-white">
              Features
            </a>

            <a href="#how-it-works" className="text-slate-300 hover:text-white">
              How It Works
            </a>

            {/* LOGIN BUTTON - ALWAYS VISIBLE */}
            <button
              onClick={() =>
                navigate(isLoggedIn ? "/dashboard" : "/login")
              }
              className="rounded-lg border border-slate-700 px-5 py-2 text-sm hover:bg-slate-800"
            >
              Login
            </button>

            {/* LOGOUT BUTTON - VISIBLE AFTER LOGIN */}
            {isLoggedIn && (
              <button
                onClick={() => logoutUser(navigate)}
                className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                Logout
              </button>
            )}

            {!isLoggedIn && (
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
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
              onClick={() =>
                navigate(isLoggedIn ? "/dashboard" : "/login")
              }
              className="rounded-xl bg-blue-500 px-8 py-4 font-semibold transition hover:bg-blue-600"
            >
              {isLoggedIn ? "Go to Dashboard →" : "Start Mock Interview →"}
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

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Everything You Need
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Prepare Smarter. Interview Better.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div className="mb-5 text-4xl">🤖</div>
              <h3 className="text-xl font-semibold">AI Mock Interviews</h3>
              <p className="mt-3 leading-7 text-slate-400">
                Practice realistic technical, HR, and behavioral interviews
                with an AI interviewer.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div className="mb-5 text-4xl">📊</div>
              <h3 className="text-xl font-semibold">Smart Feedback</h3>
              <p className="mt-3 leading-7 text-slate-400">
                Get detailed feedback on your answers, communication,
                confidence, and areas for improvement.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div className="mb-5 text-4xl">🎯</div>
              <h3 className="text-xl font-semibold">Track Your Progress</h3>
              <p className="mt-3 leading-7 text-slate-400">
                Monitor your interview performance and see how your skills
                improve over time.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
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
              {[
                {
                  number: "1",
                  title: "Choose Your Interview",
                  description: "Select your job role and interview type.",
                },
                {
                  number: "2",
                  title: "Practice With AI",
                  description: "Answer questions just like a real interview.",
                },
                {
                  number: "3",
                  title: "Get Your Score",
                  description:
                    "Receive AI feedback and improve your performance.",
                },
              ].map((step) => (
                <div key={step.number}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold">
                    {step.number}
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="text-4xl font-bold">
            Ready to Ace Your Interview?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Start practicing today and become interview-ready.
          </p>

          <button
            onClick={() =>
              navigate(isLoggedIn ? "/dashboard" : "/login")
            }
            className="mt-8 rounded-xl bg-blue-500 px-8 py-4 font-semibold hover:bg-blue-600"
          >
            {isLoggedIn ? "Go to Dashboard →" : "Start Practicing →"}
          </button>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 Interview Ace AI. Built with React and AI.
      </footer>
    </div>
  );
}

// =========================
// LOGIN PAGE
// =========================

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    // Demo login only. No backend authentication yet.
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email.trim());

    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <button
          onClick={() => navigate("/")}
          className="mb-8 text-sm text-slate-400 hover:text-white"
        >
          ← Back to Home
        </button>

        <h1 className="text-3xl font-bold">
          Welcome <span className="text-blue-400">Back!</span>
        </h1>

        <p className="mt-2 text-slate-400">
          Login to Interview Ace AI
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <div className="flex rounded-lg border border-slate-700 bg-slate-950 focus-within:border-blue-500">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent px-4 py-3 text-white outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-sm text-blue-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-3 font-semibold transition hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Login to access your Interview Ace AI dashboard.
        </p>
      </div>
    </div>
  );
}

// =========================
// DASHBOARD PAGE
// =========================

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || "User";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">
            Interview <span className="text-blue-400">Ace AI</span>
          </h1>

          <button
            onClick={() => logoutUser(navigate)}
            className="rounded-lg border border-red-500 px-5 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 md:p-12">
          <p className="font-semibold text-blue-400">
            YOUR DASHBOARD
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Welcome back!
          </h2>

          <p className="mt-3 text-slate-400">{email}</p>

          <p className="mt-6 max-w-2xl leading-7 text-slate-300">
            Get ready to improve your interview skills. Practice with
            AI-powered mock interviews and receive feedback on your answers.
          </p>

          <button
            onClick={() => navigate("/setup")}
            className="mt-8 rounded-xl bg-blue-500 px-8 py-4 font-semibold hover:bg-blue-600"
          >
            Start New Interview →
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl">🤖</div>
            <h3 className="mt-4 text-xl font-semibold">AI Interview</h3>
            <p className="mt-2 text-slate-400">
              Practice with AI-generated evaluation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl">📊</div>
            <h3 className="mt-4 text-xl font-semibold">Performance</h3>
            <p className="mt-2 text-slate-400">
              Review your answers and feedback after interviews.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl">🎯</div>
            <h3 className="mt-4 text-xl font-semibold">Improve Skills</h3>
            <p className="mt-2 text-slate-400">
              Identify areas where you can improve.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// =========================
// MAIN APP / ROUTES
// =========================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<InterviewSetup />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/results" element={<Results />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
