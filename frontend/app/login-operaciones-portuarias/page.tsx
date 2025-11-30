"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginOperacionesPortuariasPage() {
    const router = useRouter();
    const { setAuthData } = useAuth();

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/operaciones-portuarias/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correo_electronico: formData.correo,
                    contrasena: formData.contrasena,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al iniciar sesión");
            }

            const data = await response.json();

            // Actualizar el contexto de autenticación
            setAuthData(data.access_token, data.usuario);

            // Redirigir a operaciones portuarias
            router.push("/operaciones-portuarias");

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Panel Izquierdo - Branding Operaciones Portuarias */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white bg-gradient-to-br from-purple-600 to-purple-400">
                <div>
                    <div className="flex items-center space-x-4 mb-16">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                            <span className="material-symbols-outlined text-2xl">warehouse</span>
                        </div>
                        <div>
                            <p className="text-sm uppercase tracking-wide text-white/80">Hapag-Lloyd</p>
                            <p className="text-xs text-white/70">Operaciones Portuarias</p>
                        </div>
                    </div>

                    <h2 className="text-5xl font-bold leading-tight mb-6">
                        Gestión de Operaciones Portuarias
                    </h2>
                    <p className="text-lg opacity-90 max-w-xl">
                        Plataforma especializada para el control y supervisión de actividades portuarias y logística de contenedores.
                    </p>

                    <div className="mt-16 space-y-8 max-w-xl">
                        <div className="flex items-start space-x-4">
                            <span className="material-symbols-outlined text-3xl opacity-90 mt-1">inventory</span>
                            <div>
                                <h3 className="font-bold text-lg">Control de Contenedores</h3>
                                <p className="opacity-85 text-sm">
                                    Seguimiento detallado de contenedores en terminal y su estado actual.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <span className="material-symbols-outlined text-3xl opacity-90 mt-1">local_shipping</span>
                            <div>
                                <h3 className="font-bold text-lg">Gestión Logística</h3>
                                <p className="opacity-85 text-sm">
                                    Coordinación de movimientos y asignación de recursos portuarios.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <span className="material-symbols-outlined text-3xl opacity-90 mt-1">assignment</span>
                            <div>
                                <h3 className="font-bold text-lg">Monitoreo de Actividades</h3>
                                <p className="opacity-85 text-sm">
                                    Registro y seguimiento de todas las operaciones portuarias en tiempo real.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm opacity-80">
                    <p>© 2025 Hapag-Lloyd. Operaciones Portuarias.</p>
                </div>
            </div>

            {/* Panel Derecho - Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Header derecho */}
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2>
                        <p className="text-gray-600 mt-2">
                            Ingresa tus credenciales para acceder al módulo de Operaciones Portuarias.
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
                                    placeholder="usuario@hapag-lloyd.com"
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
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
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
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

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
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

                    {/* Nota informativa */}
                    <div className="mt-8">
                        <div className="flex items-start p-4 rounded-md bg-purple-50 border border-purple-200">
                            <span className="material-symbols-outlined text-purple-500 mr-3 mt-1">info</span>
                            <div>
                                <p className="text-sm text-purple-700">
                                    Acceso restringido. Los roles de Agente de Reservas, Cliente y Operador Marítimo no tienen acceso a este módulo.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nota para desarrollo */}
                    <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4">
                        <div className="flex gap-2">
                            <span className="material-symbols-outlined text-amber-600">warning</span>
                            <div>
                                <p className="text-sm font-semibold text-amber-900">Nota para el equipo de desarrollo</p>
                                <p className="mt-1 text-xs text-amber-800">
                                    Recuerden configurar el endpoint de autenticación en el backend y registrar usuarios de prueba con los roles apropiados (Trabajador Portuario, Supervisor Portuario).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}