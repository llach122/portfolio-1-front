// src/Services/routes.service.ts

// NOTA: Asume que apiFetch se encuentra en la ruta correcta
import { apiFetch } from '@/Services/api'; 

interface AssignmentPayload {
    route_id: string;
    driver_id: string;
}

export const routesService = {
    /**
     * Llama al endpoint POST /api/v1/routes/assign para asignar un conductor a una ruta.
     * Si la llamada es exitosa, el backend lo registra y la función retorna sin error.
     * @param payload {route_id: string, driver_id: string}
     */
    assignDriverToRoute: async (payload: AssignmentPayload): Promise<void> => {
        await apiFetch('/api/v1/routes/assign', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        // Si apiFetch no lanza un error, la asignación fue exitosa (200 OK del backend).
    },
};