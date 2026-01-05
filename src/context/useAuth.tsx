// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define tu tipo de usuario/rol aquí
type UserRole = 'ADMIN' | 'DRIVER' | null;

interface AuthContextType {
    userRole: UserRole;
    isLoading: boolean;
    // ... otras funciones de login/logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 🛑 LÓGICA CLAVE: Aquí es donde cargarías el token, 
        // y harías la llamada a /api/v1/users/me para obtener el rol
        const loadUserRole = async () => {
            // Ejemplo de simulación: reemplaza esto con tu apiFetch
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // Lógica real: Decodificar el token o llamar a /me
            const roleFromApi: UserRole = Math.random() > 0.5 ? 'ADMIN' : 'DRIVER';
            
            setUserRole(roleFromApi);
            setIsLoading(false);
        };
        loadUserRole();
    }, []);

    return (
        <AuthContext.Provider value={{ userRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// 💡 ESTE ES EL HOOK useAuth que el RoleGuard necesita
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};