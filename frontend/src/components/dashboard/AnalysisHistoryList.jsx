import { FileText, ChevronRight } from "lucide-react";
import Card, { CardHeader } from "../ui/Card";

export default function AnalysisHistoryList({ analyses = [], onSelect }) {
  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600 bg-green-50";
    if (score >= 50) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card padded={false}>
      <div className="p-6 pb-0">
        <CardHeader title="Resume analysis history" subtitle="Your past match results" />
      </div>

      {analyses.length === 0 ? (
        <p className="text-sm text-gray-400 px-6 pb-6">No analyses yet — upload a resume to get started.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {analyses.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect?.(item)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className="text-indigo-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.jobTitle}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getScoreColor(item.score)}`}>
                    {item.score}%
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