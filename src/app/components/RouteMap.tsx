// src/app/components/RouteMap.tsx
'use client'

import React, { useEffect, useRef } from 'react';
// ¡IMPORTANTE! Eliminamos todas las importaciones directas de Leaflet aquí para evitar SSR
import { DriverRoute, Waypoint } from '@/app/types/RouteData'; 

interface RouteMapProps {
    route: DriverRoute;
}

// Lógica del Icono personalizado
const customIcon = (L: any, status: Waypoint['status'], order: number) => { 
    let bgColor: string;

    switch (status?.toLowerCase()) {
        case 'completed':
            bgColor = 'rgb(5, 150, 105)'; // green-600
            break;
        case 'in_progress':
        case 'arrived':
            bgColor = 'rgb(37, 99, 235)'; // blue-600
            break;
        case 'pending':
        default:
            bgColor = 'rgb(156, 163, 175)'; // gray-400
            break;
    }

    // Usamos L.divIcon para crear un marcador HTML que contenga el número
    return L.divIcon({
        className: 'custom-route-icon',
        html: `<div style="width: 30px; height: 30px; line-height: 30px; text-align: center; border-radius: 50%; background-color: ${bgColor}; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">
                   ${order}
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15] 
    });
};


const RouteMap: React.FC<RouteMapProps> = ({ route }) => {
    // mapRef ahora es de tipo genérico o desconocido (any)
    const mapRef = useRef<any | null>(null);
    const mapContainerId = `map-${route.id}`; 

    useEffect(() => {
        // 💡 Acceso seguro a Leaflet: Solo si window existe y L está definido.
        if (typeof window === 'undefined' || !(window as any).L) {
             console.log("Leaflet aún no está disponible. Esperando...");
             return;
        }
        
        const L = (window as any).L; 
        
        // 1. Corregir Path de Iconos
        const fixDefaultIcons = () => {
             delete (L.Icon.Default.prototype as any)._getIconUrl;
             L.Icon.Default.mergeOptions({
                 iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
                 iconUrl: 'leaflet/images/marker-icon.png',
                 shadowUrl: 'leaflet/images/marker-shadow.png',
             });
        };
        fixDefaultIcons();

        // 2. Limpia y Re-inicializa el mapa
        if (mapRef.current) {
             mapRef.current.remove();
             mapRef.current = null;
        }

        // 3. Inicialización
        const initialCenter: [number, number] = route.waypoints.length > 0
            ? [route.waypoints[0].latitude, route.waypoints[0].longitude]
            : [0, 0]; 

        const map = L.map(mapContainerId).setView(initialCenter, 13);
        mapRef.current = map;

        // Capa de tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        const markers: any[] = [];
        const latLngs: any[] = [];
        
        // 4. Dibuja los marcadores y obtiene coordenadas
        const orderedWaypoints = route.waypoints.sort((a, b) => a.delivery_order - b.delivery_order);

        orderedWaypoints.forEach((waypoint) => {
            if (waypoint.latitude && waypoint.longitude) {
                const icon = customIcon(L, waypoint.status, waypoint.delivery_order);
                const lat = waypoint.latitude;
                const lng = waypoint.longitude;

                const marker = L.marker([lat, lng], {
                    icon: icon,
                    title: `Punto #${waypoint.delivery_order}`
                }).addTo(map);
                
                marker.bindPopup(`
                    <b>Punto #${waypoint.delivery_order}</b><br>
                    ${waypoint.address}<br>
                    Estado: <b>${waypoint.status?.toUpperCase() || 'DESCONOCIDO'}</b>
                `);
                
                markers.push(marker);
                latLngs.push([lat, lng]);
            }
        });

        // 5. Dibujar Ruta (Polilínea)
        if (latLngs.length > 1) {
            L.polyline(latLngs, { color: '#007bff', weight: 4, opacity: 0.7 }).addTo(map);
        }

        // 6. Ajustar Límites y Corregir Tamaño (El timeout es CRUCIAL)
        if (markers.length > 0) {
            const group = new L.FeatureGroup(markers);
            
            // Forzar invalidación del tamaño DESPUÉS de la animación del panel
            setTimeout(() => {
                map.invalidateSize(); 
                map.fitBounds(group.getBounds(), { padding: [50, 50] }); 
                console.log("Leaflet: Tamaño recalculado y límites ajustados.");
            }, 300); 
        }

        // 7. Limpieza al desmontar
        return () => {
             map.remove();
             mapRef.current = null;
        };
        
    }, [route, mapContainerId]); 

    return (
        <div id={mapContainerId} className="w-full h-full">
            {/* El mapa de Leaflet se renderiza aquí */}
        </div>
    );
};

export default RouteMap;