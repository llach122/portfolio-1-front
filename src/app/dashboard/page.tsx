'use client'

import { useState, useEffect } from 'react';
import { Truck, MapPin, Package, Clock, User, ArrowRight, TrendingUp } from 'lucide-react';
import Header from '../components/Header';

export default function Dashboard() {
  // Lógica de simulación para gráficos y datos del dashboard (puedes reemplazarla con tus APIs)
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Juan Pérez', status: 'Disponible', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'María García', status: 'En Ruta', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Carlos Ruíz', status: 'Descanso', avatar: 'https://randomuser.me/api/portraits/men/88.jpg' },
    { id: 4, name: 'Ana López', status: 'Disponible', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
  ]);

  const [routes, setRoutes] = useState([
    { id: 101, name: 'Ruta Sur Express', progress: 75, driver: 'Juan Pérez', eta: '2h 15m' },
    { id: 102, name: 'Centro Urbano 1', progress: 40, driver: 'María García', eta: '0h 45m' },
    { id: 103, name: 'Norte Industrial', progress: 90, driver: 'Ana López', eta: '0h 10m' },
    { id: 104, name: 'Costa Oeste', progress: 20, driver: 'Juan Pérez', eta: '4h 00m' },
  ]);

  // Simulación de una animación para el gráfico de progreso general
  const [overallProgress, setOverallProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverallProgress(65); // Simula que el progreso general es 65%
    }, 500);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
      <Header />
      
      {/* Columna Principal - Rutas y Gráficos */}
      <div className="flex-1 space-y-8">
        
        {/* Encabezado del Dashboard */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-2xl shadow-lg animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-4 sm:mb-0">Panel de Control TrackWay</h1>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5">
            <TrendingUp className="w-5 h-5" />
            Ver Reportes
          </button>
        </div>

        {/* Sección de Resumen y Gráfico General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta de Resumen Rápido */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-500" />
              Estado General de Entregas
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Rutas Activas</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">12</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Paquetes en Tránsito</p>
                <p className="text-3xl font-bold text-cyan-700 mt-1">289</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">Actualizado hace 5 minutos</p>
          </div>

          {/* Gráfico de Progreso General (Placeholder) */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-slide-up-delay">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-cyan-500" />
              Progreso General de Envíos
            </h2>
            <div className="flex items-center justify-center h-40 relative">
              <div className="relative w-32 h-32">
                {/* Círculo base del gráfico */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-blue-500 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={(2 * Math.PI * 40) - (2 * Math.PI * 40 * overallProgress / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-700">{overallProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Rutas Recibidas */}
        <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-delay-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-green-500" />
            Rutas Recibidas Recientes
          </h2>
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex-1 mb-2 md:mb-0">
                  <p className="font-semibold text-gray-700">{route.name}</p>
                  <p className="text-sm text-gray-500">Conductor: {route.driver} • ETA: {route.eta}</p>
                </div>
                <div className="w-full md:w-48 bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${route.progress}%` }}
                  ></div>
                  <span className="absolute right-0 top-0 -mr-8 -mt-5 text-xs text-gray-600 font-medium">{route.progress}%</span>
                </div>
                <button className="ml-0 md:ml-4 mt-2 md:mt-0 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                  Detalles <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Lateral - Conductores */}
      <div className="w-full lg:w-96 bg-white rounded-2xl shadow-xl p-6 space-y-6 animate-slide-in-right">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="text-purple-500" />
          Conductores
        </h2>
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <img 
                src={driver.avatar} 
                alt={driver.name} 
                className="w-10 h-10 rounded-full mr-3 border-2 border-blue-400" 
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-700">{driver.name}</p>
                <p className="text-sm text-gray-500">{driver.status}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                driver.status === 'Disponible' ? 'bg-green-100 text-green-700' :
                driver.status === 'En Ruta' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {driver.status}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
          Gestionar Conductores
        </button>
      </div>
    </div>
  );
}