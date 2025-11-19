"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.correo, formData.contrasena);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel Izquierdo - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary to-orange-600 p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <span className="material-symbols-outlined text-3xl text-white">inventory_2</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hapag-Lloyd</h1>
              <p className="text-sm text-white/80">Sistema de Monitoreo GPS</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Acceso para Operadores de Monitoreo
          </h2>
          <p className="text-lg text-white/90">
            Sistema de seguimiento en tiempo real de contenedores y operaciones logísticas.
          </p>

          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <span className="material-symbols-outlined text-white">map</span>
              </div>
              <div>
                <p className="font-semibold text-white">Monitoreo en Tiempo Real</p>
                <p className="text-sm text-white/80">Seguimiento GPS de contenedores</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <span className="material-symbols-outlined text-white">report</span>
              </div>
              <div>
                <p className="font-semibold text-white">Gestión de Incidencias</p>
                <p className="text-sm text-white/80">Registro y seguimiento de eventos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <span className="material-symbols-outlined text-white">analytics</span>
              </div>
              <div>
                <p className="font-semibold text-white">Reportes y Análisis</p>
                <p className="text-sm text-white/80">Información detallada de operaciones</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-white/60">
          © 2025 Hapag-Lloyd. Todos los derechos reservados.
        </div>
      </div>

      {/* Panel Derecho - Login */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo Mobile */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <span className="material-symbols-outlined text-3xl text-primary">inventory_2</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Hapag-Lloyd</h1>
              <p className="text-sm text-zinc-500">Sistema de Monitoreo</p>
            </div>
          </div>

          {/* Formulario de Login */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-zinc-900">Bienvenido</h2>
            <p className="mb-8 text-zinc-600">Ingresa tus credenciales para acceder al sistema</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  required
                  placeholder="operador@hapag-lloyd.com"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600">error</span>
                    <p className="text-sm font-medium text-red-600">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            {/* Nota informativa */}
            <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-600">info</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">Acceso para Operadores</p>
                  <p className="mt-1 text-xs text-blue-700">
                    Solo los operadores de monitoreo registrados tienen acceso a este sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
