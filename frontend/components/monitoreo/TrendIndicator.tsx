interface TrendIndicatorProps {
  trend: "ascendente" | "descendente" | "estable";
  description?: string;
}

export function TrendIndicator({ trend, description }: TrendIndicatorProps) {
  const trendConfig = {
    ascendente: {
      icon: "trending_up",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      label: "Tendencia Ascendente",
    },
    descendente: {
      icon: "trending_down",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      label: "Tendencia Descendente",
    },
    estable: {
      icon: "trending_flat",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "Tendencia Estable",
    },
  };

  const config = trendConfig[trend];

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-6`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-white`}>
          <span className={`material-symbols-outlined text-4xl ${config.color}`}>
            {config.icon}
          </span>
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-900">{config.label}</p>
          {description && (
            <p className="mt-1 text-sm text-zinc-600">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
