import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MockInterview from "./pages/MockInterview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeDropzone from "./components/upload/ResumeDropzone";
import JobDescriptionInput from "./components/upload/JobDescriptionInput";
import MatchScoreGauge from "./components/analysis/MatchScoreGauge";
import MissingKeywordsList from "./components/analysis/MissingKeywordsList";
import FeedbackAccordion from "./components/analysis/FeedbackAccordion";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import Spinner from "./components/ui/Spinner";
import api from "./services/api";

function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/analysis/match", {
        resumeText,
        jobDescriptionText: jobDescription,
      });
      setAnalysis(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          AI Resume ATS & Match Optimizer
        </h1>
        <p className="text-gray-600 mt-1">
          Upload your resume and target job description to get instant ATS scores and missing keyword analysis.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

     {/* Ingestion Section */}
<div className="grid md:grid-cols-2 gap-6">
  <Card className="p-5">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Upload Resume</h2>
    <ResumeDropzone onTextExtracted={(text) => setResumeText(text)} />
  </Card>

  <Card className="p-5">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Target Job Description</h2>
    <JobDescriptionInput value={jobDescription} onChange={(val) => setJobDescription(val)} />
  </Card>
</div>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
          <Card className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">ATS Match Score</h3>
            <MatchScoreGauge score={analysis.matchScore ?? 0} />
          </Card>

          <Card className="p-6 md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Missing Keywords & Skills</h3>
            <MissingKeywordsList keywords={analysis.keywordGap?.missingKeywords || []} />
            <FeedbackAccordion feedback={analysis.feedback || []} />
          </Card>
        </div>
      )}
    </div>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "interview" | "login" | "register"
  const { user } = useAuth();

  // If user logs in, ensure we don't trap them on login/register view
  useEffect(() => {
    if (user && (activeTab === "login" || activeTab === "register")) {
      setActiveTab("dashboard");
    }
  }, [user, activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
      <Navbar currentTab={activeTab} onNavigate={setActiveTab} />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "interview" && <MockInterview />}
        
        {activeTab === "login" && (
          <Login
            onLoginSuccess={() => setActiveTab("dashboard")}
            onSwitchToRegister={() => setActiveTab("register")}
          />
        )}
        
        {activeTab === "register" && (
          <Register
            onRegisterSuccess={() => setActiveTab("dashboard")}
            onSwitchToLogin={() => setActiveTab("login")}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}