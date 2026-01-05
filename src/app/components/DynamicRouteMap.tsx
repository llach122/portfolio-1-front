// src/app/components/DynamicRouteMap.tsx
import dynamic from 'next/dynamic';
import { DriverRoute } from '@/app/types/RouteData'; 

// Importación dinámica de RouteMap, desactivando el SSR
const DynamicRouteMap = dynamic(
  () => import('./RouteMap'), 
  { 
    ssr: false, // ¡IMPORTANTE! Desactiva el Server-Side Rendering
    loading: () => (
        <div className="flex justify-center items-center h-40 bg-gray-100">
            <p className="text-center p-4 text-gray-500 animate-pulse">Cargando mapa...</p>
        </div>
    )
  }
);

interface DynamicRouteMapWrapperProps {
    route: DriverRoute;
}

// Este componente es el que importarás en el SidePanel
const DynamicRouteMapWrapper: React.FC<DynamicRouteMapWrapperProps> = ({ route }) => {
    return <DynamicRouteMap route={route} />;
};

export default DynamicRouteMapWrapper;