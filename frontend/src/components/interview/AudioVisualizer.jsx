import useMicVisualizer from "../../hooks/useMicVisualizer";
import { Mic, Square, AlertCircle } from "lucide-react";

export default function AudioVisualizer({ onStateChange }) {
  const { levels, isActive, error, start, stop } = useMicVisualizer();

  const handleToggle = async () => {
    if (isActive) {
      stop();
      onStateChange?.(false);
    } else {
      await start();
      onStateChange?.(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-end gap-1 h-16">
        {levels.map((level, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-75 ${
              isActive ? "bg-indigo-500" : "bg-gray-300"
            }`}
            style={{ height: `${level}px` }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
          isActive
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {isActive ? <Square size={16} /> : <Mic size={16} />}
        {isActive ? "Stop recording" : "Start recording"}
      </button>

      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}