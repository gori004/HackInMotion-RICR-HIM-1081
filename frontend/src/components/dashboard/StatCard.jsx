import Card from "../ui/Card";

export default function StatCard({ icon: Icon, label, value, accent = "indigo" }) {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Card className="flex items-center gap-3 sm:gap-4 !p-4 sm:!p-6 min-w-0">
      <div className={`p-3 rounded-lg shrink-0 ${accents[accent] || accents.indigo}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{value}</p>
        <p className="text-sm text-gray-500 truncate">{label}</p>
      </div>
    </Card>
  );
}