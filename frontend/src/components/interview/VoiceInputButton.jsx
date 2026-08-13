import { Mic, MicOff, AlertCircle } from "lucide-react";
import useSpeechToText from "../../hooks/useSpeechToText";

export default function VoiceInputButton({ onTranscriptChange }) {
  const { isSupported, isListening, transcript, error, start, stop } = useSpeechToText();

  const handleToggle = () => {
    if (isListening) {
      stop();
      onTranscriptChange?.(transcript);
    } else {
      start();
    }
  };

  if (!isSupported) {
    return (
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <AlertCircle size={14} /> Voice input isn't supported in this browser — please type your answer.
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isListening
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100"
        }`}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        {isListening ? "Stop recording" : "Answer with voice"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}