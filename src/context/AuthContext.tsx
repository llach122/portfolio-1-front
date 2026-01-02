// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { authService, BackendUser } from '@/Services/auth.service' 

type AuthContextType = {
  user: User | null
  backendUser: BackendUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  backendUser: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🟡 [Context] Ejecutando inicio de autenticación')

    const initAuth = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        console.log('🔴 [Context] No hay sesión activa')
        setLoading(false)
        return
      }

      console.log('🟢 [Context] Sesión existente encontrada')
      setUser(data.user)

      try {
        const res = await authService.me()
        
        // Solución de compromiso (tipado vs runtime): 
        // Usamos la propiedad 'user' si existe (tipado), o usamos 'res' (runtime).
        const data = res as any; 
        const userProfile: BackendUser = data.user || data; 
        
        // Logs de diagnóstico (mantener para futuros chequeos)
        console.log('--- DEBUG RES PENDIENTE (authService.me) ---', res); 
        console.log('--- DEBUG USERPROFILE EXTRAÍDO ---', userProfile);


        // --- VERIFICACIÓN DE INTEGRIDAD ---
        if (!userProfile || !userProfile.role) {
             console.warn('⚠️ [Context] Perfil extraído incompleto. Redirigiendo a /choose-profile');
             router.replace('/choose-profile');
             setBackendUser(null);
             return;
        }

        setBackendUser(userProfile) 
        
        // Uso de .trim() y .toLowerCase() para comparación robusta
        const role = userProfile.role ? userProfile.role.toLowerCase().trim() : '';
        const status = userProfile.status ? userProfile.status.toLowerCase().trim() : '';
        
        console.log('✅ DEBUG PROFILE CHECK (ROBUSTO):', { role, status });

        // =============================================================
        // LÓGICA DE REDIRECCIÓN (200 OK)
        // =============================================================
        
        // 1. Admin Activo -> Dashboard (Redirección Inmediata)
        if (role === 'admin' && status === 'active') {
             console.log('✅ [Context] Admin ACTIVO detectado. Redirigiendo a /dashboard.');
             router.replace('/dashboard');
             return;
        }

        // 2. Admin Inactivo -> Pending
        if (role === 'admin' && status === 'inactive') {
            console.log('🟡 [Context] Admin inactivo (vía 200 OK) detectado. Redirigiendo directamente a /pending.');
            router.replace('/pending');
            return;
        }
        
        // **IMPORTANTE**: Si es Driver Inactivo (role=driver, status=inactive) 
        // y llega aquí con 200 OK, el flujo continúa y la ChooseProfilePage 
        // lo redirigirá correctamente a /choose-profile vía handleFinalRedirection.
        
      } catch (error: any) { 
        
        // =============================================================
        // MANEJO DE ERROR (403/404)
        // =============================================================
        
        // 🚨 CORRECCIÓN CLAVE: Removemos la lógica específica de ACCOUNT_INACTIVE del catch.
        // Esto fuerza a que todos los errores de API (incluido el 403 del driver inactivo) 
        // caigan en el default, que es /choose-profile, el destino correcto para drivers.
        
        // 1. Default: Perfil no existe (404 o cualquier otro error de API)
        console.warn('⚠️ [Context] Error de API (asumiendo 404/Error no manejado). Redirigiendo a /choose-profile');
        setBackendUser(null)
        router.replace('/choose-profile')
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Manejo de eventos de supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        console.log('🔴 [Context] Sesión cerrada')
        setUser(null)
        setBackendUser(null)
        setLoading(false);
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <AuthContext.Provider value={{ user, backendUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)