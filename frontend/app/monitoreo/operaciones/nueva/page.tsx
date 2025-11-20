"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface FormData {
  codigo: string;
  fecha_inicio: string;
  id_estado_operacion: string;
  operador_id: string;
  medio_transporte: "vehiculo" | "buque";
  vehiculo_id: string;
  buque_id: string;
  contenedores: string[];
  descripcion: string;
}

export default function NuevaOperacionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [estados, setEstados] = useState<any[]>([]);
  const [operadores, setOperadores] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [buques, setBuques] = useState<any[]>([]);
  const [nuevoContenedor, setNuevoContenedor] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    codigo: `OP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    fecha_inicio: new Date().toISOString().slice(0, 16),
    id_estado_operacion: "",
    operador_id: "",
    medio_transporte: "vehiculo",
    vehiculo_id: "",
    buque_id: "",
    contenedores: [],
    descripcion: "",
  });

  useEffect(() => {
    // Cargar datos iniciales
    const cargarDatos = async () => {
      try {
        // Estados
        const resEstados = await fetch("http://localhost:3001/monitoreo/estados");
        if (resEstados.ok) {
          const dataEstados = await resEstados.json();
          setEstados(Array.isArray(dataEstados) ? dataEstados : []);
          // Seleccionar "Programada" por defecto si existe
          const programada = dataEstados.find((e: any) => e.nombre === "Programada");
          if (programada) {
            setFormData(prev => ({ ...prev, id_estado_operacion: programada.id_estado_operacion }));
          }
        }

        // Operadores
        const resOperadores = await fetch("http://localhost:3001/monitoreo/operadores");
        if (resOperadores.ok) {
          const dataOperadores = await resOperadores.json();
          setOperadores(Array.isArray(dataOperadores) ? dataOperadores : []);
        }

        // Vehículos
        const resVehiculos = await fetch("http://localhost:3001/monitoreo/vehiculos");
        if (resVehiculos.ok) {
          const dataVehiculos = await resVehiculos.json();
          setVehiculos(Array.isArray(dataVehiculos) ? dataVehiculos : []);
        }

        // Buques
        const resBuques = await fetch("http://localhost:3001/monitoreo/buques");
        if (resBuques.ok) {
          const dataBuques = await resBuques.json();
          setBuques(Array.isArray(dataBuques) ? dataBuques : []);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const handleAddContenedor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && nuevoContenedor.trim()) {
      e.preventDefault();
      if (!formData.contenedores.includes(nuevoContenedor.trim())) {
        setFormData({
          ...formData,
          contenedores: [...formData.contenedores, nuevoContenedor.trim()],
        });
      }
      setNuevoContenedor("");
    }
  };

  const handleRemoveContenedor = (codigo: string) => {
    setFormData({
      ...formData,
      contenedores: formData.contenedores.filter((c) => c !== codigo),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = {
        codigo: formData.codigo,
        fecha_inicio: formData.fecha_inicio,
        id_estado_operacion: formData.id_estado_operacion,
        operador_id: formData.operador_id,
        contenedores: formData.contenedores,
        descripcion: formData.descripcion || null,
      };

      if (formData.medio_transporte === "vehiculo" && formData.vehiculo_id) {
        payload.vehiculo_id = formData.vehiculo_id;
      } else if (formData.medio_transporte === "buque" && formData.buque_id) {
        payload.buque_id = formData.buque_id;
      }

      const response = await fetch("http://localhost:3001/monitoreo/operaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const operacionCreada = await response.json();
        router.push(`/monitoreo/operaciones/${operacionCreada.id_operacion}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "No se pudo crear la operación"}`);
      }
    } catch (error) {
      console.error("Error al crear operación:", error);
      alert("Error al crear la operación");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
          {/* Header */}
          <div className="mb-6 mx-auto max-w-5xl">
            <Link
              href="/monitoreo/operaciones"
              className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Operaciones
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900">Crear Nueva Operación</h1>
            <p className="mt-1 text-sm text-zinc-500">Completa el formulario para crear una nueva operación de monitoreo</p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Columna Principal (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Información General */}
                <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="border-b border-zinc-200 p-6">
                    <h2 className="text-lg font-bold text-zinc-900">Información General</h2>
                  </div>
                  <div className="space-y-6 p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Código */}
                      <div>
                        <label htmlFor="codigo" className="mb-2 block text-sm font-semibold text-zinc-900">
                          Código de Operación
                        </label>
                        <input
                          type="text"
                          id="codigo"
                          disabled
                          value={formData.codigo}
                          className="h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-500"
                        />
                        <p className="mt-1 text-xs text-zinc-500">Generado automáticamente</p>
                      </div>

                      {/* Fecha de Inicio */}
                      <div>
                        <label htmlFor="fecha_inicio" className="mb-2 block text-sm font-semibold text-zinc-900">
                          Fecha de Inicio <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          id="fecha_inicio"
                          required
                          value={formData.fecha_inicio}
                          onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                          className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <label htmlFor="estado" className="mb-2 block text-sm font-semibold text-zinc-900">
                        Estado Inicial <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="estado"
                        required
                        value={formData.id_estado_operacion}
                        onChange={(e) => setFormData({ ...formData, id_estado_operacion: e.target.value })}
                        className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Selecciona un estado</option>
                        {estados.map((estado) => (
                          <option key={estado.id_estado_operacion} value={estado.id_estado_operacion}>
                            {estado.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Descripción */}
                    <div>
                      <label htmlFor="descripcion" className="mb-2 block text-sm font-semibold text-zinc-900">
                        Descripción
                      </label>
                      <textarea
                        id="descripcion"
                        rows={4}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Detalles adicionales de la operación..."
                      />
                    </div>
                  </div>
                </div>

                {/* Transporte */}
                <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="border-b border-zinc-200 p-6">
                    <h2 className="text-lg font-bold text-zinc-900">Medio de Transporte</h2>
                  </div>
                  <div className="space-y-6 p-6">
                    {/* Tipo de Transporte */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-zinc-900">Tipo de Transporte</label>
                      <div className="flex gap-4">
                        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 border-zinc-300 p-4 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <input
                            type="radio"
                            name="medio_transporte"
                            value="vehiculo"
                            checked={formData.medio_transporte === "vehiculo"}
                            onChange={(e) => setFormData({ ...formData, medio_transporte: e.target.value as "vehiculo" | "buque", vehiculo_id: "", buque_id: "" })}
                            className="h-4 w-4 border-zinc-300 text-primary focus:ring-primary"
                          />
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl">local_shipping</span>
                            <span className="text-sm font-semibold">Vehículo</span>
                          </div>
                        </label>
                        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 border-zinc-300 p-4 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <input
                            type="radio"
                            name="medio_transporte"
                            value="buque"
                            checked={formData.medio_transporte === "buque"}
                            onChange={(e) => setFormData({ ...formData, medio_transporte: e.target.value as "vehiculo" | "buque", vehiculo_id: "", buque_id: "" })}
                            className="h-4 w-4 border-zinc-300 text-primary focus:ring-primary"
                          />
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl">sailing</span>
                            <span className="text-sm font-semibold">Buque</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Selector */}
                    {formData.medio_transporte === "vehiculo" ? (
                      <div>
                        <label htmlFor="vehiculo" className="mb-2 block text-sm font-semibold text-zinc-900">
                          Seleccionar Vehículo
                        </label>
                        <select
                          id="vehiculo"
                          value={formData.vehiculo_id}
                          onChange={(e) => setFormData({ ...formData, vehiculo_id: e.target.value })}
                          className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Selecciona un vehículo</option>
                          {vehiculos.map((vehiculo) => (
                            <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                              {vehiculo.placa} - {vehiculo.modelo || "Vehículo"}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="buque" className="mb-2 block text-sm font-semibold text-zinc-900">
                          Seleccionar Buque
                        </label>
                        <select
                          id="buque"
                          value={formData.buque_id}
                          onChange={(e) => setFormData({ ...formData, buque_id: e.target.value })}
                          className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Selecciona un buque</option>
                          {buques.map((buque) => (
                            <option key={buque.id_buque} value={buque.id_buque}>
                              {buque.nombre} - {buque.matricula}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenedores */}
                <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="border-b border-zinc-200 p-6">
                    <h2 className="text-lg font-bold text-zinc-900">Contenedores</h2>
                    <p className="text-sm text-zinc-500">Agrega los códigos de contenedores (presiona Enter)</p>
                  </div>
                  <div className="p-6">
                    <div className="relative w-full rounded-lg border-2 border-zinc-300 bg-white p-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <div className="flex flex-wrap items-center gap-2">
                        {formData.contenedores.map((codigo) => (
                          <span
                            key={codigo}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                          >
                            <span className="material-symbols-outlined text-sm">inventory_2</span>
                            {codigo}
                            <button
                              type="button"
                              onClick={() => handleRemoveContenedor(codigo)}
                              className="text-primary/70 hover:text-primary"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder={formData.contenedores.length === 0 ? "Escribe código y presiona Enter..." : "Agregar más..."}
                          value={nuevoContenedor}
                          onChange={(e) => setNuevoContenedor(e.target.value)}
                          onKeyDown={handleAddContenedor}
                          className="min-w-[200px] flex-1 border-0 bg-transparent p-0 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Lateral (1/3) */}
              <div className="space-y-6">
                {/* Operador */}
                <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="border-b border-zinc-200 p-6">
                    <h2 className="text-lg font-bold text-zinc-900">Operador</h2>
                  </div>
                  <div className="p-6">
                    <label htmlFor="operador" className="mb-2 block text-sm font-semibold text-zinc-900">
                      Operador Responsable <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="operador"
                      required
                      value={formData.operador_id}
                      onChange={(e) => setFormData({ ...formData, operador_id: e.target.value })}
                      className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Selecciona un operador</option>
                      {operadores.map((operador) => (
                        <option key={operador.id_operador} value={operador.id_operador}>
                          {operador.empleado?.nombre || operador.turno || `Operador ${operador.id_operador.substring(0, 8)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resumen */}
                <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold text-zinc-900">Resumen</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600">Contenedores</span>
                      <span className="font-semibold text-zinc-900">{formData.contenedores.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600">Transporte</span>
                      <span className="font-semibold text-zinc-900">
                        {formData.medio_transporte === "vehiculo" ? "Vehículo" : "Buque"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600">Estado</span>
                      <span className="font-semibold text-zinc-900">
                        {estados.find(e => e.id_estado_operacion === formData.id_estado_operacion)?.nombre || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Crear Operación
                      </>
                    )}
                  </button>
                  <Link
                    href="/monitoreo/operaciones"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </main>
    </div>
  );
}
