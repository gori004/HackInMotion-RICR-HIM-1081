import { useState } from "react";
import Button from "../ui/Button";
import Card, { CardHeader } from "../ui/Card";
import { Briefcase, Code, Users, TrendingUp, Sparkles } from "lucide-react";

const ROLES = [
  { id: "software-engineer", label: "Software Engineer", icon: Code },
  { id: "product-manager", label: "Product Manager", icon: Briefcase },
  { id: "marketing", label: "Marketing", icon: TrendingUp },
  { id: "sales", label: "Sales", icon: Users },
];

const TOPICS = [
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
  { id: "mixed", label: "Mixed (Technical + Behavioral)" },
];

const DIFFICULTIES = [
  { id: "entry", label: "Entry level" },
  { id: "mid", label: "Mid level" },
  { id: "senior", label: "Senior level" },
];

export default function InterviewSetup({ onStart }) {
  const [role, setRole] = useState("");
  const [topic, setTopic] = useState("mixed");
  const [difficulty, setDifficulty] = useState("mid");
  const [questionCount, setQuestionCount] = useState(5);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!role) {
      setError("Please select a target role to continue.");
      return;
    }
    setError("");
    onStart?.({ role, topic, difficulty, questionCount });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader
        title="Set up your mock interview"
        subtitle="We'll tailor questions to your resume and the role below."
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Target role</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const selected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm font-medium transition-colors ${
                  selected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}
              >
                <Icon size={20} />
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Question focus</label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                topic === t.id
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of questions</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[3, 5, 8, 10].map((n) => (
              <option key={n} value={n}>{n} questions</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <Button onClick={handleStart} className="w-full" size="lg">
        <Sparkles size={18} className="mr-2" />
        Start Mock Interview
      </Button>
    </Card>
  );
}