// src/app/driver-dashboard/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Truck, CheckCircle, Clock, AlertTriangle, Camera, Package, XCircle } from 'lucide-react';

// Asegúrate de que las rutas a los tipos y servicios sean correctas
import { DriverRoute, Waypoint } from '../types/RouteData';
import { driverService } from '@/Services/driver.service'; // Servicio específico de acciones del driver
import { dashboardService } from '@/Services/dashboard.service'; // Servicio que contiene getDriverDashboardData

// Carga dinámica del mapa para evitar errores de SSR/Leaflet
const DriverMap = dynamic(() => import('../components/DriverMap'), { ssr: false });

// Simulación de datos iniciales (mantener como fallback si el servicio falla o no está implementado)
const mockInitialRoute: DriverRoute = {
    id: 'r-123',
    name: 'Ruta Sur - Hoy (MOCK)', // Cambiado para indicar que es un mock
    status: 'assigned',
    total_distance_km: 45.5,
    driver_id: 'd-001',
    driver_name: 'Pepito Pérez',
    waypoints: [
        { id: 'w-01', address: 'Calle Falsa 123, Comuna 1', latitude: -33.4489, longitude: -70.6693, status: 'completed', delivery_order: 1 },
        { id: 'w-02', address: 'Avenida Siempre Viva 456, Comuna 2', latitude: -33.4372, longitude: -70.6504, status: 'pending', delivery_order: 2 },
        { id: 'w-03', address: 'Pasaje del Sol 789, Comuna 3', latitude: -33.4542, longitude: -70.6865, status: 'pending', delivery_order: 3 },
    ],
};


