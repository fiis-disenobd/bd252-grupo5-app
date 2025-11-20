import Link from "next/link";

interface SensorCardProps {
  sensor: {
    id_sensor: string;
    tipo_sensor?: { nombre: string };
    rol_sensor?: { nombre: string };
  };
  contenedorId: string;
}

export function SensorCard({ sensor, contenedorId }: SensorCardProps) {
  const rolNombre = sensor.rol_sensor?.nombre || "Sin rol";
  const rolKey = rolNombre.toLowerCase();

  let icon = "sensors";
  let iconBg = "bg-blue-100";
  let iconColor = "text-blue-600";

  if (rolKey === "primario") {
    icon = "sensor_occupied";
    iconBg = "bg-emerald-50";
    iconColor = "text-emerald-600";
  } else if (rolKey === "secundario") {
    icon = "sensors";
    iconBg = "bg-sky-50";
    iconColor = "text-sky-600";
  } else if (rolKey === "respaldo") {
    icon = "inventory_2";
    iconBg = "bg-indigo-50";
    iconColor = "text-indigo-600";
  } else if (rolKey === "calibracion" || rolKey === "calibración") {
    icon = "tune";
    iconBg = "bg-amber-50";
    iconColor = "text-amber-600";
  } else if (rolKey === "monitoreo" || rolKey === "monitoréo") {
    icon = "monitor_heart";
    iconBg = "bg-purple-50";
    iconColor = "text-purple-600";
  }

  return (
    <Link
      href={`/monitoreo/contenedores/${contenedorId}/sensores/${sensor.id_sensor}`}
      className="block w-full rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg}`}>
          <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-zinc-900">
            {sensor.tipo_sensor?.nombre || "Sensor"}
          </p>
          <p className="text-sm text-zinc-500">
            {rolNombre}
          </p>
        </div>
        <span className="material-symbols-outlined text-zinc-400">chevron_right</span>
      </div>
    </Link>
  );
}
