"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/monitoreo", exact: true },
  { icon: "list_alt", label: "Operaciones", href: "/monitoreo/operaciones" },
  { icon: "map", label: "Mapa GPS", href: "/monitoreo/mapa" },
  { icon: "inventory_2", label: "Contenedores", href: "/monitoreo/contenedores" },
  { icon: "notifications", label: "Notificaciones", href: "/monitoreo/notificaciones" },
  { icon: "error", label: "Incidencias", href: "/monitoreo/incidencias" },
  { icon: "description", label: "Reportes", href: "/monitoreo/reportes" },
  { icon: "settings", label: "Configuración", href: "/monitoreo/configuracion" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white text-zinc-700">
      <div className="flex h-full min-h-0 flex-col justify-between p-4">
        {/* Top section */}
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-3">
            <div className="size-6">
              <Image
                src="/favicon/favicon-96x96.png"
                alt="Hapag Lloyd"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Hapag Lloyd</h2>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    active
                      ? "bg-primary text-white shadow-md"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white"></span>
                  )}
                  <span className={`material-symbols-outlined text-2xl ${active ? 'font-bold' : ''}`}>
                    {item.icon}
                  </span>
                  <p className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom section - User */}
        <div className="flex flex-col gap-1 border-t border-zinc-200 pt-4">
          <div className="flex gap-3 p-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALZBRt7PEki-eiukhDXcagW8ws9NirKTq3Wrh2DSb2D7m04fdVm3Ov0BD9IL3WbY1LZlhza9_hd637kpfHMaQO_Sh0g9HAF9zDl8A-sIcMiq5KA0TiQZAadODD8HpaLaTyxj1p2J59nomDOcCcUHiZ73BP0cxk64Oh4ITgAqhjsbkkg7gduOJXJFzT7E9DKlom65ETkQpRHq6RWY-yoYAat16HJ4kucW_SBziOV10cSNd90KMz6eyUklAVCxlPcImgiPXAxLjql8ma"
                alt="User avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-medium text-zinc-700">Usuario Admin</h1>
              <p className="text-xs text-zinc-500">admin@system.com</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            <p className="text-sm font-medium">Cerrar Sesión</p>
          </Link>
        </div>
      </div>
    </aside>
  );
}
