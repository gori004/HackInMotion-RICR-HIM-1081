import { useState } from "react";
import { ClipboardPaste, UploadCloud } from "lucide-react";

const MAX_CHARS = 5000;

export default function JobDescriptionInput({ onChange }) {
  const [mode, setMode] = useState("paste"); // "paste" | "upload"
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleTextChange = (e) => {
    const value = e.target.value.slice(0, MAX_CHARS);
    setText(value);
    onChange?.({ type: "text", value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onChange?.({ type: "file", value: file });
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium ${
            mode === "paste"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <ClipboardPaste size={16} /> Paste text
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium ${
            mode === "upload"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <UploadCloud size={16} /> Upload file
        </button>
      </div>

      {mode === "paste" ? (
        <div>
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={8}
            placeholder="Paste the target job description here..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {text.length}/{MAX_CHARS} characters
          </p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400">
          <UploadCloud size={28} className="text-indigo-500 mb-2" />
          <span className="text-sm text-gray-600">
            {fileName || "Click to upload job description (PDF/DOCX/TXT)"}
          </span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}