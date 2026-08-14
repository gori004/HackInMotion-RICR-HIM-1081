import { useState, useRef } from "react";
import { UploadCloud, FileText, XCircle, Loader2 } from "lucide-react";
import api from "../../services/api";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_MB = 5;

export default function ResumeDropzone({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (selected) => {
    const ext = selected.name.slice(selected.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_TYPES.includes(selected.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
      return "Only PDF or DOCX files are supported.";
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_SIZE_MB}MB.`;
    }
    return "";
  };

  const handleFile = async (selected) => {
    const validationError = validateFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append("resume", selected);

      // Call backend upload / parse endpoint
      const { data } = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedText = data.parsedText || data.rawText || "";
      if (onTextExtracted) {
        onTextExtracted(extractedText);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to extract text from resume");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    if (onTextExtracted) onTextExtracted("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400 bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="hidden"
        />

        {!file ? (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <UploadCloud size={36} className="text-indigo-500" />
            <p className="font-medium text-gray-700">
              Drag & drop your resume here, or click to browse
            </p>
            <p className="text-xs">PDF or DOCX, up to {MAX_SIZE_MB}MB</p>
          </div>
        ) : (
          <div
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-left">
              {isParsing ? (
                <Loader2 className="text-indigo-600 animate-spin" size={22} />
              ) : (
                <FileText className="text-indigo-600" size={22} />
              )}
              <div>
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {isParsing ? "Extracting text..." : formatSize(file.size)}
                </p>
              </div>
            </div>
            <button type="button" onClick={clearFile} aria-label="Remove file">
              <XCircle size={20} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <XCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}