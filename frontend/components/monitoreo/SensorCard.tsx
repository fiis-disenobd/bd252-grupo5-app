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
  return (
    <Link
      href={`/monitoreo/contenedores/${contenedorId}/sensores/${sensor.id_sensor}`}
      className="block w-full rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
          <span className="material-symbols-outlined text-2xl text-blue-600">sensors</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-zinc-900">
            {sensor.tipo_sensor?.nombre || "Sensor"}
          </p>
          <p className="text-sm text-zinc-500">
            {sensor.rol_sensor?.nombre || "Sin rol"}
          </p>
        </div>
        <span className="material-symbols-outlined text-zinc-400">chevron_right</span>
      </div>
    </Link>
  );
}
