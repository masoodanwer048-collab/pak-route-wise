import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface Vehicle {
  id: string;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  capacity: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  driver_id?: string | null;
}

const generateMockVehicles = (): Vehicle[] => [
  {
    id: '1',
    registration_number: 'ABC-1234',
    make: 'Hino',
    model: '500 Series',
    year: 2022,
    capacity: '20 tons',
    status: 'Active',
    driver_id: 'drv-001',
  },
  {
    id: '2',
    registration_number: 'XYZ-5678',
    make: 'Isuzu',
    model: 'NPR',
    year: 2021,
    capacity: '10 tons',
    status: 'Active',
    driver_id: 'drv-002',
  },
  {
    id: '3',
    registration_number: 'LMN-9012',
    make: 'Mercedes',
    model: 'Actros',
    year: 2023,
    capacity: '40 tons',
    status: 'Maintenance',
    driver_id: null,
  },
];

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(generateMockVehicles);
  const [isLoading] = useState(false);

  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
    };
    setVehicles(prev => [newVehicle, ...prev]);
    toast.success('Vehicle added');
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    toast.success('Vehicle updated');
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    toast.success('Vehicle deleted');
  }, []);

  return {
    vehicles,
    isLoading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
