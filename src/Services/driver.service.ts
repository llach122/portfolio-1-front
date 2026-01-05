// src/Services/driver.service.ts

import { apiFetch } from '@/Services/api'; // Función para fetch
import { DriverRoute, WaypointCompletionResponse } from '@/app/types/RouteData';

export const driverService = {
    /**
     * Obtiene la ruta actualmente asignada al conductor autenticado.
     * Endpoint asumido: GET /api/v1/routes/me/current
     */
    getCurrentRoute: async (): Promise<DriverRoute | null> => {
        // NOTA: Reemplaza este endpoint por el real de tu backend si es diferente.
        // Se asume que el backend usa el token JWT del conductor para identificarlo.
        try {
            const response = await apiFetch('/api/v1/routes/me/current');
            return response as DriverRoute;
        } catch (error) {
            // Si no hay ruta asignada, el backend podría devolver un 404/204.
            console.error("No se encontró ruta asignada:", error);
            return null;
        }
    },
    
    /**
     * Completa un Waypoint enviando la prueba de entrega (foto).
     * Endpoint asumido: POST /api/v1/waypoints/complete
     * * @param waypointId El ID del punto de entrega.
     * @param photoFile El archivo de la foto (o un Base64/Blob, dependiendo de la API).
     */
    completeWaypoint: async (waypointId: string, photoFile: File): Promise<WaypointCompletionResponse> => {
        // NOTA: En la vida real, el backend primero solicitaría un URL firmado
        // para subir el archivo directamente al storage (Supabase/S3), 
        // y luego llamaría a /complete con el URL final.
        
        const formData = new FormData();
        formData.append('waypoint_id', waypointId);
        formData.append('proof_of_delivery', photoFile);

        // Se asume que apiFetch soporta FormData para la subida
        const response = await apiFetch('/api/v1/waypoints/complete', {
            method: 'POST',
            body: formData,
            // NOTA: No establecer 'Content-Type': 'application/json' al usar FormData
        });

        return response as WaypointCompletionResponse;
    },
};