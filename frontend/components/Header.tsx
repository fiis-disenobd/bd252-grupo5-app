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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[#002b5c] transition-colors hover:text-[#ff8c00]"
        >
          <Image
            src="/favicon/favicon-96x96.png"
            alt="Hapag Lloyd"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span>Hapag-Lloyd</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((item) => (
            <Link
              key={item.label}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#ff8c00]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            className="flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-100"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">search</span>
            <span className="hidden sm:inline">Buscar...</span>
          </button>

          {/* Notifications */}
          <button
            aria-label="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#ff8c00]"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">
              notifications
            </span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff8c00]" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-2 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-semibold text-gray-900">Usuario Admin</span>
              <span className="text-xs text-gray-500">admin@system.com</span>
            </div>
            <Image
              alt="Avatar del usuario"
              className="rounded-full object-cover ring-2 ring-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGW1RCKn4_p2DEp_nqUIMD-UhmQI0U67Tv1z3GyWNNaMEKR60x_kvU8bFyDxGuk42_6J-TUIZCA_62_OZfV2fy-6ZBK_tDTavjU8mNjUxrog_KtOIAGwGKuI661uf-TRBuSBll8xexGJzX-h8riSZ4HiBmoVIM9ZiMQNKsRkCMYEBc9LP42mR80T9hDBPNC6eEBjwu4plOkwcrpxtsj1t5QMvDD8fKfRS5f1OvUB_EULragT4sbQYgVgabyRPtXiwE6JXmqhJ1ihDh"
              height={36}
              width={36}
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}

