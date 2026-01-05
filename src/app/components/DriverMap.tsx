// src/app/driver/dashboard/DriverMap.tsx
'use client'

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Waypoint } from '../types/RouteData'; // Los nuevos tipos

interface DriverMapProps {
    waypoints: Waypoint[];
    center: [number, number];
}

// Iconos personalizados para Leaflet (solución a problemas de iconos en Webpack/Next)
const customIcon = (status: Waypoint['status'], order: number) => {
    let color = 'gray';
    if (status === 'completed') color = 'green';
    if (status === 'pending') color = 'blue';
    if (status === 'failed') color = 'red';

    return L.divIcon({
        className: `custom-div-icon bg-${color}-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg`,
        html: `<div style="width: 30px; height: 30px; line-height: 30px; text-align: center; border-radius: 50%; background-color: ${color};">${order}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};


const DriverMap: React.FC<DriverMapProps> = ({ waypoints, center }) => {
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        // Inicializa el mapa solo una vez
        if (mapRef.current) return;
        
        const map = L.map('leaflet-map-container').setView(center, 13);
        mapRef.current = map;

        // Añade la capa de tiles (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Limpia el mapa y añade los marcadores
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [center]);
    
    // Efecto para actualizar los marcadores cuando cambian los waypoints
    useEffect(() => {
        if (!mapRef.current) return;
        
        // 1. Limpiar marcadores anteriores
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current?.removeLayer(layer);
            }
        });

        // 2. Añadir nuevos marcadores
        waypoints.forEach((waypoint) => {
            const marker = L.marker([waypoint.latitude, waypoint.longitude], {
                icon: customIcon(waypoint.status, waypoint.delivery_order)
            }).addTo(mapRef.current!);

            // Popup con información
            marker.bindPopup(`<b>Punto #${waypoint.delivery_order}</b><br>${waypoint.address}<br>Estado: ${waypoint.status.toUpperCase()}`);
        });
        
        // Si hay waypoints, ajustar la vista del mapa para ver todos
        if (waypoints.length > 0) {
            const bounds = waypoints.map(w => [w.latitude, w.longitude] as L.LatLngTuple);
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
        
    }, [waypoints]);

    return (
        <div id="leaflet-map-container" style={{ height: '500px', width: '100%' }} className="rounded-xl shadow-lg border">
            {/* El mapa se renderiza aquí por Leaflet */}
        </div>
    );
};

export default DriverMap;