// src/app/choose-profile/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { handleFinalRedirection } from '../utils/redirectLogic';
import { authService } from '@/Services/auth.service';
import { apiFetch } from '@/Services/api';
import { Truck, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';

type ProfileSelection = 'none' | 'admin' | 'driver';

export default function ChooseProfilePage() {
    const { backendUser, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [selection, setSelection] = useState<ProfileSelection>('none'); 
    const [localLoading, setLocalLoading] = useState(false); 
    
    const [fleetCode, setFleetCode] = useState('');
    const [fleetError, setFleetError] = useState(''); 

    // --- LÓGICA DE REDIRECCIÓN EN EFECTO ---
    useEffect(() => {
        if (!authLoading && backendUser && backendUser.role) {
            console.log('[ChooseProfilePage] Redirigiendo basado en perfil de contexto (useEffect).');
            handleFinalRedirection(backendUser, router); 
        }
    }, [backendUser, authLoading, router]);

    // --- MANEJADORES DE ACCIÓN ---

    const handleAdminRegistration = async () => {
        setLocalLoading(true);
        setFleetError(''); 
        try {
            const res = await authService.register({ role: 'admin' });
            
            if (res.user.status === 'inactive') {
                router.replace('/pending'); 
            } else {
                router.replace('/dashboard'); 
            }

        } catch (error) {
            console.error('❌ Error al registrar Administrador:', error);
            alert('Error al registrar rol. Intente de nuevo.');
        } finally {
            setLocalLoading(false);
        }
    };
    
    const handleJoinFleet = async () => {
        if (!fleetCode) {
            setFleetError('Por favor, ingresa el código de flota.');
            return;
        }

        setLocalLoading(true);
        setFleetError('');
        
        try {
            await apiFetch('/api/v1/users/join-fleet', {
                method: 'POST',
                body: JSON.stringify({ code: fleetCode }),
            });
            
            router.replace('/dashboard');
            
        } catch (error: any) {
            console.error('❌ Error al unirse a flota:', error);
            setFleetError('Código de Flota inválido o ya expiró. Intente de nuevo.');
            
        } finally {
            setLocalLoading(false);
        }
    }


    // --- RENDERS DE ESTADO ---
    
    const loadingState = authLoading || localLoading;
    
    if (loadingState) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg flex items-center justify-center animate-pulse">
                    <Truck className="w-8 h-8 text-white" />
                </div>
                <p className="mt-4 text-gray-700 font-medium">
                    {localLoading ? 'Procesando registro...' : 'Verificando perfil...'}
                </p>
            </div>
        );
    }
    
    // Si llegamos aquí, el usuario es NUEVO.
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Header />
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Elige tu Rol
                </h1>
                
                {/* 5. RENDERIZADO PRINCIPAL DE SELECCIÓN */}
                {selection === 'none' && (
                    <>
                        <p className="text-gray-500 mb-8 text-center">
                            Selecciona el tipo de acceso. Los administradores necesitan aprobación.
                        </p>
                        <div className="space-y-4">
                            {/* Botón para Elegir Admin */}
                            <button 
                                onClick={handleAdminRegistration}
                                className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                            >
                                Soy Administrador
                            </button>
                            
                            {/* Botón para Elegir Driver (Activa la vista de Código de Flota) */}
                            <button 
                                onClick={() => setSelection('driver')}
                                className="w-full py-4 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
                            >
                                Soy Conductor (Ingresar Código)
                            </button>
                        </div>
                    </>
                )}
                
                {/* 6. RENDERIZADO DEL FORMULARIO DE CÓDIGO DE FLOTA (DRIVER) */}
                {selection === 'driver' && (
                    <div className="space-y-6">
                        <p className="text-gray-600 text-center">
                            Ingresa el código de invitación proporcionado por el administrador de tu flota.
                        </p>
                        
                        {fleetError && (
                            <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 font-medium">
                                <AlertTriangle className="w-5 h-5" />
                                {fleetError}
                            </div>
                        )}

                        <input
                            type="text"
                            value={fleetCode}
                            onChange={(e) => setFleetCode(e.target.value)}
                            placeholder="Código de Flota (Ej: A7X-99)"
                            className={`w-full p-3 border ${fleetError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />

                        <div className="flex justify-between gap-4">
                            <button 
                                onClick={() => {
                                    setSelection('none');
                                    setFleetError('');
                                    setFleetCode('');
                                }}
                                disabled={localLoading}
                                className="py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Volver
                            </button>
                            <button 
                                onClick={handleJoinFleet}
                                disabled={localLoading || !fleetCode}
                                className={`py-3 px-6 text-white rounded-xl font-semibold transition-colors 
                                    ${localLoading || !fleetCode ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600'}`}
                            >
                                {localLoading ? 'Uniéndose...' : 'Unirme a Flota'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}