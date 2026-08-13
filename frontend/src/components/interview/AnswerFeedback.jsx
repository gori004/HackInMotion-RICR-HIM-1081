import Card from "../ui/Card";
import { CheckCircle2, AlertTriangle, MessageSquareText } from "lucide-react";

function ScoreBar({ label, score }) {
  const getColor = (value) => {
    if (value >= 75) return "bg-green-500";
    if (value >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-800 font-semibold">{score}/100</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function AnswerFeedback({ feedback }) {
  if (!feedback) return null;

  const { clarity, relevance, completeness, strengths = [], improvements = [], summary } = feedback;

  return (
    <Card className="border-l-4 border-l-green-500">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareText size={20} className="text-indigo-500" />
        <h3 className="font-semibold text-gray-800">Feedback on your answer</h3>
      </div>

      <div className="space-y-3 mb-5">
        <ScoreBar label="Clarity" score={clarity} />
        <ScoreBar label="Relevance" score={relevance} />
        <ScoreBar label="Completeness" score={completeness} />
      </div>

      {summary && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">{summary}</p>
      )}

      {strengths.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">What worked well</p>
          <ul className="space-y-1.5">
            {strengths.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {improvements.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Room to improve</p>
          <ul className="space-y-1.5">
            {improvements.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}