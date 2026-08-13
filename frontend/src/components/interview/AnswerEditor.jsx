import { useState } from "react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { Send, RotateCcw } from "lucide-react";

const MIN_CHARS = 20;
const MAX_CHARS = 3000;

export default function AnswerEditor({ onSubmit, isSubmitting = false, initialValue = "" }) {
  const [answer, setAnswer] = useState(initialValue);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAnswer(e.target.value.slice(0, MAX_CHARS));
    if (error) setError("");
  };

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (trimmed.length < MIN_CHARS) {
      setError(`Please write at least ${MIN_CHARS} characters — try to fully explain your answer.`);
      return;
    }
    onSubmit?.(trimmed);
  };

  const handleClear = () => {
    setAnswer("");
    setError("");
  };

  return (
    <div>
      <textarea
        value={answer}
        onChange={handleChange}
        rows={8}
        placeholder="Type your answer here. Structure it clearly — context, action, and result work well for behavioral questions."
        disabled={isSubmitting}
        className={`w-full border rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      />

      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs ${answer.length < MIN_CHARS ? "text-gray-400" : "text-gray-500"}`}>
          {answer.length}/{MAX_CHARS} characters
        </span>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>

      <div className="flex gap-3 mt-4">
        <Button variant="ghost" onClick={handleClear} disabled={isSubmitting || !answer}>
          <RotateCcw size={16} className="mr-1.5" /> Clear
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <Spinner size={18} />
          ) : (
            <>
              <Send size={16} className="mr-1.5" /> Submit Answer
            </>
          )}
        </Button>
      </div>
    </div>
  );
}