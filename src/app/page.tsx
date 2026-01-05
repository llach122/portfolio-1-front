'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';

// Constantes
const ANIMATION_DURATION_MS = 2500; // Duración total de la animación de carga

/**
 * Componente de Pantalla de Inicio (Splash Screen) para la ruta raíz (/).
 * Muestra la animación de TrackWay con estilo moderno y gestiona la redirección.
 */
export default function SplashPage() {
    const router = useRouter();
    const [isAnimating, setIsAnimating] = useState(true);
    const [animationStep, setAnimationStep] = useState(0); // 0: Logo central, 1: Desvanecer
    
    // --- Lógica de Redirección y Autenticación ---
    useEffect(() => {
        
        // 1. Duración de la animación visible (se desvanece 500ms antes del final)
        const animationTimer = setTimeout(() => {
            setAnimationStep(1); 
        }, ANIMATION_DURATION_MS - 500); 

        // 2. Lógica de Redirección Final
        const redirectTimer = setTimeout(() => {
            
            // LÓGICA DE TOKEN: **VERIFICA Y ADAPTA ESTO** si usas otro método/nombre de clave.
            const token = localStorage.getItem('authToken'); 
            
            if (token) {
                // Si hay token, redirigir al Dashboard
                router.replace('/dashboard'); 
            } else {
                // Si no hay token, redirigir al Login
                router.replace('/login');
            }
            
            setIsAnimating(false);
        }, ANIMATION_DURATION_MS); 

        return () => {
            clearTimeout(animationTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]);


    // --- Estilos de Control de Animación ---
    
    const logoStyles = {
        opacity: animationStep === 0 ? 1 : 0,
        transform: animationStep === 0 ? 'scale(1)' : 'scale(1.2)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
    };
    
    const screenStyles = {
        backgroundColor: animationStep === 0 ? '#000000' : '#000000', 
        opacity: animationStep === 0 ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
    };
    
    if (!isAnimating && animationStep === 1) {
        return null; 
    }

    return (
        <div 
            style={screenStyles}
            className="fixed inset-0 z-[100] flex items-center justify-center min-h-screen"
        >
            <div 
                style={logoStyles}
                className="flex flex-col items-center justify-center"
            >
                {/* Logo Principal: Cuadrado Azul de TrackWay */}
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                    
                    {/* El Cuadrado Azul (Fondo del logo) */}
                    <div className="absolute inset-0 bg-blue-600 rounded-2xl shadow-2xl flex items-center justify-center">
                        
                        {/* El Camión con la Animación de Movimiento (CSS en globals.css) */}
                        <Truck 
                            className="w-16 h-16 md:w-20 md:h-20 text-white animate-trackway-drive" 
                        />
                    </div>
                </div>

                {/* Texto de la Marca: Estilo Moderno y Vivaz */}
                <h1 
                    className="text-4xl md:text-5xl font-extrabold mt-8 tracking-wide animate-pulse-slow"
                    // Aplicamos un degradado de texto con Tailwind
                    style={{
                        background: 'linear-gradient(to right, #ffffff, #80e6ff, #00BFFF, #00AEEF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    TRACKWAY
                </h1>
                
                {/* Eslogan/Texto de Carga opcional */}
                <p className="text-gray-300 text-sm mt-2 font-sans tracking-widest">
                    Logística Inteligente
                </p>
            </div>
        </div>
    );
}