import Image from "next/image";
import Link from "next/link";

const navigationLinks = [
  { label: "Reservas", href: "#" },
  { label: "Personal", href: "#" },
  { label: "Operaciones Marítimas", href: "/operaciones-maritimas" },
  { label: "Operaciones Portuarias", href: "#" },
  { label: "Operaciones Terrestres", href: "#" },
  { label: "Mantenimiento Logístico", href: "#" },
  { label: "Monitoreo", href: "#" },
];

export function Header() {
  return (
    <header className="w-full bg-white shadow-md dark:bg-gray-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-2xl font-bold text-[#002b5c] transition-colors hover:text-[#ff8c00]"
          >
            Hapag-Lloyd
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                className="pb-1 transition-colors hover:text-[#ff8c00]"
                href={item.href}
              >
                {item.label}
              </Link>
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
  );
}

