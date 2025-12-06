import Link from "next/link";
import { Header } from "@/components/Header";

const modules = [
  {
    icon: "calendar_month",
    title: "Reservas",
    description: "Gestionar las reservas",
    href: "/login-gestion-reservas",
  },
  {
    icon: "groups",
    title: "Personal",
    description: "Administrar el personal",
    href: "#",
  },
  {
    icon: "directions_boat",
    title: "Operaciones Marítimas",
    description: "Supervisar actividades marítimas",
    href: "/login-operaciones-maritimas",
  },
  {
    icon: "warehouse",
    title: "Operaciones Portuarias",
    description: "Controlar operaciones en puerto",
    href: "/login-operaciones-portuarias",
  },
  {
    icon: "local_shipping",
    title: "Operaciones Terrestres",
    description: "Coordinar transporte terrestre",
    href: "#",
  },
  {
    icon: "build",
    title: "Mantenimiento Logístico",
    description: "Planificar y registrar mantenimiento",
    href: "#",
  },
  {
    icon: "monitoring",
    title: "Monitoreo",
    description: "Visualizar seguimiento en tiempo real",
    href: "/monitoreo",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-[#0f1923] dark:text-gray-100">
      <Header />

      <main className="mx-auto flex w-full flex-grow items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-[#002b5c]">
            Bienvenido a Hapag-Lloyd
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.title}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#ff8c00] p-6 text-white shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-opacity-90"
                href={module.href}
              >
                <span className="material-symbols-outlined text-5xl">
                  {module.icon}
                </span>
                <span className="text-xl font-semibold">{module.title}</span>
                <span className="text-sm font-normal">
                  ({module.description})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
