import { AlertTriangle, TrendingDown, XCircle } from "lucide-react";

const SEVERITY_STYLES = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-gray-50 text-gray-600 border-gray-200",
};

const SEVERITY_ICON = {
  high: XCircle,
  medium: AlertTriangle,
  low: TrendingDown,
};

export default function MissingKeywordsList({ keywords = [] }) {
  if (!keywords.length) {
    return (
      <p className="text-sm text-gray-500 italic">
        No major keyword gaps found — nice work!
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => {
          const severity = kw.severity || "medium";
          const Icon = SEVERITY_ICON[severity];
          return (
            <span
              key={kw.term}
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${SEVERITY_STYLES[severity]}`}
              title={kw.reason || ""}
            >
              <Icon size={14} />
              {kw.term}
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Recommended
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400" /> Nice to have
        </span>
      </div>
    </div>
  );
}