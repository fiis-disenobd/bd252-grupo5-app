"use client";

import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "leaflet/dist/leaflet.css";

type Puerto = {
  id_puerto: string;
  nombre: string;
  pais: string;
};

type Muelle = {
  id_muelle: string;
  codigo: string;
  id_puerto: string;
};

type RutaMapaPuerto = {
  tipo: "origen" | "intermedio" | "destino";
  nombre: string;
  direccion: string;
};

type RutaMapaDetalle = {
  id: string;
  codigo: string;
  puertos: RutaMapaPuerto[];
};

function SeleccionRutasMaritimasContent() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [puertos, setPuertos] = useState<Puerto[]>([]);
  const [originCountry, setOriginCountry] = useState<string>("");
  const [destinationCountry, setDestinationCountry] = useState<string>("");
  const [originPortId, setOriginPortId] = useState<string>("");
  const [destinationPortId, setDestinationPortId] = useState<string>("");
  const [portsError, setPortsError] = useState<string | null>(null);
  const [originDocks, setOriginDocks] = useState<Muelle[]>([]);
  const [destinationDocks, setDestinationDocks] = useState<Muelle[]>([]);
  const [originDockId, setOriginDockId] = useState<string>("");
  const [destinationDockId, setDestinationDockId] = useState<string>("");
  const [rutaMapa, setRutaMapa] = useState<RutaMapaDetalle | null>(null);
  const [geoPoints, setGeoPoints] = useState<
    { tipo: "origen" | "intermedio" | "destino"; nombre: string; lat: number; lng: number; direccion: string }[]
  >([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRouteIdFromQuery = searchParams.get("routeId");
  const originPortIdFromQuery = searchParams.get("originId");
  const destinationPortIdFromQuery = searchParams.get("destinationId");
  const originNameFromQuery = searchParams.get("originName") || "";
  const destinationNameFromQuery = searchParams.get("destinationName") || "";
  const distanceFromQuery = searchParams.get("distance") || "";
  const durationFromQuery = searchParams.get("duration") || "";
  const idBuque = searchParams.get("id_buque");
  const contenedores = searchParams.get("contenedores");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any | null>(null);

  useEffect(() => {
    const loadPuertos = async () => {
      try {
        const response = await fetch("http://localhost:3001/monitoreo/puertos");
        const data = await response.json();
        if (Array.isArray(data)) {
          setPuertos(data as Puerto[]);
        } else {
          setPuertos([]);
        }
      } catch (error) {
        console.error("Error al cargar puertos:", error);
        setPuertos([]);
      }
    };

    loadPuertos();
  }, []);

  useEffect(() => {
    if (!puertos.length) return;

    if (originPortIdFromQuery) {
      const originPort = puertos.find(
        (p) => p.id_puerto === originPortIdFromQuery
      );
      if (originPort) {
        setOriginCountry(originPort.pais);
        setOriginPortId(originPort.id_puerto);
      }
    }

    if (destinationPortIdFromQuery) {
      const destinationPort = puertos.find(
        (p) => p.id_puerto === destinationPortIdFromQuery
      );
      if (destinationPort) {
        setDestinationCountry(destinationPort.pais);
        setDestinationPortId(destinationPort.id_puerto);
      }
    }
  }, [puertos, originPortIdFromQuery, destinationPortIdFromQuery]);

  useEffect(() => {
    const loadRutaMapa = async () => {
      if (!selectedRouteIdFromQuery) {
        setRutaMapa(null);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/monitoreo/rutas-maritimas/${selectedRouteIdFromQuery}`
        );
        if (!response.ok) {
          setRutaMapa(null);
          return;
        }
        const data = (await response.json()) as RutaMapaDetalle | null;
        setRutaMapa(data);
      } catch (error) {
        console.error("Error al cargar ruta para el mapa:", error);
        setRutaMapa(null);
      }
    };

    loadRutaMapa();
  }, [selectedRouteIdFromQuery]);

  useEffect(() => {
    const geocodePuertos = async () => {
      if (!rutaMapa || rutaMapa.puertos.length === 0) {
        setGeoPoints([]);
        return;
      }

      try {
        const results: {
          tipo: "origen" | "intermedio" | "destino";
          nombre: string;
          direccion: string;
          lat: number;
          lng: number;
        }[] = [];

        for (const punto of rutaMapa.puertos) {
          const query = encodeURIComponent(punto.direccion || punto.nombre);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
            {
              headers: {
                "Accept-Language": "es",
              },
            }
          );
          const data = (await response.json()) as
            | { lat: string; lon: string }[]
            | [];

          if (Array.isArray(data) && data.length > 0) {
            const first = data[0];
            const lat = parseFloat(first.lat);
            const lng = parseFloat(first.lon);
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
              results.push({
                tipo: punto.tipo,
                nombre: punto.nombre,
                direccion: punto.direccion,
                lat,
                lng,
              });
            }
          }
        }

        setGeoPoints(results);
      } catch (error) {
        console.error("Error al geocodificar direcciones de puertos:", error);
        setGeoPoints([]);
      }
    };

    geocodePuertos();
  }, [rutaMapa]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      if (typeof window === "undefined") return;
      const leaflet = await import("leaflet");
      const L = leaflet.default ?? leaflet;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [0, 0],
        zoom: 2,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [geoPoints.length]);

  useEffect(() => {
    if (!mapRef.current) return;

    let isCancelled = false;

    const updateMap = async () => {
      if (typeof window === "undefined") return;
      const leaflet = await import("leaflet");
      const L = leaflet.default ?? leaflet;

      if (isCancelled || !mapRef.current) return;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      if (geoPoints.length === 0) return;

      const bounds = L.latLngBounds([]);
      const baseLatLngs: [number, number][] = [];

      geoPoints.forEach((punto) => {
        const marker = L.marker([punto.lat, punto.lng]);

        marker.bindPopup(
          `<div style="font-size: 11px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${punto.nombre}</div>
            <div style="margin-bottom: 4px; text-transform: capitalize;">Tipo: ${punto.tipo}</div>
            <div style="word-break: break-word;">${punto.direccion}</div>
          </div>`
        );

        marker.addTo(mapRef.current!);
        markersRef.current.push(marker);
        bounds.extend([punto.lat, punto.lng]);
        baseLatLngs.push([punto.lat, punto.lng]);
      });

      const detailedLatLngs: [number, number][] = [];
      const segments = 32;

      for (let i = 0; i < baseLatLngs.length - 1; i++) {
        const [lat1, lng1] = baseLatLngs[i];
        const [lat2, lng2] = baseLatLngs[i + 1];

        const midLat = (lat1 + lat2) / 2;
        const midLng = (lng1 + lng2) / 2;

        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;

        const perpLat = -dLng;
        const perpLng = dLat;

        const scale = 0.2;
        const controlLat = midLat + perpLat * scale * 0.01;
        const controlLng = midLng + perpLng * scale * 0.01;

        for (let step = 0; step <= segments; step++) {
          const t = step / segments;
          const oneMinusT = 1 - t;

          const lat =
            oneMinusT * oneMinusT * lat1 +
            2 * oneMinusT * t * controlLat +
            t * t * lat2;

          const lng =
            oneMinusT * oneMinusT * lng1 +
            2 * oneMinusT * t * controlLng +
            t * t * lng2;

          detailedLatLngs.push([lat, lng]);
        }
      }

      if (detailedLatLngs.length >= 2) {
        const polyline = L.polyline(detailedLatLngs, {
          color: "#ff0000",
          weight: 3,
          opacity: 0.9,
        });
        polyline.addTo(mapRef.current!);
        polylineRef.current = polyline;
      }

      if (geoPoints.length === 1) {
        mapRef.current.setView([geoPoints[0].lat, geoPoints[0].lng], 6);
      } else {
        mapRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    updateMap();

    return () => {
      isCancelled = true;
    };
  }, [geoPoints]);

  const mapCenter = useMemo(() => {
    if (geoPoints.length > 0) {
      return [geoPoints[0].lat, geoPoints[0].lng] as [number, number];
    }
    // Centro genérico (Atlántico) mientras no haya puntos
    return [0, 0] as [number, number];
  }, [geoPoints]);

  const handleOriginChange = (value: string) => {
    setOriginPortId(value);
    setOriginDockId("");
    setOriginDocks([]);
    if (value && value === destinationPortId) {
      setPortsError("El Puerto de Origen y el Puerto de Destino no pueden ser el mismo.");
    } else {
      setPortsError(null);
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestinationPortId(value);
    setDestinationDockId("");
    setDestinationDocks([]);
    if (value && value === originPortId) {
      setPortsError("El Puerto de Origen y el Puerto de Destino no pueden ser el mismo.");
    } else {
      setPortsError(null);
    }
  };

  useEffect(() => {
    const loadOriginDocks = async () => {
      if (!originPortId) {
        setOriginDocks([]);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3001/monitoreo/muelles?puertoId=${originPortId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setOriginDocks(data as Muelle[]);
        } else {
          setOriginDocks([]);
        }
      } catch (error) {
        console.error("Error al cargar muelles de origen:", error);
        setOriginDocks([]);
      }
    };

    loadOriginDocks();
  }, [originPortId]);

  useEffect(() => {
    const loadDestinationDocks = async () => {
      if (!destinationPortId) {
        setDestinationDocks([]);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3001/monitoreo/muelles?puertoId=${destinationPortId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setDestinationDocks(data as Muelle[]);
        } else {
          setDestinationDocks([]);
        }
      } catch (error) {
        console.error("Error al cargar muelles de destino:", error);
        setDestinationDocks([]);
      }
    };

    loadDestinationDocks();
  }, [destinationPortId]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-[#0f1923] dark:text-gray-100">
      <Header />
      <main className="flex flex-col flex-1 gap-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
              Selección de Rutas Marítimas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Operaciones / Planificación / Selección de Rutas Marítimas
            </p>
          </div>
        </div>

        <div className="flex flex-1 gap-6">
          <aside className="flex flex-col w-96 bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="flex-grow">
              <h3 className="text-gray-800 dark:text-gray-100 text-lg font-bold mb-4">
                Criterios de Búsqueda
              </h3>
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="origin-country"
                  >
                    País de Origen
                  </label>
                  <select
                    className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                    id="origin-country"
                    value={originCountry}
                    onChange={(e) => {
                      const value = e.target.value;
                      setOriginCountry(value);
                      // Reset puerto y muelle de origen al cambiar de país
                      setOriginPortId("");
                      setOriginDockId("");
                      setOriginDocks([]);
                    }}
                  >
                    <option value="">Seleccionar país de origen</option>
                    {[...new Set(puertos.map((p) => p.pais))].map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="origin-port"
                  >
                    Puerto de Origen
                  </label>
                  <select
                    className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                    id="origin-port"
                    value={originPortId}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    disabled={!originCountry}
                  >
                    <option value="">Seleccionar puerto</option>
                    {puertos
                      .filter((puerto) =>
                        originCountry ? puerto.pais === originCountry : true
                      )
                      .map((puerto) => (
                        <option key={puerto.id_puerto} value={puerto.id_puerto}>
                          {puerto.nombre}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="destination-country"
                  >
                    País de Destino
                  </label>
                  <select
                    className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                    id="destination-country"
                    value={destinationCountry}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDestinationCountry(value);
                      // Reset puerto y muelle de destino al cambiar de país
                      setDestinationPortId("");
                      setDestinationDockId("");
                      setDestinationDocks([]);
                    }}
                  >
                    <option value="">Seleccionar país de destino</option>
                    {[...new Set(puertos.map((p) => p.pais))].map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="destination-port"
                  >
                    Puerto de Destino
                  </label>
                  <select
                    className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                    id="destination-port"
                    value={destinationPortId}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    disabled={!destinationCountry}
                  >
                    <option value="">Seleccionar puerto</option>
                    {puertos
                      .filter((puerto) =>
                        destinationCountry ? puerto.pais === destinationCountry : true
                      )
                      .map((puerto) => (
                        <option key={puerto.id_puerto} value={puerto.id_puerto}>
                          {puerto.nombre}
                        </option>
                      ))}
                  </select>
                </div>
                {portsError && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {portsError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (!originPortId || !destinationPortId || portsError) {
                      return;
                    }
                    const originPort = puertos.find(
                      (p) => p.id_puerto === originPortId
                    );
                    const destinationPort = puertos.find(
                      (p) => p.id_puerto === destinationPortId
                    );

                    const originName = originPort?.nombre || "";
                    const destinationName = destinationPort?.nombre || "";

                    const params = new URLSearchParams();
                    params.set('originId', originPortId);
                    params.set('destinationId', destinationPortId);
                    params.set('originName', originName);
                    params.set('destinationName', destinationName);
                    if (idBuque) params.set('id_buque', idBuque);
                    if (contenedores) params.set('contenedores', contenedores);

                    router.push(
                      `/operaciones-maritimas/nueva/ruta/resultados?${params.toString()}`
                    );
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-md h-10 px-4 bg-[#F98C00] text-white text-sm font-bold hover:bg-orange-500 transition-colors mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!originPortId || !destinationPortId || !!portsError}
                >
                  <span className="material-symbols-outlined">search</span>
                  <span>Buscar rutas</span>
                </button>
              </div>

              <div className="mt-6 border-t border-gray-200 dark:border-slate-700 pt-4">
                <h4 className="text-gray-800 dark:text-gray-100 text-sm font-semibold mb-3">
                  Selección de muelles
                </h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      htmlFor="origin-dock"
                    >
                      Muelle de Origen
                    </label>
                    <select
                      className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                      id="origin-dock"
                      value={originDockId}
                      onChange={(e) => setOriginDockId(e.target.value)}
                      disabled={!originPortId || originDocks.length === 0}
                    >
                      <option value="">Seleccionar muelle de origen</option>
                      {originDocks.map((muelle) => (
                        <option key={muelle.id_muelle} value={muelle.id_muelle}>
                          {muelle.codigo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      htmlFor="destination-dock"
                    >
                      Muelle de Destino
                    </label>
                    <select
                      className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                      id="destination-dock"
                      value={destinationDockId}
                      onChange={(e) => setDestinationDockId(e.target.value)}
                      disabled={!destinationPortId || destinationDocks.length === 0}
                    >
                      <option value="">Seleccionar muelle de destino</option>
                      {destinationDocks.map((muelle) => (
                        <option key={muelle.id_muelle} value={muelle.id_muelle}>
                          {muelle.codigo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex-1 rounded-lg overflow-hidden relative shadow-lg">
              <div className="absolute inset-0">
                <div ref={mapContainerRef} className="w-full h-full" />
                {geoPoints.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200/80 dark:bg-slate-700/80">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Selecciona una ruta en la pantalla de resultados para visualizarla aquí.
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <div className="flex flex-col bg-white dark:bg-slate-800 rounded-md shadow-md">
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-md"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      add
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-md border-t border-gray-200 dark:border-slate-600"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      remove
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    navigation
                  </span>
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    layers
                  </span>
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    3d_rotation
                  </span>
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    fullscreen
                  </span>
                </button>
              </div>
              <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-800 bg-opacity-90 dark:bg-opacity-90 p-3 rounded-md shadow-md text-xs z-[1000]">
                <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Leyenda del mapa
                </h4>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-4 h-4 bg-[#002D62] rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
                  <span>Puerto Principal</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
                  <span>Puerto Secundario</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
                  <span>Puerto no disponible</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-4 h-1 bg-red-500"></div>
                  <span>Ruta activa</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2 z-[1100]">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#F98C00] rounded-md hover:bg-orange-500 shadow-lg"
                  onClick={() => {
                    if (!originDockId || !destinationDockId) {
                      if (typeof window !== "undefined") {
                        window.alert(
                          "Debes seleccionar los muelles de origen y destino antes de confirmar la ruta."
                        );
                      }
                      return;
                    }

                    const routeCode = rutaMapa?.codigo ?? "";
                    const distance = distanceFromQuery || "";
                    const duration = durationFromQuery || "";
                    const originDock = originDocks.find((d) => d.id_muelle === originDockId);
                    const destinationDock = destinationDocks.find((d) => d.id_muelle === destinationDockId);
                    const originDockCode = originDock?.codigo ?? "";
                    const destinationDockCode = destinationDock?.codigo ?? "";

                    router.push(
                      `/operaciones-maritimas/nueva?id_buque=${idBuque ?? ""}` +
                      `&contenedores=${encodeURIComponent(contenedores ?? "")}` +
                      `&routeId=${selectedRouteIdFromQuery ?? ""}` +
                      `&routeCode=${encodeURIComponent(routeCode)}` +
                      `&originId=${originPortIdFromQuery ?? ""}` +
                      `&destinationId=${destinationPortIdFromQuery ?? ""}` +
                      `&originName=${encodeURIComponent(originNameFromQuery)}` +
                      `&destinationName=${encodeURIComponent(destinationNameFromQuery)}` +
                      `&distance=${encodeURIComponent(distance)}` +
                      `&duration=${encodeURIComponent(duration)}` +
                      `&originDockCode=${encodeURIComponent(originDockCode)}` +
                      `&destinationDockCode=${encodeURIComponent(destinationDockCode)}`
                    );
                  }}
                >
                  Confirmar Ruta
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 shadow-lg"
                >
                  Limpiar mapa
                </button>
                <Link
                  href={
                    `/operaciones-maritimas/nueva?id_buque=${idBuque ?? ""}` +
                    `&contenedores=${encodeURIComponent(contenedores ?? "")}` +
                    `&routeId=${selectedRouteIdFromQuery ?? ""}` +
                    `&routeCode=${encodeURIComponent(rutaMapa?.codigo ?? "")}` +
                    `&originId=${originPortIdFromQuery ?? ""}` +
                    `&destinationId=${destinationPortIdFromQuery ?? ""}` +
                    `&originName=${encodeURIComponent(originNameFromQuery)}` +
                    `&destinationName=${encodeURIComponent(destinationNameFromQuery)}` +
                    `&distance=${encodeURIComponent(distanceFromQuery)}` +
                    `&duration=${encodeURIComponent(durationFromQuery)}`
                  }
                  className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 shadow-lg"
                >
                  Cancelar
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
              <details open={isDetailsOpen}>
                <summary
                  className="flex items-center justify-between font-bold text-gray-800 dark:text-gray-100 cursor-pointer"
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                >
                  <span>
                    Información de Ruta Activa: {rutaMapa?.codigo ?? "-"}
                  </span>
                  <span className="material-symbols-outlined">
                    {isDetailsOpen ? "expand_less" : "expand_more"}
                  </span>
                </summary>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <strong>Origen:</strong>{" "}
                    {originNameFromQuery || "-"}
                  </div>
                  <div>
                    <strong>Destino:</strong>{" "}
                    {destinationNameFromQuery || "-"}
                  </div>
                  <div>
                    <strong>Distancia Total:</strong>{" "}
                    {distanceFromQuery || "-"}
                  </div>
                  <div>
                    <strong>Tiempo Estimado:</strong>{" "}
                    {durationFromQuery || "-"}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SeleccionRutasMaritimasPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0f1923]">
        Cargando rutas marítimas...
      </div>
    }>
      <SeleccionRutasMaritimasContent />
    </Suspense>
  );
}

