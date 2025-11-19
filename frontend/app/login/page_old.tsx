"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface Modulo {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [paso, setPaso] = useState(1); // 1: email, 2: módulo, 3: contraseña
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    modulo: "",
  });
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Verificar si el correo existe y obtener módulos disponibles
      const response = await fetch(
        `http://localhost:3001/auth/modulos?correo=${encodeURIComponent(formData.correo)}`
      );

      if (!response.ok) {
        throw new Error("Correo no encontrado");
      }

      const modulosDisponibles = await response.json();

      if (modulosDisponibles.length === 0) {
        throw new Error("No tienes acceso a ningún módulo");
      }

      setModulos(modulosDisponibles);
      setPaso(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModuloSelect = (moduloId: string) => {
    setFormData({ ...formData, modulo: moduloId });
    setPaso(3);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.correo, formData.contrasena, formData.modulo);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPaso(1);
    setFormData({ correo: "", contrasena: "", modulo: "" });
    setModulos([]);
    setError("");
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
              <p className="text-sm text-white/80">Sistema Integrado de Gestión</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Control total de tus operaciones logísticas
          </h2>
          <p className="text-lg text-white/90">
            Accede a nuestros módulos de monitoreo GPS, operaciones terrestres y marítimas desde un
            solo lugar.
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
                <span className="material-symbols-outlined text-white">local_shipping</span>
              </div>
              <div>
                <p className="font-semibold text-white">Gestión de Operaciones</p>
                <p className="text-sm text-white/80">Terrestres y marítimas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <span className="material-symbols-outlined text-white">analytics</span>
              </div>
              <div>
                <p className="font-semibold text-white">Reportes y Análisis</p>
                <p className="text-sm text-white/80">Información en tiempo real</p>
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
            <h1 className="text-2xl font-bold text-zinc-900">Hapag-Lloyd</h1>
          </div>

          {/* Paso 1: Correo Electrónico */}
          {paso === 1 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold text-zinc-900">Iniciar Sesión</h2>
              <p className="mb-8 text-zinc-600">Ingresa tu correo electrónico para continuar</p>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    required
                    placeholder="tucorreo@hapag-lloyd.com"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verificando..." : "Continuar"}
                </button>
              </form>
            </div>
          )}

          {/* Paso 2: Selección de Módulo */}
          {paso === 2 && (
            <div>
              <button onClick={resetForm} className="mb-6 flex items-center gap-2 text-zinc-600 hover:text-zinc-900">
                <span className="material-symbols-outlined">arrow_back</span>
                Volver
              </button>

              <h2 className="mb-2 text-3xl font-bold text-zinc-900">Selecciona un Módulo</h2>
              <p className="mb-8 text-zinc-600">
                Tienes acceso a {modulos.length} módulo{modulos.length > 1 ? "s" : ""}
              </p>

              <div className="space-y-4">
                {modulos.map((modulo) => (
                  <button
                    key={modulo.id}
                    onClick={() => handleModuloSelect(modulo.id)}
                    className="group w-full rounded-xl border-2 border-zinc-200 p-6 text-left transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <span className="material-symbols-outlined text-3xl text-primary">
                          {modulo.icono}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-zinc-900">{modulo.nombre}</h3>
                        <p className="text-sm text-zinc-600">{modulo.descripcion}</p>
                      </div>
                      <span className="material-symbols-outlined text-2xl text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                        arrow_forward
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Contraseña */}
          {paso === 3 && (
            <div>
              <button onClick={() => setPaso(2)} className="mb-6 flex items-center gap-2 text-zinc-600 hover:text-zinc-900">
                <span className="material-symbols-outlined">arrow_back</span>
                Volver
              </button>

              <h2 className="mb-2 text-3xl font-bold text-zinc-900">Ingresa tu Contraseña</h2>
              <p className="mb-8 text-zinc-600">
                Módulo: <span className="font-semibold">{modulos.find((m) => m.id === formData.modulo)?.nombre}</span>
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
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
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
