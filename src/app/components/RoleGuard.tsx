// src/components/RoleGuard.tsx
'use client'

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Truck } from 'lucide-react';

// 🛑 IMPORTANTE: Reemplaza esto con tu hook/contexto real de autenticación
// Debe devolver { userRole: 'ADMIN' | 'DRIVER' | null, isLoading: boolean }
import { useAuth } from '@/context/useAuth'; 

interface RoleGuardProps {
    children: ReactNode;
}

export const RoleGuard = ({ children }: RoleGuardProps) => {
    const router = useRouter();
    const pathname = usePathname();
    // 🛑 Usar tu lógica real de autenticación aquí
    const { userRole, isLoading } = useAuth(); 

    // Usamos el estado para evitar renderizar el contenido antes de la verificación
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        // 1. Definir rutas objetivo y roles esperados
        const isDriverPage = pathname.startsWith('/driver-dashboard');
        const isAdminPage = pathname.startsWith('/dashboard') && pathname !== '/driver-dashboard'; // Excluye explícitamente driver-dashboard si está bajo /dashboard

        // 2. Lógica de Redirección

        if (userRole === 'DRIVER' && isAdminPage) {
            console.log("GUARD: Driver intentó acceder a Admin. Redirigiendo...");
            router.replace('/driver-dashboard');
            setIsAuthorized(false);
            return;
        }

        if (userRole === 'ADMIN' && isDriverPage) {
            console.log("GUARD: Admin intentó acceder a Driver. Redirigiendo...");
            router.replace('/dashboard');
            setIsAuthorized(false);
            return;
        }

        // Si la ruta es pública (ej: /login, /register) o si el rol coincide, autorizar
        if (isAdminPage || isDriverPage || pathname === '/' || pathname === '/login') {
            setIsAuthorized(true);
        } else {
             // Lógica para rutas no protegidas o después de la verificación inicial
             setIsAuthorized(true);
        }

    }, [userRole, isLoading, pathname, router]);

    if (isLoading || !isAuthorized) {
        // Muestra un loader mientras el hook de autenticación carga o mientras se produce la redirección
        return (
             <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                 <Truck className="w-12 h-12 text-blue-500 animate-bounce" />
                 <p className="mt-4 text-lg font-medium text-gray-700">Verificando tu Rol y Permisos...</p>
            </div>
        );
    }

    return children;
};