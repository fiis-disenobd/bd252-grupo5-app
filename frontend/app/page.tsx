import Image from "next/image";

const navigation = [
  "Reservas",
  "Personal",
  "Operaciones Marítimas",
  "Operaciones Portuarias",
  "Operaciones Terrestres",
  "Mantenimiento Logístico",
  "Monitoreo",
];

const modules = [
  {
    icon: "calendar_month",
    title: "Reservas",
    description: "Gestionar las reservas",
  },
  {
    icon: "groups",
    title: "Personal",
    description: "Administrar el personal",
  },
  {
    icon: "directions_boat",
    title: "Operaciones Marítimas",
    description: "Supervisar actividades marítimas",
  },
  {
    icon: "warehouse",
    title: "Operaciones Portuarias",
    description: "Controlar operaciones en puerto",
  },
  {
    icon: "local_shipping",
    title: "Operaciones Terrestres",
    description: "Coordinar transporte terrestre",
  },
  {
    icon: "build",
    title: "Mantenimiento Logístico",
    description: "Planificar y registrar mantenimiento",
  },
  {
    icon: "monitoring",
    title: "Monitoreo",
    description: "Visualizar seguimiento en tiempo real",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-[#0f1923] dark:text-gray-100">
      <header className="w-full bg-white shadow-md dark:bg-gray-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#002b5c]">Hapag-Lloyd</h1>
            <nav className="hidden items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex">
              {navigation.map((item) => (
                <a
                  key={item}
                  className="pb-1 transition-colors hover:text-[#ff8c00]"
                  href="#"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button
              aria-label="Notificaciones"
              className="relative text-gray-600 transition-colors hover:text-[#ff8c00] dark:text-gray-300"
              type="button"
            >
              <span className="material-symbols-outlined text-3xl">
                notifications
              </span>
              <span className="absolute -right-0.5 top-0 h-2 w-2 rounded-full bg-[#ff8c00]" />
            </button>
            <Image
              alt="Avatar del usuario"
              className="rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGW1RCKn4_p2DEp_nqUIMD-UhmQI0U67Tv1z3GyWNNaMEKR60x_kvU8bFyDxGuk42_6J-TUIZCA_62_OZfV2fy-6ZBK_tDTavjU8mNjUxrog_KtOIAGwGKuI661uf-TRBuSBll8xexGJzX-h8riSZ4HiBmoVIM9ZiMQNKsRkCMYEBc9LP42mR80T9hDBPNC6eEBjwu4plOkwcrpxtsj1t5QMvDD8fKfRS5f1OvUB_EULragT4sbQYgVgabyRPtXiwE6JXmqhJ1ihDh"
              height={40}
              width={40}
              priority
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full flex-grow items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-[#002b5c]">
            Bienvenido a Hapag-Lloyd
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <a
                key={module.title}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#ff8c00] p-6 text-white shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-opacity-90"
                href="#"
              >
                <span className="material-symbols-outlined text-5xl">
                  {module.icon}
                </span>
                <span className="text-xl font-semibold">{module.title}</span>
                <span className="text-sm font-normal">
                  ({module.description})
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
