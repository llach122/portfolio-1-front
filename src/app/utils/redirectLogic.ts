// src/utils/redirectLogic.ts
import { useRouter } from 'next/navigation';
import { BackendUser } from '@/Services/auth.service';

type RouterType = ReturnType<typeof useRouter>; 

export async function handleFinalRedirection(
    user: BackendUser, 
    router: RouterType
): Promise<void> {
    
    const { role, status } = user;
    
    // --- 1. CASOS ACTIVOS (ACCESO AL DASHBOARD) ---

    // CASO A: Driver Activo (¡LA CORRECCIÓN SOLICITADA!)
    if (role === 'driver' && status === 'active') {
        console.log('[Redirect] Driver activo. Redirigiendo a /driver-dashboard.');
        router.replace('/driver-dashboard');
        return;
    }
    
    // CASO B: Admin Activo
    if (role === 'admin' && status === 'active') {
        console.log('[Redirect] Admin activo. Redirigiendo a /dashboard.');
        router.replace('/dashboard');
        return;
    }

    // --- 2. CASOS INACTIVOS ---
    
    // CASO C: Admin Inactivo 
    if (role === 'admin' && status === 'inactive') {
        console.log('[Redirect] Admin inactivo. Redirigiendo a /pending.');
        router.replace('/pending');
        return;
    }
    
    // CASO D: Driver Inactivo 
    if (role === 'driver' && status === 'inactive') {
        // Asumiendo que /choose-profile es la página donde se pide el código de flota
        console.log('[Redirect] Driver inactivo. Redirigiendo a /choose-profile para completar registro.');
        router.replace('/choose-profile'); 
        return;
    }

    // --- 3. CASO POR DEFECTO / FALLO ---
    console.log(`[Redirect] Estado no manejado o rol inesperado: ${role}/${status}. Redirigiendo a /unauthorized.`);
    router.replace('/unauthorized');
}