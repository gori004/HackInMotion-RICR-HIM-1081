import { useState, useEffect } from "react";
import { FileText, Mic, TrendingUp, Target } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ScoreTrendChart from "../components/dashboard/ScoreTrendChart";
import AnalysisHistoryList from "../components/dashboard/AnalysisHistoryList";
import InterviewHistoryList from "../components/dashboard/InterviewHistoryList";
import { SkeletonCard } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalInterviews: 0,
    avgMatchScore: 0,
    avgInterviewScore: 0,
  });

  const [analyses, setAnalyses] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Mock trend data for Commit 22 visual display
  const trendData = [
    { date: "Aug 1", matchScore: 55, interviewScore: 60 },
    { date: "Aug 5", matchScore: 62, interviewScore: 68 },
    { date: "Aug 10", matchScore: 68, interviewScore: 74 },
  ];

  useEffect(() => {
    // Stats and history fetched from backend once endpoints are wired
    const timer = setTimeout(() => {
      setStats({
        totalAnalyses: 4,
        totalInterviews: 2,
        avgMatchScore: 68,
        avgInterviewScore: 74,
      });
      setAnalyses([]);
      setSessions([]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-gray-500 mt-1">Here's how your job search prep is going.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={FileText}
            label="Resumes analyzed"
            value={stats.totalAnalyses}
            accent="indigo"
          />
          <StatCard
            icon={Mic}
            label="Mock interviews"
            value={stats.totalInterviews}
            accent="green"
          />
          <StatCard
            icon={Target}
            label="Avg match score"
            value={`${stats.avgMatchScore}%`}
            accent="amber"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg interview score"
            value={`${stats.avgInterviewScore}/100`}
            accent="indigo"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="space-y-6">
        <ScoreTrendChart data={trendData} />

        {/* History Lists Side-by-Side */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AnalysisHistoryList
            analyses={analyses}
            onSelect={(item) => console.log("Selected analysis:", item)}
          />
          <InterviewHistoryList
            sessions={sessions}
            onSelect={(session) => console.log("Selected session:", session)}
          />
        </div>
      </div>
    </div>
  );
}