"use client";

import { useState } from "react";
import Image from "next/image";
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
    <div className="flex min-h-screen bg-white">
      {/* Panel Izquierdo - Branding Monitoreo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white bg-gradient-to-br from-purple-600 to-indigo-500">
        <div>
          <div className="flex items-center space-x-4 mb-16">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
              <Image
                src="/favicon/favicon-96x96.png"
                alt="Hapag-Lloyd"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/80">Hapag-Lloyd</p>
              <p className="text-xs text-white/70">Módulo de Monitoreo</p>
            </div>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Monitoreo de Operaciones
          </h2>
          <p className="text-lg opacity-90 max-w-xl">
            Panel especializado para el seguimiento y control de operaciones en tiempo real.
          </p>

          <div className="mt-16 space-y-8 max-w-xl">
            <div className="flex items-start space-x-4">
              <span className="material-symbols-outlined text-3xl opacity-90 mt-1">monitoring</span>
              <div>
                <h3 className="font-bold text-lg">Vista Centralizada</h3>
                <p className="opacity-85 text-sm">Consolida la información clave de la operación en un solo lugar.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="material-symbols-outlined text-3xl opacity-90 mt-1">timeline</span>
              <div>
                <h3 className="font-bold text-lg">Seguimiento en Tiempo Real</h3>
                <p className="opacity-85 text-sm">Supervisa el estado de las operaciones y detecta incidencias oportunamente.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="material-symbols-outlined text-3xl opacity-90 mt-1">security</span>
              <div>
                <h3 className="font-bold text-lg">Acceso Seguro</h3>
                <p className="opacity-85 text-sm">Protección de la información crítica asociada al monitoreo de la operación.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm opacity-80">
          <p>© 2025 Hapag-Lloyd. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Panel Derecho - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header derecho */}
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2>
            <p className="text-gray-600 mt-2">
              Ingresa tus credenciales para acceder al módulo de Monitoreo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="correo">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  placeholder="empleado@hapag-lloyd.com"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  placeholder="••••••••"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary bg-white"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4">
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-red-600">error</span>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div />
              <div className="text-sm">
                <span className="font-medium text-primary cursor-default">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </div>
          </form>

          {/* Nota informativa general */}
          <div className="mt-8">
            <div className="flex items-start p-4 rounded-md bg-blue-50 border border-blue-200">
              <span className="material-symbols-outlined text-blue-500 mr-3 mt-1">info</span>
              <div>
                <p className="text-sm text-blue-700">
                  Este módulo de monitoreo es para uso exclusivo del personal autorizado y registrado de Hapag-Lloyd.
                </p>
              </div>
            </div>
          </div>

          {/* Nota específica para el equipo sobre instancias de empleado */}
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4">
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-amber-600">warning</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">Nota para el equipo de desarrollo</p>
                <p className="mt-1 text-xs text-amber-800">
                  Recuerden subir / registrar en la base de datos las instancias de <strong>Empleado</strong> que
                  tengan definidas para las pruebas de autenticación y perfil de operador.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
