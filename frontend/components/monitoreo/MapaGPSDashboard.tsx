"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/app/leaflet.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; 

// Arreglar iconos por defecto de Leaflet en Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface PosicionGPS {
  id: string;
  code: string;
  type: "container" | "vehicle" | "ship";
  position: [number, number];
  status: string;
  statusColor: string;
  icon: string;
  lastUpdate: string;
  speed?: string;
  temp?: string;
}

interface MapaGPSDashboardProps {
  height?: string;
}

// Crear iconos personalizados para marcadores
function createCustomIcon(asset: PosicionGPS) {
  return L.divIcon({
    html: `
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
        background-color: ${asset.statusColor};
      ">
        <span style="font-size: 16px; color: white;">
          ${asset.type === "container" ? "📦" : asset.type === "vehicle" ? "🚛" : "🚢"}
        </span>
      </div>
    `,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function MapaGPSDashboard({ height = "400px" }: MapaGPSDashboardProps) {
  const [posiciones, setPosiciones] = useState<PosicionGPS[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const initializedRef = useRef(false);

  // Cargar posiciones GPS
  useEffect(() => {
    const fetchPosiciones = async () => {
        try {
        const response = await fetch(`${API_URL}/monitoreo/gps/posiciones`);
        console.log("GPS status", response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("GPS data", data);
            setPosiciones(data);
        }
        setLoading(false);
        } catch (error) {
        console.error("Error al cargar posiciones GPS:", error);
        setLoading(false);
        }
    };

    fetchPosiciones();
        const interval = setInterval(fetchPosiciones, 30000);
        return () => clearInterval(interval);
    }, []);

  // Inicializar mapa
  useEffect(() => {
    if (initializedRef.current) return;

    let cancelled = false;

    const initMap = () => {
      if (cancelled || initializedRef.current) return;

      if (!containerRef.current) {
        // Esperar al siguiente frame hasta que el ref exista
        requestAnimationFrame(initMap);
        return;
      }

      initializedRef.current = true;
      console.log("Inicializando mapa dashboard");

      const map = L.map(containerRef.current, {
        center: [-12.046374, -77.042793],
        zoom: 10,
        zoomControl: false,
      });

      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Forzar a Leaflet a recalcular el tamaño del mapa una vez montado el layout
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      initializedRef.current = false;
    };
  }, []);

  // Actualizar marcadores cuando cambian las posiciones
  useEffect(() => {
    if (!mapRef.current || posiciones.length === 0) return;
    console.log("Dibujando marcadores en el mapa", posiciones.length);
    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Agregar nuevos marcadores
    posiciones.forEach(posicion => {
      const marker = L.marker(posicion.position, {
        icon: createCustomIcon(posicion),
      });

      // Crear popup con información
      const popupContent = `
        <div style="min-width: 200px; padding: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px; color: ${posicion.statusColor};">
              ${posicion.type === "container" ? "📦" : posicion.type === "vehicle" ? "🚛" : "🚢"}
            </span>
            <div>
              <p style="font-size: 14px; font-weight: 600; margin: 0;">${posicion.code}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">
                ${posicion.type === "container" ? "Contenedor" : posicion.type === "vehicle" ? "Vehículo" : "Buque"}
              </p>
            </div>
          </div>
          <div style="font-size: 12px; line-height: 1.5;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Estado:</span>
              <span style="font-weight: 500; color: ${posicion.statusColor};">${posicion.status}</span>
            </div>
            ${posicion.speed && posicion.speed !== "N/A" ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Velocidad:</span>
              <span style="font-weight: 500;">${posicion.speed}</span>
            </div>
            ` : ''}
            ${posicion.temp && posicion.temp !== "N/A" ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Temperatura:</span>
              <span style="font-weight: 500;">${posicion.temp}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Última act.:</span>
              <span style="font-weight: 500;">${new Date(posicion.lastUpdate).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Ajustar el zoom para mostrar todos los marcadores
    if (posiciones.length > 0) {
      const bounds = L.latLngBounds(posiciones.map(p => p.position as [number, number]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });

      // Recalcular tamaño tras ajustar el viewport
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    }
  }, [posiciones]);

  if (loading) {
    return (
      <div 
        style={{ height }} 
        className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (posiciones.length === 0) {
    return (
      <div 
        style={{ height }} 
        className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg"
      >
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-zinc-400">location_off</span>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            No hay datos GPS disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
  <div style={{ height }} className="relative rounded-lg overflow-hidden">
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    />
  </div>
    );
}
