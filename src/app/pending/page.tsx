'use client'
import { Clock, Mail, Phone, Truck } from "lucide-react";
import Header from "../components/Header";
const Pending = () => {
  return (
    // Fondo claro similar al Dashboard
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
       <Header />
      <div className="w-full max-w-lg">
        
        {/* Logo (Coherente con Login) */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            {/* Ícono de Truck/TrackWay con el degradado principal */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-800 tracking-tight">TrackWay</span>
          </div>
          <p className="text-gray-500 text-sm">Sistema de Gestión de Rutas</p>
        </div>

        {/* Main Card (Estilo limpio del Dashboard) */}
        <div className="bg-white rounded-2xl p-10 shadow-2xl border border-gray-100 animate-slide-up">
          
          {/* Status Icon (Usando los colores de marca Azul/Cian para el estado de espera) */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-md">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Cuenta en Revisión
          </h1>

          {/* Description (Eliminando el tiempo de respuesta específico) */}
          <p className="text-gray-600 text-center mb-10 leading-relaxed">
            Tu cuenta ha sido enviada a verificación. Pronto recibirás un correo electrónico de confirmación de nuestro equipo.
            Agradecemos tu paciencia.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-8 shadow-sm">
            <p className="text-blue-700 text-sm font-medium text-center">
              Te notificaremos por correo electrónico cuando tu acceso esté activo.
            </p>
          </div>

          {/* Contact (Botones con degradado y estilo secundario) */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            
            {/* Botón Principal (Mismo degradado que el Dashboard) */}
            <a 
              href="mailto:soporte@trackway.com" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 
                bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-semibold 
                rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-700 
                transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5" />
              Contactar Soporte
            </a>
            
            {/* Botón Secundario (Estilo de botón lateral del Dashboard) */}
            <a 
              href="tel:+123456789" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 
                bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 
                transition-colors shadow-md"
            >
              <Phone className="w-5 h-5" />
              Llamar
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2025 TrackWay. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Pending;