export default function DriverDashboard() {
    const [route, setRoute] = useState<DriverRoute | null>(null);
    const [loading, setLoading] = useState(true);
    // Cambiamos el tipo de error para manejar mejor los objetos de error de la API
    const [error, setError] = useState<string | null>(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Coordenadas iniciales del mapa (Santiago de Chile)
    const initialCenter: [number, number] = [-33.4489, -70.6693]; 

    // Referencia oculta para simular el input de la cámara/archivo
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentWaypointToComplete, setCurrentWaypointToComplete] = useState<string | null>(null);


    // 1. Lógica de Carga de Ruta (¡CORREGIDA!)
    useEffect(() => {
        const fetchRoute = async () => {
            try {
                console.log("🚚 Llamando a datos del Driver Dashboard (Servicio de Conductor)...");
                // 💡 LLAMADA AL SERVICIO ESPECÍFICO DEL DRIVER
                const data = await dashboardService.getDriverDashboardData(); 
                
                // Si el servicio devuelve la ruta actual, la usamos.
                if (data.current_route) {
                    setRoute(data.current_route);
                } else {
                    // Si el backend no devuelve ruta, mostramos que no hay asignación
                    setRoute(null);
                }
                
                // SIMULACIÓN (Comentar la línea de abajo si el backend funciona)
                // setRoute(mockInitialRoute); 

            } catch (err: any) {
                console.error("Error cargando la ruta del conductor:", err);
                
                // Intentamos extraer el mensaje de error si es un objeto de la API
                const errorMessage = err.error || err.message || "No se pudo cargar la ruta asignada.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, []);

    // 2. Lógica de Apertura de Cámara/Input de Archivo
    const handleCapturePhotoClick = (waypointId: string) => {
        setCurrentWaypointToComplete(waypointId);
        if (fileInputRef.current) {
            // Limpia el valor y abre la cámara (input type="file" accept="image/*" capture="environment")
            fileInputRef.current.value = ''; 
            fileInputRef.current.click();
        }
    };
    
    // 3. Lógica de Subida y Actualización de Waypoint
    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const waypointId = currentWaypointToComplete;

        if (!file || !waypointId || isSubmitting) {
            setCurrentWaypointToComplete(null);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Llama al servicio para completar (subida de foto + actualización de DB)
            const completionResponse = await driverService.completeWaypoint(waypointId, file);
            
            // ** Actualización Optimista del Estado **
            if (route) {
                const updatedWaypoints = route.waypoints.map(w => {
                    if (w.id === completionResponse.waypoint_id) {
                        return { 
                            ...w, 
                            status: completionResponse.status, // 'completed'
                            proof_url: completionResponse.proof_url 
                        };
                    }
                    return w;
                });
                
                // La ruta se considera terminada si todos los puntos están en estado 'completed' O 'failed'.
                const allCompletedOrFailed = updatedWaypoints.every(w => 
                    w.status === 'completed' || w.status === 'failed'
                );
                
                setRoute({
                    ...route,
                    waypoints: updatedWaypoints,
                    // Si allCompletedOrFailed es true, el estado general de la ruta es 'completed'.
                    status: allCompletedOrFailed ? 'completed' : 'in_progress',
                });
            }
            
        } catch (err) {
            console.error("Fallo al completar el punto:", err);
            setError("Error al enviar la prueba de entrega. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
            setCurrentWaypointToComplete(null);
        }
    };


    // --- MANEJO DE ESTADOS DE CARGA Y ERROR ---
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Truck className="w-12 h-12 text-blue-500 animate-bounce" />
                <p className="mt-4 text-lg font-medium text-gray-700">Cargando tu Ruta...</p>
            </div>
        ); 
    }
    
    if (error) {
        return (
            <div className="min-h-screen p-8 text-center bg-red-50">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-xl font-bold mt-4 text-red-800">Error de Carga</h2>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }
    
    if (!route) {
        return (
            <div className="min-h-screen p-8 text-center bg-slate-50">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
                <h2 className="text-xl font-bold mt-4 text-gray-800">¡Ruta no Asignada!</h2>
                <p className="text-gray-600">Contacta a tu supervisor para recibir tu ruta de hoy o verifica tu estado de flota.</p>
            </div>
        );
    }
    
    const waypoints = route.waypoints.sort((a, b) => a.delivery_order - b.delivery_order);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                Dashboard de Conductor
            </h1>

            {/* Tarjeta de Resumen de Ruta */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-t-4 border-blue-500">
                <h2 className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                    {route.name}
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${route.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {route.status.toUpperCase()}
                    </span>
                </h2>
                <p className="text-gray-500 mt-1">Conductor: {route.driver_name}</p>
                <p className="text-gray-500 text-sm">Distancia Estimada: {route.total_distance_km} km</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna 1: Lista de Waypoints */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Puntos de Entrega
                    </h2>
                    
                    {waypoints.map((point) => (
                        <div key={point.id} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white shadow-md ${point.status === 'completed' ? 'bg-green-500' : point.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                    {point.delivery_order}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">{point.address}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                        {point.status === 'completed' ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                Completado
                                            </>
                                        ) : point.status === 'failed' ? (
                                            <>
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                Fallido
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-4 h-4 text-orange-500" />
                                                Pendiente
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Botón de Acción / Cámara */}
                            {point.status === 'pending' && (
                                <button 
                                    onClick={() => handleCapturePhotoClick(point.id)}
                                    disabled={isSubmitting}
                                    className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                                >
                                    {isSubmitting && currentWaypointToComplete === point.id ? (
                                        'Subiendo...'
                                    ) : (
                                        <>
                                            <Camera className="w-4 h-4 mr-1" />
                                            Entregado
                                        </>
                                    )}
                                </button>
                            )}
                            {point.status === 'completed' && point.proof_url && (
                                <a href={point.proof_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                                    Ver Prueba
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {/* Columna 2: Mapa Leaflet */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                           <Package className="w-5 h-5 text-blue-600" />
                           Visualización en Mapa
                    </h2>
                    <DriverMap 
                        waypoints={waypoints} 
                        center={initialCenter} 
                    />
                </div>
            </div>

            {/* Input de archivo oculto para simular la cámara */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment" // Sugiere al dispositivo usar la cámara trasera
                onChange={handleFileSelected}
                className="hidden"
            />
        </div>
    );
}