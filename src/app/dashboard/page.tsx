'use client'

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic'; // Necesario para la carga dinámica del panel
import { Truck, MapPin, Package, Clock, User, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import LeafletLoader from '../components/LeafletLoader';
// IMPORTACIONES DE COMPONENTES NO DINÁMICOS
import AssignmentModal from '../components/AssignmentModal'; 
import Header from '../components/Header';

// IMPORTACIONES DE SERVICIOS Y TIPOS
import { dashboardService } from '@/Services/dashboard.service'; 
import { 
    DashboardData, 
    DashboardStats, 
    RouteSummary, 
    DriverRoute,
    DriverSummary as DashboardDriver 
} from '@/app/types/RouteData'; 

// --------------------------------------------------------------------------
// 💡 SOLUCIÓN CRÍTICA: CARGA DINÁMICA DEL PANEL LATERAL
// --------------------------------------------------------------------------
// Desactiva el Server-Side Rendering (SSR) para este componente contenedor del mapa.
const DynamicRouteSidePanel = dynamic(
    () => import('../components/RouteSidePanel'),
    { 
        ssr: false, 
        loading: () => null 
    }
);
// --------------------------------------------------------------------------


// --- Estructuras Iniciales ---
const initialSummary: DashboardStats = {
    total_drivers: 0,
    active_routes: 0,
    deliveries_completed_today: 0,
    overall_progress_percent: 0,
    deliveries_last_7_days: [],
};

// ====================================================================
// COMPONENTE PRINCIPAL: Dashboard (Admin)
// ====================================================================

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [overallProgress, setOverallProgress] = useState(0); 

    const [currentView, setCurrentView] = useState<'dashboard' | 'reports'>('dashboard');

    // ESTADOS PARA EL MODAL DE ASIGNACIÓN
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteSummary | null>(null); 
    
    // ESTADOS PARA EL PANEL LATERAL (VER EN MAPA)
    const [selectedRouteDetail, setSelectedRouteDetail] = useState<DriverRoute | null>(null);
    const [isPanelLoading, setIsPanelLoading] = useState(false);

    // --- MANEJO DE MODAL DE ASIGNACIÓN ---
    const handleOpenAssignmentModal = (route: RouteSummary) => {
        setSelectedRoute(route);
        setIsModalOpen(true);
    };

    const handleAssignmentSuccess = useCallback((updatedRoute: RouteSummary) => {
        if (data) {
            const newRoutes = data.routes.map(route => 
                route.id === updatedRoute.id ? updatedRoute : route
            );
            
            const oldRoute = data.routes.find(r => r.id === updatedRoute.id);
            const wasInactive = !oldRoute || (oldRoute.status !== 'assigned' && oldRoute.status !== 'in_progress');
            const nowActive = updatedRoute.status === 'assigned' || updatedRoute.status === 'in_progress';
            
            let newActiveRoutesCount = data.summary.active_routes;
            if (wasInactive && nowActive) {
                newActiveRoutesCount += 1;
            }

            setData({
                ...data,
                routes: newRoutes,
                summary: {
                    ...data.summary,
                    active_routes: newActiveRoutesCount
                }
            });
            
            setIsModalOpen(false);
            setSelectedRoute(null);
        }
    }, [data]);


    // --- MANEJO DE PANEL LATERAL (VER EN MAPA) ---
    const handleViewRouteOnMap = async (routeSummary: RouteSummary) => {
        setSelectedRouteDetail(null); 
        setIsPanelLoading(true);
        setError(null);
        
        try {
            const fullRouteDetail: DriverRoute = await dashboardService.getRouteDetail(routeSummary.id);
            setSelectedRouteDetail(fullRouteDetail);
        } catch (err: any) {
            console.error("Error al cargar detalle de ruta:", err);
            const errorMessage = err.message || "No se pudo cargar el detalle de la ruta.";
            setError(errorMessage);
        } finally {
            setIsPanelLoading(false);
        }
    };


    // --- LÓGICA DE CARGA DE DATOS INICIAL ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const fetchedData = await dashboardService.getDashboardData();
                setData(fetchedData);
                setTimeout(() => {
                    setOverallProgress(fetchedData.summary.overall_progress_percent);
                }, 500); 
                
            } catch (err: any) {
                console.error("Error cargando datos del dashboard:", err);
                setError("Error al cargar los datos del panel. Asegúrate de que el backend esté activo y el token sea válido.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    
    // Acceso a datos con fallback
    const summary = data?.summary ?? initialSummary;
    const drivers = data?.drivers ?? [];
    const routes = data?.routes ?? [];
    
    const getDriverStatusStyles = (status: string) => {
        switch (status) {
            case 'Disponible':
                return 'bg-green-100 text-green-700';
            case 'En Ruta':
                return 'bg-orange-100 text-orange-700';
            case 'Descanso':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Truck className="w-12 h-12 text-blue-500 animate-bounce" />
                <p className="mt-4 text-lg font-medium text-gray-700">Cargando Panel de Control...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
                <h2 className="mt-4 text-xl font-bold text-red-700">Error de Carga</h2>
                <p className="mt-2 text-gray-600">{error}</p>
                <button 
                    onClick={() => { setLoading(true); setError(null); }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const completedRoutes = routes.filter(route => route.status === 'completed');

    if (currentView === 'reports') {
        return (
            <div className="min-h-screen bg-slate-50 p-4 lg:p-8 space-y-8">
                {/* Encabezado de Reportes con botón de regreso */}
                <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800">Reporte de Rutas Terminadas ({completedRoutes.length})</h1>
                    <button 
                        onClick={() => setCurrentView('dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 transform rotate-180" />
                        Volver al Dashboard
                    </button>
                </div>

                {/* Lista de Rutas Terminadas */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="text-green-500" />
                        Detalle de Rutas Finalizadas
                    </h2>

                    {completedRoutes.length === 0 ? (
                        <div className="text-center p-8 bg-green-50 rounded-xl text-gray-500">
                            No hay rutas terminadas para mostrar en el reporte.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {completedRoutes.map((route) => (
                                <div 
                                    key={route.id} 
                                    className="flex flex-col md:flex-row items-center justify-between bg-green-50 border-l-4 border-green-500 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex-1">
                                        <p className="font-bold text-green-700">{route.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Entregas: {route.waypoints_completed ?? 0} / {route.total_waypoints ?? 0} • 
                                            Conductor: <span className="font-medium text-blue-700">{route.driver?.full_name || 'N/A'}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Progreso: {route.progress_percent ?? 0}%
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-row gap-2 mt-2 md:mt-0">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">
                                            FINALIZADA
                                        </span>
                                        {/* Botón Ver en Mapa para Reportes */}
                                        <button 
                                            onClick={() => handleViewRouteOnMap(route)}
                                            disabled={isPanelLoading} 
                                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                                        >
                                            {isPanelLoading ? '...' : 'Ver en Mapa'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
            <LeafletLoader />
            <Header /> 
            
            <div className="flex-1 space-y-8">
                
                {/* ENCABEZADO Y BOTÓN VER REPORTES */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-2xl shadow-lg animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-4 sm:mb-0">
                        Panel de Control
                        {data?.adminFleetCode && (
                            <span className="ml-4 inline-block bg-blue-100 text-blue-700 text-sm font-mono px-3 py-1 rounded-full border border-blue-200 shadow-inner">
                                CÓDIGO FLOTA: {data.adminFleetCode}
                            </span>
                        )}
                    </h1>
                    <button 
                        onClick={() => setCurrentView('reports')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <TrendingUp className="w-5 h-5" />
                        Ver Reportes
                    </button>
                </div>

                {/* TARJETAS DE RESUMEN Y GRÁFICO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tarjeta de Resumen Rápido */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 animate-slide-up">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="text-blue-500" /> Estado General de Entregas
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">Rutas Activas</p>
                                <p className="text-3xl font-bold text-blue-700 mt-1">{summary.active_routes}</p>
                            </div>
                            <div className="bg-cyan-50 p-4 rounded-xl shadow-sm">
                                <p className="text-sm text-gray-500">Entregas Hoy</p>
                                <p className="text-3xl font-bold text-cyan-700 mt-1">{summary.deliveries_completed_today}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">Total de conductores activos: {summary.total_drivers}</p>
                    </div>

                    {/* Gráfico de Progreso General */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 animate-slide-up-delay">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Package className="text-cyan-500" /> Progreso General de Envíos
                        </h2>
                        <div className="flex items-center justify-center h-40 relative">
                            {/* SVG de progreso */}
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    <circle
                                        className="text-blue-500 transition-all duration-1000 ease-out"
                                        strokeWidth="8"
                                        strokeDasharray={2 * Math.PI * 40}
                                        strokeDashoffset={(2 * Math.PI * 40) - (2 * Math.PI * 40 * overallProgress / 100)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-blue-700">{overallProgress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* SECCIÓN DE RUTAS RECIBIDAS */}
                <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-delay-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="text-orange-500" /> Rutas Recibidas Recientes ({routes.length} mostradas)
                    </h2>
                    <div className="space-y-4">
                        {routes.length === 0 ? (
                            <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                                No hay rutas registradas para tu flota.
                            </div>
                        ) : (
                            routes.map((route) => (
                                <div key={route.id} className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex-1 mb-2 md:mb-0 flex items-center"> 
                                        {/* Avatar del conductor */}
                                        {route.driver && (
                                            <img 
                                                src={route.driver.avatar_url || `https://ui-avatars.com/api/?name=${route.driver.full_name}&background=0080FF&color=fff&bold=true`} 
                                                alt={route.driver.full_name} 
                                                title={`Asignada a ${route.driver.full_name}`}
                                                className="w-8 h-8 rounded-full mr-3 border-2 border-blue-400 object-cover" 
                                            />
                                        )}
                                        
                                        <div>
                                            <p className="font-semibold text-gray-700">{route.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Conductor: <span className={`font-medium ${route.driver ? 'text-blue-700' : 'text-gray-800'}`}>{route.driver?.full_name || 'No Asignado'}</span>
                                                {route.eta && ` • ETA: ${route.eta}`}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full md:w-48 bg-gray-200 rounded-full h-2.5 relative overflow-hidden my-2 md:my-0">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
                                            style={{ width: `${route.progress_percent ?? 0}%` }}
                                        ></div>
                                        <span className="absolute right-0 top-0 -mr-8 -mt-5 text-xs text-gray-600 font-medium">{route.progress_percent ?? 0}%</span>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="flex flex-row md:flex-row items-center gap-2 mt-2 md:mt-0 ml-0 md:ml-4">
                                        <button 
                                            onClick={() => handleOpenAssignmentModal(route)}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors font-medium flex items-center justify-center"
                                        >
                                            {route.driver ? 'Reasignar' : 'Asignar'}
                                        </button>
                                        
                                        {/* BOTÓN: Ver en Mapa */}
                                        <button 
                                            onClick={() => handleViewRouteOnMap(route)}
                                            disabled={isPanelLoading} 
                                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                                        >
                                            {isPanelLoading ? 'Cargando...' : 'Ver Mapa'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* COLUMNA LATERAL - CONDUCTORES */}
            <div className="w-full lg:w-96 bg-white rounded-2xl shadow-xl p-6 space-y-6 animate-slide-in-right">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="text-purple-500" /> Conductores ({drivers.length})
                </h2>
                <div className="space-y-4">
                    {drivers.length === 0 ? (
                        <div className="text-center p-4 bg-gray-50 rounded-xl text-gray-500 text-sm">
                            Aún no hay conductores en tu flota.
                        </div>
                    ) : (
                        drivers.map((driver) => (
                            <div key={driver.id} className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                                <img 
                                    src={driver.avatar_url || `https://ui-avatars.com/api/?name=${driver.full_name}&background=9933FF&color=fff&bold=true`} 
                                    alt={driver.full_name} 
                                    className="w-10 h-10 rounded-full mr-3 border-2 border-blue-400 object-cover" 
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-700">{driver.full_name}</p>
                                    <p className="text-sm text-gray-500">{driver.email}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDriverStatusStyles(driver.status)}`}>
                                    {driver.status} 
                                </span>
                            </div>
                        ))
                    )}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                    Gestionar Conductores
                </button>
            </div>

            {/* INTEGRACIÓN DEL MODAL DE ASIGNACIÓN */}
            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                route={selectedRoute}
                drivers={drivers}
                onAssignmentSuccess={handleAssignmentSuccess}
            />
            
            {/* INTEGRACIÓN DEL PANEL LATERAL DE RUTA (USANDO CARGA DINÁMICA) */}
            <DynamicRouteSidePanel
                route={selectedRouteDetail}
                onClose={() => setSelectedRouteDetail(null)}
            />
        </div>
    );
}