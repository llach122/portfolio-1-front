// src/app/types/RouteData.ts

// ====================================================================
// A. TIPOS BASE: Waypoint, Ruta Detallada (DriverRoute)
// ====================================================================

export interface Waypoint {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    // Status del punto de entrega
    status: 'pending' | 'arrived' | 'completed' | 'failed'; 
    delivery_order: number;
    proof_url?: string;
}

export interface DriverRoute {
    id: string;
    name: string;
    // Status de la ruta
    status: 'assigned' | 'in_progress' | 'completed';
    total_distance_km: number;
    waypoints: Waypoint[]; 
    driver_id: string;
    driver_name: string;
    // Puedes agregar más detalles de la ruta aquí si los necesitas
}

export interface WaypointCompletionResponse {
    waypoint_id: string;
    status: 'completed';
    proof_url: string;
}

// ====================================================================
// B. TIPOS DE DASHBOARD Y CONDUCTORES
// ====================================================================

// --- B1. Driver (Conductores) ---

// Tipo para el conductor tal como viene directamente de la API (API Bruta)
export interface ApiDriver {
    id: string;
    full_name: string;
    email: string;
    // Status que devuelve la API de /users (ej: 'active' o 'inactive')
    status: 'active' | 'inactive' | string; // Permitimos 'string' para flexibilidad de la API
    avatar_url?: string;
}

// Tipo usado para mostrar en el Dashboard y Modal de Asignación (Frontend Display)
export interface DriverSummary {
    id: string;
    full_name: string;
    email: string;
    // Status estandarizado para el Frontend (usando Mayúsculas)
    status: 'Disponible' | 'En Ruta' | 'Descanso';
    avatar_url?: string;
}


// --- B2. Route Summary (Resumen de Ruta) ---

export interface RouteSummary {
    id: string;
    name: string;
    // Status que devuelve la API de /routes
    status: 'draft' | 'assigned' | 'in_progress' | 'completed';
    
    // 💡 PROPIEDADES AÑADIDAS/AJUSTADAS para AssignmentModal
    total_distance_km?: number; // <--- ¡AÑADIR ESTA!
    estimated_duration_min?: number; // <--- ¡AÑADIR ESTA!
    created_atts?: string; // <--- ¡AÑADIR ESTA!
    
    waypoints_completed?: number;
    total_waypoints?: number;
    progress_percent?: number;
    eta?: string;
    driver?: DriverSummary; 
}


// --- B3. Dashboard Data & Stats ---

export interface DashboardStats {
    total_drivers: number;
    active_routes: number;
    deliveries_completed_today: number;
    overall_progress_percent: number;
    deliveries_last_7_days: number[];
}

export interface DashboardData {
    adminFleetCode: string; 
    summary: DashboardStats;
    drivers: DriverSummary[];
    routes: RouteSummary[];
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