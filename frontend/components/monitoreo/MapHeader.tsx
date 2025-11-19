"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function MapHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  // Determinar título según la ruta
  const getTitle = () => {
    if (pathname?.includes('/entregas')) return { icon: 'local_shipping', title: 'Gestión de Entregas', subtitle: 'Control de entregas' };
    if (pathname?.includes('/reportes')) return { icon: 'description', title: 'Gestión de Reportes', subtitle: 'Generación y consulta' };
    if (pathname?.includes('/incidencias')) return { icon: 'report', title: 'Gestión de Incidencias', subtitle: 'Registro y seguimiento' };
    if (pathname?.includes('/notificaciones')) return { icon: 'notifications', title: 'Centro de Notificaciones', subtitle: 'Alertas del sistema' };
    if (pathname?.includes('/mapa')) return { icon: 'map', title: 'Monitoreo GPS en Tiempo Real', subtitle: 'Seguimiento de activos' };
    if (pathname?.includes('/contenedores')) return { icon: 'inventory_2', title: 'Gestión de Contenedores', subtitle: 'Monitoreo y control' };
    if (pathname?.includes('/operaciones')) return { icon: 'list_alt', title: 'Operaciones de Transporte', subtitle: 'Gestión de operaciones' };
    return { icon: 'dashboard', title: 'Sistema de Monitoreo', subtitle: 'Hapag-Lloyd' };
  };

  const pageInfo = getTitle();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo y Título Dinámico - FIJOS (no se comprimen) */}
        <div className="flex flex-shrink-0 items-center gap-4">
          <Link
            href="/monitoreo"
            className="flex items-center gap-2 text-xl font-bold text-[#002b5c] transition-colors hover:text-[#ff8c00]"
          >
            <Image
              src="/favicon/favicon-96x96.png"
              alt="Hapag Lloyd"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="whitespace-nowrap">Hapag-Lloyd</span>
          </Link>
          
          <div className="h-8 w-px bg-zinc-300"></div>
          
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">{pageInfo.icon}</span>
            <div>
              <h1 className="whitespace-nowrap text-sm font-bold text-zinc-900">{pageInfo.title}</h1>
              <p className="whitespace-nowrap text-xs text-zinc-500">{pageInfo.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Navegación Rápida con Scroll Horizontal - SCROLLEABLE */}
        <nav className="hidden flex-1 overflow-hidden lg:block">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          <Link
            href="/monitoreo"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === '/monitoreo'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/monitoreo/operaciones"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.includes('/operaciones')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">list_alt</span>
            <span>Operaciones</span>
          </Link>
          <Link
            href="/monitoreo/contenedores"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.includes('/contenedores')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">inventory_2</span>
            <span>Contenedores</span>
          </Link>
          <Link
            href="/monitoreo/mapa"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.includes('/mapa')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">map</span>
            <span>Mapa GPS</span>
          </Link>
          <Link
            href="/monitoreo/notificaciones"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.includes('/notificaciones')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span>Notificaciones</span>
          </Link>
          <Link
            href="/monitoreo/incidencias"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.includes('/incidencias')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">report</span>
            <span>Incidencias</span>
          </Link>
          <Link
            href="/monitoreo/reportes"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.includes('/reportes')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">description</span>
            <span>Reportes</span>
          </Link>
          <Link
            href="/monitoreo/entregas"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.includes('/entregas')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">local_shipping</span>
            <span>Entregas</span>
          </Link>
          </div>
        </nav>

        {/* Right Section - FIJA (no se comprime) */}
        <div className="flex flex-shrink-0 items-center gap-3">
          {/* Indicador de actualización en vivo */}
          <div className="hidden items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-700">En vivo</span>
          </div>

          {/* Notificaciones */}
          <Link
            href="/monitoreo/notificaciones"
            aria-label="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#ff8c00]"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff8c00]" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-2 transition-colors hover:border-gray-300 hover:bg-gray-100"
            >
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-gray-900">Usuario Admin</span>
                <span className="text-xs text-gray-500">admin@system.com</span>
              </div>
              <Image
                alt="Avatar del usuario"
                className="rounded-full object-cover ring-2 ring-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGW1RCKn4_p2DEp_nqUIMD-UhmQI0U67Tv1z3GyWNNaMEKR60x_kvU8bFyDxGuk42_6J-TUIZCA_62_OZfV2fy-6ZBK_tDTavjU8bFyDxGuk42_6J-TUIZCA_62_OZfV2fy-6ZBK_tDTavjU8mNjUxrog_KtOIAGwGKuI661uf-TRBuSBll8xexGJzX-h8riSZ4HiBmoVIM9ZiMQNKsRkCMYEBc9LP42mR80T9hDBPNC6eEBjwu4plOkwcrpxtsj1t5QMvDD8fKfRS5f1OvUB_EULragT4sbQYgVgabyRPtXiwE6JXmqhJ1ihDh"
                height={36}
                width={36}
                priority
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-14 w-56 rounded-lg border border-zinc-200 bg-white py-2 shadow-xl">
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  Mi Perfil
                </Link>
                <Link
                  href="/configuracion"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  Configuración
                </Link>
                <hr className="my-2 border-zinc-200" />
                <button
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
