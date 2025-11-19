"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function MapHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { usuario, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserMenu]);

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

  const navLinks = [
    { href: '/monitoreo', icon: 'dashboard', label: 'Dashboard', match: '/monitoreo' },
    { href: '/monitoreo/operaciones', icon: 'list_alt', label: 'Operaciones', match: '/operaciones' },
    { href: '/monitoreo/contenedores', icon: 'inventory_2', label: 'Contenedores', match: '/contenedores' },
    { href: '/monitoreo/mapa', icon: 'map', label: 'Mapa GPS', match: '/mapa' },
    { href: '/monitoreo/notificaciones', icon: 'notifications', label: 'Notificaciones', match: '/notificaciones' },
    { href: '/monitoreo/incidencias', icon: 'report', label: 'Incidencias', match: '/incidencias' },
    { href: '/monitoreo/reportes', icon: 'description', label: 'Reportes', match: '/reportes' },
    { href: '/monitoreo/entregas', icon: 'local_shipping', label: 'Entregas', match: '/entregas' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo y Título Dinámico - FIJOS */}
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
        <nav className="hidden min-w-0 flex-1 lg:block">
          <div 
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 hover:scrollbar-thumb-zinc-400"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d4d4d8 transparent'
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.match || pathname?.includes(link.match)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#ff8c00]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Right Section - FIJA */}
        <div className="flex flex-shrink-0 items-center gap-3">
          {/* Indicador de actualización en vivo */}
          <div className="hidden items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-700">En vivo</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#ff8c00] dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined text-2xl">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notificaciones */}
          <Link
            href="/monitoreo/notificaciones"
            aria-label="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#ff8c00] dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff8c00]" />
          </Link>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-2 transition-colors hover:border-gray-300 hover:bg-gray-100"
            >
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-semibold text-gray-900">
                  {usuario?.empleado?.nombre} {usuario?.empleado?.apellido}
                </span>
                <span className="text-xs text-gray-500">{usuario?.correo_electronico}</span>
              </div>
              <div className="relative h-9 w-9 flex-shrink-0">
                <Image
                  alt="Avatar del usuario"
                  className="rounded-full object-cover ring-2 ring-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGW1RCKn4_p2DEp_nqUIMD-UhmQI0U67Tv1z3GyWNNaMEKR60x_kvU8bFyDxGuk42_6J-TUIZCA_62_OZfV2fy-6ZBK_tDTavjU8bFyDxGuk42_6J-TUIZCA_62_OZfV2fy-6ZBK_tDTavjU8mNjUxrog_KtOIAGwGKuI661uf-TRBuSBll8xexGJzX-h8riSZ4HiBmoVIM9ZiMQNKsRkCMYEBc9LP42mR80T9hDBPNC6eEBjwu4plOkwcrpxtsj1t5QMvDD8fKfRS5f1OvUB_EULragT4sbQYgVgabyRPtXiwE6JXmqhJ1ihDh"
                  fill
                  sizes="36px"
                  priority
                />
              </div>
              <span className="material-symbols-outlined text-lg text-gray-500">
                {showUserMenu ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Overlay invisible para cerrar el menú */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                
                {/* Menú dropdown */}
                <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-2 shadow-xl">
                  <div className="px-4 py-3 border-b border-zinc-200">
                    <p className="text-sm font-semibold text-zinc-900">
                      {usuario?.empleado?.nombre} {usuario?.empleado?.apellido}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {usuario?.correo_electronico}
                    </p>
                  </div>
                  
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
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Estilos personalizados para el scrollbar */}
      <style jsx global>{`
        /* Para navegadores webkit (Chrome, Safari, Edge) */
        nav > div::-webkit-scrollbar {
          height: 6px;
        }
        
        nav > div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        nav > div::-webkit-scrollbar-thumb {
          background-color: #d4d4d8;
          border-radius: 3px;
        }
        
        nav > div::-webkit-scrollbar-thumb:hover {
          background-color: #a1a1aa;
        }
      `}</style>
    </header>
  );
}