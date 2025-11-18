"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Arreglar iconos por defecto de Leaflet en Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

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

interface MapComponentProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onAssetSelect: (asset: Asset | null) => void;
  onMapReady: (map: any) => void;
}

// Crear iconos personalizados para marcadores
function createCustomIcon(asset: Asset) {
  const isAlert = asset.status === 'Alerta';
  
  return L.divIcon({
    html: `
      <div class="custom-marker ${isAlert ? 'alert' : ''}" style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s;
        background-color: ${asset.statusColor};
        ${isAlert ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;' : ''}
      ">
        <span class="material-symbols-outlined" style="font-size: 24px; color: white;">${asset.icon}</span>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .custom-marker:hover {
          transform: scale(1.15);
        }
      </style>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

export default function MapComponent({ assets, selectedAsset, onAssetSelect, onMapReady }: MapComponentProps) {
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const initializedRef = useRef(false);

  // Ruta de ejemplo
  const routePath: [number, number][] = [
    [-12.046374, -77.042793],
    [-11.956789, -77.082345],
    [-11.923456, -77.134567],
    [-12.056789, -77.182891]
  ];

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;

    // Marcar como inicializado inmediatamente
    initializedRef.current = true;

    // Crear mapa
    const map = L.map(containerRef.current, {
      center: [-12.046374, -77.042793],
      zoom: 10,
      zoomControl: false,
    });

    mapRef.current = map;

    // Agregar capa base
    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }
    );
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Agregar polyline
    const polyline = L.polyline(routePath, {
      color: '#ff8c00',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10',
    });
    polyline.addTo(map);
    polylineRef.current = polyline;

    // Notificar que el mapa está listo
    onMapReady(map);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar marcadores cuando cambian los assets
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Agregar nuevos marcadores
    assets.forEach(asset => {
      const marker = L.marker(asset.position, {
        icon: createCustomIcon(asset),
      });

      marker.on('click', () => {
        onAssetSelect(asset);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [assets, onAssetSelect]);

  // Actualizar capa de tiles cuando cambia el tipo
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    tileLayerRef.current.remove();

    const newTileLayer = L.tileLayer(
      mapLayer === 'street'
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: mapLayer === 'street' ? '© OpenStreetMap contributors' : '© Esri',
        maxZoom: 19,
      }
    );
    newTileLayer.addTo(mapRef.current);
    tileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  // Centrar en asset seleccionado
  useEffect(() => {
    if (selectedAsset && mapRef.current) {
      mapRef.current.flyTo(selectedAsset.position, 13, { duration: 1.5 });
    }
  }, [selectedAsset]);

  useEffect(() => {
    setShowInfoPanel(selectedAsset !== null);
  }, [selectedAsset]);

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([-12.046374, -77.042793], 10, { duration: 1.5 });
    }
  };

  const handleToggleLayer = () => {
    setMapLayer(prev => prev === 'street' ? 'satellite' : 'street');
  };

  const closeInfoPanel = () => {
    setShowInfoPanel(false);
    onAssetSelect(null);
  };

  return (
    <>
      {/* Contenedor del mapa */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', zIndex: 0 }} />

      {/* Controles del mapa */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md text-slate-700 hover:bg-gray-50"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md text-slate-700 hover:bg-gray-50"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button
          onClick={handleToggleLayer}
          className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md text-slate-700 hover:bg-gray-50"
          title="Cambiar capa"
        >
          <span className="material-symbols-outlined">layers</span>
        </button>
        <button
          onClick={handleCenterMap}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md text-slate-700 hover:bg-gray-50"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {/* Panel de información */}
      {showInfoPanel && selectedAsset && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4 w-full max-w-lg z-[1000]">
          <div className="rounded-xl shadow-2xl bg-white p-6 m-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="text-primary flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12"
                >
                  <span className="material-symbols-outlined">{selectedAsset.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedAsset.code}</h3>
                  <div className="flex items-center gap-2">
                    <div 
                      className="size-2 rounded-full" 
                      style={{ backgroundColor: selectedAsset.statusColor }}
                    ></div>
                    <p 
                      className="text-sm font-medium" 
                      style={{ color: selectedAsset.statusColor }}
                    >
                      {selectedAsset.status}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={closeInfoPanel}
                className="text-slate-500 hover:text-slate-900"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div>
                <p className="text-slate-500">Última Actualización</p>
                <p className="font-medium text-slate-900">{selectedAsset.lastUpdate}</p>
              </div>
              <div>
                <p className="text-slate-500">Velocidad</p>
                <p className="font-medium text-slate-900">{selectedAsset.speed}</p>
              </div>
              <div>
                <p className="text-slate-500">Ubicación Actual</p>
                <p className="font-medium text-slate-900">
                  {selectedAsset.position[0].toFixed(4)}° S, {Math.abs(selectedAsset.position[1]).toFixed(4)}° W
                </p>
              </div>
              <div>
                <p className="text-slate-500">Temperatura</p>
                <p className="font-medium text-slate-900">{selectedAsset.temp}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-primary/90">
                <span className="material-symbols-outlined text-base">timeline</span>
                <span>Ver Ruta Histórica</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
