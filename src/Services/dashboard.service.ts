// src/Services/dashboard.service.ts

// NOTA: Reemplaza @/Services/api por tu ruta real a la función apiFetch.
import { apiFetch } from '@/Services/api'; 
// CORRECCIÓN DE RUTA DE TIPOS: Usamos RouteData en lugar de dashboard
import {
    DashboardStats,
    DriverSummary as DashboardDriver, // DashboardDriver (el alias que necesita AssignmentModal)
    RouteSummary,
    DashboardData,
    DriverRoute, // Añadir DriverRoute para el nuevo servicio
    ApiDriver, // <--- 💡 IMPORTAR EL TIPO BRUTO DE LA API
} from '@/app/types/RouteData'; 

export const dashboardService = {

    /**
     * Obtiene todos los datos necesarios para renderizar el Dashboard.
     */
    getDashboardData: async (): Promise<DashboardData> => {
        // Ejecutamos las llamadas en paralelo para obtener Conductores, Rutas y Perfil del Admin.
        const [driversResponse, routesResponse, meResponse] = await Promise.all([
            apiFetch('/api/v1/users'),
            apiFetch('/api/v1/routes?limit=5'), // Limitamos a 5 rutas recientes
            apiFetch('/api/v1/users/me'),
        ]);
        
        console.log('Drivers Response:', driversResponse);
        console.log('Routes Response:', routesResponse);
        console.log('Me Response:', meResponse);

        // 1. Procesar respuestas
        // 💡 CAMBIO CLAVE: Casteamos la respuesta de conductores al tipo BRUTO (ApiDriver)
        const drivers = driversResponse as ApiDriver[]; 
        const routes = routesResponse as RouteSummary[];
        const data = meResponse as any; 
        const adminFleetCode = data.user?.fleet_code || data.fleet_code || null;


        // === 2. CÁLCULO DE MÉTRICAS DEL DASHBOARD ===
        
        // Calculamos rutas activas: Asumiendo que 'in_progress' o 'assigned' son rutas activas
        const activeRoutesCount = routes.filter(r => r.status === 'assigned' || r.status === 'in_progress').length;
        // 💡 CORRECCIÓN: Usamos el tipo ApiDriver para la comparación
        const totalActiveDrivers = drivers.filter(d => d.status === 'active').length;
        
        const calculatedSummary: DashboardStats = {
            total_drivers: totalActiveDrivers, 
            active_routes: activeRoutesCount,
            
            // Valores simulados
            deliveries_completed_today: Math.floor(Math.random() * 50) + 10,
            overall_progress_percent: Math.floor(Math.random() * 30) + 60,
            deliveries_last_7_days: [], // Agregado para cumplir con DashboardStats
        };
        
        // === 3. SIMULACIÓN DE DATOS FALTANTES EN LISTAS ===
        
        // Rutas: Simulación de progreso y ETA si el backend no los incluye aún
        const simulatedRoutes: RouteSummary[] = routes.map((route, index) => ({
            ...route,
            progress_percent: [75, 40, 90, 20, 50][index % 5], // Mock data
            eta: ['2h 15m', '0h 45m', '0h 10m', '4h 00m', '1h 30m'][index % 5], // Mock data
            waypoints_completed: Math.floor(Math.random() * 10),
            total_waypoints: Math.floor(Math.random() * 10) + 5,
        }));

        // Conductores: Simulación de estado detallado de frontend (usando Mayúscula Inicial)
        // 💡 CORRECCIÓN: Forzamos la variable de entrada 'd' a ser ApiDriver para que la comparación sea válida.
        const simulatedDrivers: DashboardDriver[] = drivers.map((d: ApiDriver) => ({ 
            // Copiamos las propiedades de ApiDriver que son comunes (id, name, email, avatar)
            id: d.id,
            full_name: d.full_name,
            email: d.email,
            avatar_url: d.avatar_url,
            
            // La comparación d.status === 'active' ahora es válida porque d es ApiDriver
            status: d.status === 'active' 
                ? (Math.random() > 0.6 ? 'En Ruta' : 'Disponible') // Mock Status con Mayúscula
                : 'Descanso' // Mock Status con Mayúscula
        }));

        
        return {
            summary: calculatedSummary,
            drivers: simulatedDrivers,
            routes: simulatedRoutes,
            adminFleetCode: adminFleetCode,
        };
    },
    
    // 💡 FUNCIÓN REQUERIDA PARA EL MAPA (getRouteDetail)
    getRouteDetail: async (routeId: string): Promise<DriverRoute> => {
        // Asumiendo que la ruta para obtener el detalle de una ruta es /api/v1/routes/:id
        const response = await apiFetch(`/api/v1/routes/${routeId}`);
        
        // apiFetch ya maneja errores, solo necesitamos el casting del tipo
        return response as DriverRoute;
    }
};