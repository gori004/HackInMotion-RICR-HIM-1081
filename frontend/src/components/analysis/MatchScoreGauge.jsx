export default function MatchScoreGauge({ score = 0, size = 160 }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const getColor = (value) => {
    if (value >= 75) return "#16a34a"; // green
    if (value >= 50) return "#ca8a04"; // amber
    return "#dc2626"; // red
  };

  const getLabel = (value) => {
    if (value >= 75) return "Strong match";
    if (value >= 50) return "Moderate match";
    return "Needs work";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={12}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(clamped)}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{clamped}%</span>
          <span className="text-xs text-gray-400">match</span>
        </div>
      </div>
      <span
        className="text-sm font-medium"
        style={{ color: getColor(clamped) }}
      >
        {getLabel(clamped)}
      </span>
    </div>
  );
}