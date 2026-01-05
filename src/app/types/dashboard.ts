

// --- 1. CONDUCTORES (Basado en GET /api/v1/users) ---

import { DriverRoute } from "./RouteData";

// La API devuelve 'active' o 'inactive'. El frontend lo mapeará a 'Disponible', 'En Ruta', etc.
export interface DashboardDriver {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    // Status del backend ('active' | 'inactive') pero lo mapeamos a uno de frontend para la UI.
    status: 'active' | 'inactive' | 'Disponible' | 'En Ruta' | 'Descanso'; 
}


// --- 2. RUTAS (Basado en domains/route.go y GET /api/v1/routes) ---
export interface RouteSummary {
    id: string;
    name: string;
    status: string; // 'draft', 'assigned', 'in_progress', 'completed'
    total_distance_km: number;
    estimated_duration_min: number;
    created_at: string; // ISO Date string
    
    driver?: {
        id: string;
        full_name: string;
    } | null;
    
    // Estos campos serán simulados en el servicio si el backend no los provee en la lista /routes
    progress_percent?: number; // 0 a 100
    eta?: string; // Ejemplo: "2h 15m"
}


// --- 3. DASHBOARD STATS (MÉTRICAS CALCULADAS) ---
// Calcularemos estas métricas a partir de las listas de Conductores y Rutas.
export interface DashboardStats {
    total_drivers: number; // Calculado de la lista de /users
    active_routes: number; // Calculado de la lista de /routes (filtrando por status)
    
    // Estos valores deben ser simulados o puestos a 0 ya que no tenemos el endpoint /stats
    deliveries_completed_today: number; 
    overall_progress_percent: number;
    
    // Dejamos este campo opcional, ya que el endpoint de stats no está listo
    deliveries_last_7_days?: {
        date: string;
        count: number;
    }[];
}

// Interfaz para la respuesta combinada del servicio de frontend
export interface DashboardData {
    summary: DashboardStats;
    drivers: DashboardDriver[];
    routes: RouteSummary[];
    adminFleetCode: string | null;
}
export interface DriverStats {
    total_routes_today: number;
    completed_routes_today: number;
    deliveries_completed: number;
    // Agrega otras estadísticas relevantes para el conductor
}

export interface DriverDashboardData {
    summary: DriverStats;
    current_route: DriverRoute | null;
    route_history: DriverRoute[];
    driver_profile: any; // Usa BackendUser/ApiDriver
}