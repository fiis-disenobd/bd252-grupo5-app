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
      </div>
    </header>
  );
}

