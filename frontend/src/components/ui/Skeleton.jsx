export function SkeletonLine({ width = "100%", height = "1rem", className = "" }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
      <SkeletonLine width="40%" height="1.25rem" />
      <SkeletonLine width="90%" />
      <SkeletonLine width="75%" />
      <SkeletonLine width="60%" />
    </div>
  );
}