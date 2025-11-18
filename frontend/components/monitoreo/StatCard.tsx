interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: string;
  color?: string;
}

export function StatCard({ title, value, unit, icon, color = "primary" }: StatCardProps) {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    amber: { bg: "bg-amber-100", text: "text-amber-600" },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}>
          <span className={`material-symbols-outlined text-2xl ${colors.text}`}>{icon}</span>
        </div>
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="text-2xl font-bold text-zinc-900">
            {value} {unit && <span className="text-lg text-zinc-500">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
