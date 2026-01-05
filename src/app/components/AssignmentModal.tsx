// src/app/components/AssignmentModal.tsx

import React, { useState } from 'react';
import { X, Truck, User } from 'lucide-react';

// TIPOS CONSOLIDADOS
import { RouteSummary, DriverSummary as DashboardDriver } from '@/app/types/RouteData'; 

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    route: RouteSummary | null; 
    drivers: DashboardDriver[]; 
    onAssignmentSuccess: (updatedRoute: RouteSummary) => void; 
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, route, drivers, onAssignmentSuccess }) => {
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !route) return null;

    const currentDriver = route.driver;
    const availableDrivers = drivers.filter(d => d.status === 'Disponible' || d.id === currentDriver?.id);

    const handleAssign = async () => {
        if (!selectedDriverId) return;

        setIsSubmitting(true);
        try {
            // Simulación de éxito de la API:
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            
            const selectedDriver = drivers.find(d => d.id === selectedDriverId);

            if (selectedDriver) {
                // Simulación de la respuesta actualizada del backend
                const updatedRoute: RouteSummary = {
                    ...route,
                    driver: selectedDriver,
                    status: 'assigned', 
                    
                    total_distance_km: route.total_distance_km || 50,
                    estimated_duration_min: route.estimated_duration_min || 120,
                    created_atts: route.created_atts || new Date().toISOString(),
                };
                
                onAssignmentSuccess(updatedRoute);
            }
        } catch (error) {
            console.error("Error al asignar la ruta:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                
                {/* Encabezado */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Truck className="text-blue-500" />
                        Asignar Ruta: {route.name}
                    </h2>
                    <button onClick={onClose} disabled={isSubmitting} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Conductor Actual */}
                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600">
                        {currentDriver ? "Conductor Actual" : "Ruta No Asignada"}
                    </p>
                    <div className="flex items-center mt-1">
                        <User className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-semibold text-blue-800">
                            {currentDriver?.full_name || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Selección de Conductor */}
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Seleccionar Nuevo Conductor</h3>
                <select
                    value={selectedDriverId || ''}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                    <option value="" disabled>Selecciona un conductor</option>
                    {availableDrivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                            {driver.full_name} ({driver.status})
                        </option>
                    ))}
                </select>

                {/* Botón de Asignación */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleAssign}
                        disabled={!selectedDriverId || isSubmitting}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Asignando...' : 'Asignar Ruta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentModal;