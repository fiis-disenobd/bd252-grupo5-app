"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MapHeader } from "@/components/monitoreo/MapHeader";

export default function PerfilPage() {
  const { usuario, isAuthenticated, loading, reloadUser } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
  });
  const [passwordData, setPasswordData] = useState({
    contrasenaActual: "",
    contrasenaNueva: "",
    confirmarContrasena: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.empleado.nombre,
        apellido: usuario.empleado.apellido,
        direccion: "", // Puedes obtener esto de la BD si está disponible
      });
    }
  }, [usuario]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const data = await response.json();
      alert(data.message);
      
      // Recargar usuario desde el backend
      await reloadUser();
      
      setEditMode(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.contrasenaNueva.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contrasenaActual: passwordData.contrasenaActual,
          contrasenaNueva: passwordData.contrasenaNueva,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al cambiar la contraseña");
      }

      const data = await response.json();
      alert(data.message);
      setShowPasswordModal(false);
      setPasswordData({
        contrasenaActual: "",
        contrasenaNueva: "",
        confirmarContrasena: "",
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <MapHeader />

      <main className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Mi Perfil</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Administra tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Tarjeta Principal */}
        <div className="mb-6 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          {/* Header con Avatar */}
          <div className="bg-gradient-to-r from-primary to-orange-600 p-8">
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-600 text-4xl font-bold text-white shadow-lg">
                {usuario.empleado.nombre.charAt(0)}
                {usuario.empleado.apellido.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">
                  {usuario.empleado.nombre} {usuario.empleado.apellido}
                </h2>
                <p className="text-lg text-white/90">Operador de Monitoreo</p>
                <p className="mt-1 text-sm text-white/80">Código: {usuario.empleado.codigo}</p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/30"
              >
                {editMode ? "Cancelar" : "Editar Perfil"}
              </button>
            </div>
          </div>

          {/* Información Personal */}
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Nombre
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                  />
                ) : (
                  <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900 dark:bg-zinc-700 dark:text-white">
                    {usuario.empleado.nombre}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Apellido
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                  />
                ) : (
                  <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900 dark:bg-zinc-700 dark:text-white">
                    {usuario.empleado.apellido}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Código de Empleado
                </label>
                <p className="rounded-lg bg-zinc-50 p-3 font-mono text-sm text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  {usuario.empleado.codigo}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Correo Electrónico
                </label>
                <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900 dark:bg-zinc-700 dark:text-white">
                  {usuario.correo_electronico}
                </p>
              </div>
            </div>

            {editMode && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400/90"
                >
                  Guardar Cambios
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Información de Operador */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Información de Operador
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Turno Asignado
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">schedule</span>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  {usuario.operador.turno ?? "Sin turno asignado"}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Zona de Monitoreo
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">location_on</span>
                <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                  {usuario.operador.zona_monitoreo ?? "Sin zona asignada"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Seguridad de la Cuenta
          </h3>
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-zinc-600 dark:text-zinc-400">lock</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Contraseña</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Última actualización: Nunca</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </main>

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-800">
            <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">
              Cambiar Contraseña
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.contrasenaActual}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, contrasenaActual: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.contrasenaNueva}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, contrasenaNueva: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmarContrasena}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmarContrasena: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
