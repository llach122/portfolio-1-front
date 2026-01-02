'use client'

import { useState, useEffect } from 'react';
import { Truck, MapPin, Package } from 'lucide-react';
// Asegúrate de que este import sea correcto en tu proyecto
import { supabase } from '@/lib/supabaseClient'; 

export default function LoginPage() {
  
  // =======================================================
  // 1. LÓGICA DE AUTENTICACIÓN (MANTENIDA DEL LOGIN ANTERIOR)
  // =======================================================
  
  const loginWithGoogle = async (): Promise<void> => {
    // Aquí es donde Supabase maneja la redirección a Google y luego al callback.
    // La lógica de Admin/Driver (role/status/fleetCode) que discutimos
    // DEBE implementarse en el archivo /auth/callback (donde Supabase te devuelve)
    // una vez que obtienes la sesión del usuario.
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error de inicio de sesión:', error.message);
    }
  };

  // =======================================================
  // 2. LÓGICA DE ANIMACIÓN (DEL NUEVO DISEÑO)
  // =======================================================
  
  const [currentPoint, setCurrentPoint] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const deliveryPoints = [
    { x: 15, y: 20, id: 1 },
    { x: 70, y: 35, id: 2 },
    { x: 45, y: 60, id: 3 },
    { x: 80, y: 75, id: 4 },
    { x: 25, y: 80, id: 5 },
    { x: 60, y: 50, id: 6 },
    { x: 35, y: 30, id: 7 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoint((prev) => (prev + 1) % deliveryPoints.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const point = deliveryPoints[currentPoint];
    setPosition({ x: point.x, y: point.y });
  }, [currentPoint]);


  // =======================================================
  // 3. ESTRUCTURA Y ESTILOS (DEL NUEVO DISEÑO)
  // =======================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Columna de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-10 transform transition-all duration-500 hover:scale-[1.02]">
            
            {/* Logo y Título */}
            <div className="flex items-center justify-center mb-8 animate-fade-in">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center mb-8 animate-slide-up">
              <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
                TrackWay
              </h1>
              <p className="text-gray-500 text-sm">
                Gestión inteligente de entregas
              </p>
            </div>

            {/* Botón de Google (Funcionalidad Integrada) */}
            <div className="space-y-4 mb-8 animate-slide-up-delay">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <button 
                  onClick={loginWithGoogle} // ⬅️ FUNCIÓN DE LOGIN INSERTADA AQUÍ
                  className="relative w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Ícono SVG de Google (Mantenido) */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Continuar con Google
                  </span>
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 animate-fade-in-delay">
              Al continuar, aceptas nuestros términos y condiciones
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 animate-fade-in-delay-2">
            <p>Seguimiento en tiempo real • Gestión eficiente • Entregas rápidas</p>
          </div>
        </div>
      </div>

      {/* Columna de Animación (Mantenida del Nuevo Diseño) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
        {/* ... Contenido SVG y Animación Mantenido ... */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full h-full max-w-2xl max-h-2xl">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {deliveryPoints.map((point, index) => {
              const nextPoint = deliveryPoints[(index + 1) % deliveryPoints.length];
              return (
                <line
                  key={`line-${point.id}`}
                  x1={point.x}
                  y1={point.y}
                  x2={nextPoint.x}
                  y2={nextPoint.y}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                />
              );
            })}

            {deliveryPoints.map((point, index) => (
              <g key={point.id}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="2"
                  fill="white"
                  className={`transition-all duration-500 ${
                    index === currentPoint ? 'animate-pulse-strong' : ''
                  }`}
                  opacity={index === currentPoint ? 1 : 0.5}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="1.2"
                  fill="rgba(59, 130, 246, 0.8)"
                  className={index === currentPoint ? 'animate-ping-slow' : ''}
                />
              </g>
            ))}

            <g
              className="transition-all duration-2000 ease-in-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <circle cx="0" cy="0" r="3" fill="white" className="drop-shadow-lg" />
              <foreignObject x="-2" y="-2" width="4" height="4">
                <div className="flex items-center justify-center w-full h-full">
                  <Package className="w-3 h-3 text-blue-600" strokeWidth={2.5} />
                </div>
              </foreignObject>
            </g>
          </svg>

          {/* Tarjetas de estadísticas */}
          <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white animate-slide-in-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white animate-slide-in-right">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Truck className="w-5 h-5" />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}