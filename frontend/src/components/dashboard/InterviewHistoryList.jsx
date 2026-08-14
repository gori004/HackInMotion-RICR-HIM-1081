import { Mic, ChevronRight, Clock } from "lucide-react";
import Card, { CardHeader } from "../ui/Card";

export default function InterviewHistoryList({ sessions = [], onSelect }) {
  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600 bg-green-50";
    if (score >= 50) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card padded={false}>
      <div className="p-6 pb-0">
        <CardHeader title="Mock interview history" subtitle="Your past practice sessions" />
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-gray-400 px-6 pb-6">No mock interviews yet — start one to build your track record.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <li key={session.id}>
              <button
                onClick={() => onSelect?.(session)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mic size={18} className="text-indigo-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate capitalize">
                      {session.role.replace("-", " ")}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {session.date} • {session.questionCount} questions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getScoreColor(session.overallScore)}`}>
                    {session.overallScore}/100
                  </span>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}