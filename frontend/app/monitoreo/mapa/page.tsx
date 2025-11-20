"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import "@/app/leaflet.css";

interface Asset {
  id: string;
  code: string;
  type: 'container' | 'vehicle' | 'ship';
  position: [number, number];
  status: string;
  statusColor: string;
  icon: string;
  lastUpdate: string;
  speed: string;
  temp: string;
}

// Importar MapComponent dinámicamente para evitar SSR
const MapComponent = dynamic(() => import("@/components/monitoreo/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <span className="material-symbols-outlined mb-4 text-6xl text-gray-400 animate-pulse">map</span>
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ type: 'all', status: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde el backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/monitoreo/gps/posiciones');
        if (response.ok) {
          const data = await response.json();
          setAssets(Array.isArray(data) ? data : []);
        } else {
          console.error('Error al cargar posiciones GPS');
          setAssets([]);
        }
      } catch (error) {
        console.error('Error:', error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchAssets, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filtrar activos
  const filteredAssets = assets.filter((asset) => {
    // Filtro por tipo
    if (currentFilter.type !== 'all' && asset.type !== currentFilter.type) {
      return false;
    }
    
    // Filtro por estado
    if (currentFilter.status !== 'all' && asset.status !== currentFilter.status) {
      return false;
    }
    
    // Filtro por búsqueda
    if (searchTerm && !asset.code.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Estadísticas
  const stats = {
    total: assets.length,
    containers: assets.filter(a => a.type === 'container').length,
    vehicles: assets.filter(a => a.type === 'vehicle').length,
    ships: assets.filter(a => a.type === 'ship').length,
  };

  const handleAssetClick = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setSidebarOpen(true);
  }, []);

  // Opciones de estados por tipo de activo para el filtro
  const getEstadoOptions = () => {
    const base = [{ value: 'all', label: 'Todos' }];

    const estadosContenedor = [
      { value: 'Disponible', label: 'Disponible' },
      { value: 'En Transito', label: 'En Transito' },
      { value: 'En Puerto', label: 'En Puerto' },
      { value: 'En Reparacion', label: 'En Reparacion' },
      { value: 'Fuera de Servicio', label: 'Fuera de Servicio' },
    ];

    const estadosVehiculo = [
      { value: 'Disponible', label: 'Disponible' },
      { value: 'En Ruta', label: 'En Ruta' },
      { value: 'En Mantenimiento', label: 'En Mantenimiento' },
      { value: 'En Revision', label: 'En Revision' },
      { value: 'Fuera de Servicio', label: 'Fuera de Servicio' },
    ];

    const estadosBuque = [
      { value: 'Disponible', label: 'Disponible' },
      { value: 'Operativo', label: 'Operativo' },
      { value: 'En Mantenimiento', label: 'En Mantenimiento' },
      { value: 'En Reparacion', label: 'En Reparacion' },
      { value: 'Fuera de Servicio', label: 'Fuera de Servicio' },
    ];

    if (currentFilter.type === 'container') {
      return [...base, ...estadosContenedor];
    }

    if (currentFilter.type === 'vehicle') {
      return [...base, ...estadosVehiculo];
    }

    if (currentFilter.type === 'ship') {
      return [...base, ...estadosBuque];
    }

    // Tipo "Todos": combinar sin duplicados
    const all = [...estadosContenedor, ...estadosVehiculo, ...estadosBuque];
    const seen = new Set<string>();
    const unique = all.filter((e) => {
      if (seen.has(e.value)) return false;
      seen.add(e.value);
      return true;
    });

    return [...base, ...unique];
  };

  // Función para obtener clases Tailwind según estado (contenedor, vehículo o buque)
  const getEstadoColorClasses = (status: string) => {
    const key = (status || '').toLowerCase();

    const colors: Record<string, { bg: string; text: string; border: string }> = {
      // Contenedores - EstadoContenedor
      'disponible':        { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      'en transito':       { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
      'en puerto':         { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200' },
      'en reparacion':     { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
      'fuera de servicio': { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },

      // Vehículos - EstadoVehiculo
      'en ruta':           { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200' },
      'en mantenimiento':  { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
      'en revision':       { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200' },

      // Buques - EstadoEmbarcacion
      'operativo':         { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    };

    return colors[key] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {/* Header Simplificado para Mapa */}
      <MapHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Dropdown */}
        <aside 
          className={`absolute left-0 top-[64px] bottom-0 z-[999] w-80 transform bg-white shadow-2xl transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="border-b border-zinc-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-zinc-900">Monitoreo GPS</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {/* Estadísticas Rápidas */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-zinc-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                    <div>
                      <p className="text-xs text-zinc-500">Contenedores</p>
                      <p className="text-lg font-bold text-zinc-900">{stats.containers}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    <div>
                      <p className="text-xs text-zinc-500">Vehículos</p>
                      <p className="text-lg font-bold text-zinc-900">{stats.vehicles}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">sailing</span>
                    <div>
                      <p className="text-xs text-zinc-500">Buques</p>
                      <p className="text-lg font-bold text-zinc-900">{stats.ships}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="text-xs text-zinc-500">Total</p>
                      <p className="text-lg font-bold text-zinc-900">{stats.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Búsqueda y Filtros */}
            <div className="border-b border-zinc-200 p-4">
              {/* Búsqueda */}
              <div className="relative mb-3">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
                <input
                  type="text"
                  placeholder="Buscar por código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Filtro por Tipo */}
              <div className="mb-3">
                <label className="mb-2 block text-xs font-semibold text-zinc-700">Tipo de Activo</label>
                <select
                  value={currentFilter.type}
                  onChange={(e) => setCurrentFilter({ ...currentFilter, type: e.target.value })}
                  className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">Todos</option>
                  <option value="container">Contenedores</option>
                  <option value="vehicle">Vehículos</option>
                  <option value="ship">Buques</option>
                </select>
              </div>

              {/* Filtro por Estado */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-700">Estado</label>
                <select
                  value={currentFilter.status}
                  onChange={(e) => setCurrentFilter({ ...currentFilter, status: e.target.value })}
                  className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {getEstadoOptions().map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de Activos */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-400 hover:scrollbar-thumb-zinc-500">
              <div className="mb-3 flex items-center justify-between sticky top-0 bg-white pb-2 border-b border-zinc-200 z-10">
                <p className="text-xs font-semibold text-zinc-700">
                  {filteredAssets.length} {filteredAssets.length === 1 ? 'Activo encontrado' : 'Activos encontrados'}
                </p>
                {filteredAssets.length > 0 && (
                  <span className="text-xs text-zinc-500">
                    Scroll para ver más
                  </span>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="material-symbols-outlined mb-2 text-4xl text-zinc-300">search_off</span>
                  <p className="text-sm text-zinc-500">No se encontraron activos</p>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleAssetClick(asset)}
                      className={`w-full rounded-lg border p-3.5 text-left transition-all hover:shadow-md ${
                        selectedAsset?.id === asset.id
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-zinc-200 bg-white hover:border-primary/30 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${asset.statusColor}20` }}
                        >
                          <span className="material-symbols-outlined text-2xl" style={{ color: asset.statusColor }}>
                            {asset.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-bold text-zinc-900">{asset.code}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {(() => {
                              const estadoColors = getEstadoColorClasses(asset.status);
                              return (
                                <span className={`inline-flex items-center gap-1 rounded-full ${estadoColors.bg} ${estadoColors.border} border px-2 py-0.5`}>
                                  <div 
                                    className="h-1.5 w-1.5 rounded-full animate-pulse" 
                                    style={{ backgroundColor: asset.statusColor }}
                                  ></div>
                                  <span className={`text-xs font-semibold ${estadoColors.text}`}>{asset.status}</span>
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                        {selectedAsset?.id === asset.id && (
                          <span className="material-symbols-outlined text-primary">check_circle</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Links de navegación */}
            <div className="border-t border-zinc-200 p-4">
              <Link
                href="/monitoreo"
                className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Map Area */}
        <main className="relative flex-1">
          {/* Botón para abrir sidebar */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-4 top-4 z-[998] flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-lg transition-all hover:bg-zinc-50"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
              <span>Mostrar Panel</span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                {filteredAssets.length}
              </span>
            </button>
          )}

          <MapComponent 
            assets={filteredAssets}
            selectedAsset={selectedAsset}
            onAssetSelect={setSelectedAsset}
            onMapReady={setMapInstance}
          />
        </main>
      </div>
    </div>
  );
}
