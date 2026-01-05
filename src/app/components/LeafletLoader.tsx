// src/app/components/LeafletLoader.tsx
'use client';

import { useEffect } from 'react';
// IMPORTAMOS LA LIBRERÍA Y EL CSS AQUÍ, donde 'window' existe.
import 'leaflet/dist/leaflet.css';
import 'leaflet'; 

export const LeafletLoader: React.FC = () => {
    // Este componente no renderiza nada, solo asegura la importación de Leaflet y CSS
    // El useEffect asegura que el código Leaflet solo se ejecute tras el primer render del cliente.
    useEffect(() => {
         console.log("Leaflet y CSS cargados en el cliente.");
    }, []);
    return null; 
};

export default LeafletLoader;