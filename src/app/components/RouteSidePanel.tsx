// src/app/components/RouteSidePanel.tsx
'use client'

import React, { useEffect } from 'react';
import { X, Truck, MapPin, Clock, User, CheckCircle, Package } from 'lucide-react';
import { DriverRoute } from '@/app/types/RouteData';
import dynamic from 'next/dynamic';

const DynamicRouteMapWrapper = dynamic(
    () => import('./RouteMap'), 
    { 
        ssr: false, 
        loading: () => <div className="flex items-center justify-center h-full bg-gray-100 p-4"><p className="text-gray-500">Cargando Mapa...</p></div>
    }
);

interface RouteSidePanelProps {
    route: DriverRoute | null; 
    onClose: () => void;
}

const RouteSidePanel: React.FC<RouteSidePanelProps> = ({ route, onClose }) => {
    if (!route) return null;

    useEffect(() => {
        if (route) {
            // Aseguramos que el mapa se redimensione
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100); 
            return () => clearTimeout(timer); 
        }
    }, [route]); 

    const completedWaypointsCount = route.waypoints?.filter(w => w.status === 'completed').length ?? 0;
    const totalWaypoints = route.waypoints?.length ?? 0;

    return (
        <div 
            // ----------------------------------------------------
            // OVERLAY (FONDO OSCURO) - ¡CAMBIADO!
            // Ahora centra tanto horizontal como verticalmente.
            // ----------------------------------------------------
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4"
            onClick={onClose} 
            style={{ 
                visibility: route ? 'visible' : 'hidden', 
                opacity: route ? 1 : 0, 
                transition: 'opacity 300ms, visibility 300ms'
            }}
        >
            {/* PANEL PRINCIPAL (EL MODAL) - ¡CAMBIADO! */}
            <div 
                // CRÍTICO: Detiene la propagación para que el clic dentro del panel no cierre el modal
                onClick={e => e.stopPropagation()} 
                
                // Estilos de diseño: max-w-md/lg, altura automática, bordes redondeados
                // Eliminamos h-full y las transformaciones de slide, usando solo la opacidad/visibilidad del padre.
                className="bg-white w-full max-w-md md:max-w-lg rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]"
                style={{ 
                     // Si quieres una pequeña animación al aparecer:
                     transform: route ? 'scale(1)' : 'scale(0.95)',
                     transition: 'transform 300ms ease-out'
                }}
            >
                
                {/* Encabezado y Botón de Cierre */}
                <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-20 shadow-sm rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Truck className="text-blue-600 w-5 h-5" />
                        Ruta: {route.name}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Información de la Ruta */}
                    <div className="bg-blue-50 p-4 rounded-xl space-y-2 border border-blue-200">
                        <p className="font-semibold text-lg text-blue-800 flex items-center gap-2">
                             <User className="w-5 h-5" />
                             Conductor: <span className="text-blue-700 font-bold">{route.driver_name || 'No Asignado'}</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                Estado: 
                                <span className={`font-bold ${route.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {route.status?.toUpperCase() || 'DESCONOCIDO'}
                                </span>
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                                <Package className="w-4 h-4 text-purple-500" />
                                Entregas: 
                                <span className="font-bold text-gray-700">
                                    {completedWaypointsCount} / {totalWaypoints}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Mapa de la Ruta (CONTENEDOR) */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                        <h3 className="p-3 font-semibold bg-gray-100 text-gray-700 border-b">
                            <MapPin className="w-4 h-4 inline mr-2 text-red-500" />
                            Vista Satelital de la Ruta
                        </h3>
                        
                        {/* Contenedor del mapa con altura fija */}
                        <div className="h-96 w-full"> 
                            <DynamicRouteMapWrapper route={route} />
                        </div>
                    </div>

                    {/* Lista de Waypoints */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Puntos de Entrega ({totalWaypoints})</h3>
                        <div className="space-y-3">
                            {route.waypoints
                                ?.sort((a, b) => a.delivery_order - b.delivery_order) 
                                .map((waypoint) => (
                                <div 
                                    key={waypoint.id} 
                                    className={`flex items-start p-4 rounded-xl border transition-all duration-150 ${
                                        waypoint.status === 'completed' ? 'bg-green-50 border-green-300 shadow-sm' : 'bg-white border-gray-200 hover:shadow-md'
                                    }`}
                                >
                                    <span className={`w-6 h-6 mr-4 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                                        waypoint.status === 'completed' 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-gray-300 text-gray-700'
                                    }`}>
                                        {waypoint.delivery_order}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-700">{waypoint.address}</p>
                                        <p className={`text-xs mt-1 ${waypoint.status === 'completed' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                                            Estado: {waypoint.status?.toUpperCase() || 'PENDIENTE'}
                                        </p>
                                        {waypoint.proof_url && (
                                            <a href={waypoint.proof_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">
                                                Ver Prueba de Entrega
                                            </a>
                                        )}
                                    </div>
                                    {waypoint.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600 shrink-0 ml-4" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteSidePanel;