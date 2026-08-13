import Card from "../ui/Card";
import { HelpCircle, Code, MessageCircle } from "lucide-react";

export default function QuestionCard({
  question,
  currentIndex = 0,
  totalQuestions = 1,
  category = "behavioral",
}) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const Icon = category === "technical" ? Code : MessageCircle;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="capitalize flex items-center gap-1">
          <Icon size={14} /> {category}
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="border-l-4 border-l-indigo-500">
        <div className="flex items-start gap-3">
          <HelpCircle size={22} className="text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            {question}
          </p>
        </div>
      </Card>
    </div>
  );
}