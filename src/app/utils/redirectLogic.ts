// src/utils/redirectLogic.ts
import { useRouter } from 'next/navigation';
import { BackendUser } from '@/Services/auth.service';

type RouterType = ReturnType<typeof useRouter>; 

export async function handleFinalRedirection(
    user: BackendUser, 
    router: RouterType
): Promise<void> {
    
    const { role, status } = user;
    
    // 1. CASO ACTIVO: ACCESO DIRECTO AL DASHBOARD
    if (status === 'active') {
        console.log('[Redirect] Usuario activo. Redirigiendo a /dashboard.');
        router.replace('/dashboard');
        return;
    }
    
    // 2. CASOS INACTIVOS 

    // CASO A: Admin Inactivo 
    if (role === 'admin' && status === 'inactive') {
        console.log('[Redirect] Admin inactivo. Redirigiendo a /pending.');
        router.replace('/pending');
        return;
    }
    
    // CASO B: Driver Inactivo 
    if (role === 'driver' && status === 'inactive') {
        console.log('[Redirect] Driver inactivo. Redirigiendo a /choose-profile para completar registro.');
        router.replace('/choose-profile'); 
        return;
    }

    // 3. CASO POR DEFECTO / FALLO
    console.log(`[Redirect] Estado no manejado o rol inesperado: ${role}. Redirigiendo a /unauthorized.`);
    router.replace('/unauthorized');
}