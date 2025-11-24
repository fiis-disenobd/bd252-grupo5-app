"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GestionReservasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header con Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/favicon/favicon-96x96.png"
              alt="Hapag-Lloyd"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-[#003366]">Hapag-Lloyd</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-6 border-b border-gray-200">
            <Link
              href="/gestion-reservas/dashboard"
              className={`px-4 py-3 transition-colors ${
                isActive("/gestion-reservas/dashboard")
                  ? "text-[#003366] border-b-2 border-[#003366] font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/gestion-reservas/reservas"
              className={`px-4 py-3 transition-colors ${
                isActive("/gestion-reservas/reservas")
                  ? "text-[#003366] border-b-2 border-[#003366] font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Reservas
            </Link>
            <Link
              href="/gestion-reservas/clientes"
              className={`px-4 py-3 transition-colors ${
                isActive("/gestion-reservas/clientes")
                  ? "text-[#003366] border-b-2 border-[#003366] font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Clientes
            </Link>
            <Link
              href="/gestion-reservas/nueva-reserva"
              className={`px-4 py-3 transition-colors ${
                isActive("/gestion-reservas/nueva-reserva")
                  ? "text-[#003366] border-b-2 border-[#003366] font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Nueva Reserva
            </Link>
            <Link
              href="/gestion-reservas/tarifas"
              className={`px-4 py-3 transition-colors ${
                isActive("/gestion-reservas/tarifas")
                  ? "text-[#003366] border-b-2 border-[#003366] font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tarifas
            </Link>
          </nav>
        </div>
      </div>

      {/* Contenido de cada página */}
      {children}
    </div>
  );
}
