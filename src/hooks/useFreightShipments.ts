import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { TransportMode, ShipmentStatus } from '@/types/logistics';

export interface FreightShipment {
  id: string;
  reference: string;
  mode: TransportMode;
  origin: string;
  destination: string;
  carrier: string;
  vehicle: string;
  driver?: string;
  weight: string;
  volume?: string;
  containers: number;
  packages?: number;
  status: ShipmentStatus;
  eta: string;
  etd?: string;
  consignee: string;
  consignor?: string;
  notes?: string;
  createdAt: string;
  commodity?: string;
  hs_code?: string;
  container_number?: string;
  incoterms?: string;
  insurance_policy?: string;
}

export interface FreightFilters {
  search: string;
  status: ShipmentStatus | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
  origin: string;
  destination: string;
}

const generateMockShipments = (mode: TransportMode): FreightShipment[] => {
  const modePrefix: Record<TransportMode, string> = {
    road: 'RD',
    rail: 'RL',
    air: 'AR',
    sea: 'SE',
  };

  return [
    {
      id: `${mode}-1`,
      reference: `${modePrefix[mode]}-2024-00001`,
      mode,
      origin: 'Karachi',
      destination: 'Lahore',
      carrier: mode === 'sea' ? 'Maersk Line' : mode === 'air' ? 'PIA Cargo' : 'Pakistan Railways',
      vehicle: mode === 'road' ? 'TKR-1234' : mode === 'sea' ? 'MSC GENOVA' : 'Boeing 777',
      driver: 'Ahmed Khan',
      weight: '2500 KG',
      volume: '45 CBM',
      containers: 2,
      packages: 500,
      status: 'in_transit',
      eta: '2024-01-25',
      etd: '2024-01-20',
      consignee: 'Allied Electronics Ltd',
      consignor: 'Samsung Korea',
      commodity: 'Electronics',
      hs_code: '8471.30.0000',
      createdAt: '2024-01-18T10:00:00Z',
    },
    {
      id: `${mode}-2`,
      reference: `${modePrefix[mode]}-2024-00002`,
      mode,
      origin: 'Dubai',
      destination: 'Karachi',
      carrier: mode === 'sea' ? 'Hapag Lloyd' : mode === 'air' ? 'Emirates SkyCargo' : 'NLC',
      vehicle: mode === 'road' ? 'TKR-5678' : mode === 'sea' ? 'EVER GIVEN' : 'Airbus A380',
      driver: 'Ali Hassan',
      weight: '22000 KG',
      volume: '120 CBM',
      containers: 3,
      packages: 100,
      status: 'pending',
      eta: '2024-02-05',
      consignee: 'Textile Mills Pakistan',
      consignor: 'Dubai Trading LLC',
      commodity: 'Textiles',
      hs_code: '5201.00.0000',
      createdAt: '2024-01-20T09:00:00Z',
    },
    {
      id: `${mode}-3`,
      reference: `${modePrefix[mode]}-2024-00003`,
      mode,
      origin: 'Singapore',
      destination: 'Islamabad',
      carrier: mode === 'sea' ? 'OOCL' : mode === 'air' ? 'Singapore Airlines Cargo' : 'Daewoo Express',
      vehicle: mode === 'road' ? 'TKR-9012' : mode === 'sea' ? 'CMA CGM MARCO POLO' : 'Boeing 747F',
      weight: '800 KG',
      containers: 1,
      packages: 200,
      status: 'delivered',
      eta: '2024-01-22',
      etd: '2024-01-15',
      consignee: 'Pharma Solutions Pvt Ltd',
      consignor: 'MedChem Singapore',
      commodity: 'Pharmaceuticals',
      hs_code: '3004.90.0000',
      createdAt: '2024-01-15T14:00:00Z',
    },
  ];
};

export function useFreightShipments(mode: TransportMode) {
  const [shipments, setShipments] = useState<FreightShipment[]>(() => generateMockShipments(mode));
  const [filters, setFilters] = useState<FreightFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
    origin: '',
    destination: '',
  });

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          shipment.reference.toLowerCase().includes(searchLower) ||
          shipment.origin.toLowerCase().includes(searchLower) ||
          shipment.destination.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.status !== 'all' && shipment.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [shipments, filters]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter((s) => s.status === 'in_transit').length;
    const pending = shipments.filter((s) => s.status === 'pending').length;
    const delivered = shipments.filter((s) => s.status === 'delivered').length;
    const customsHold = shipments.filter((s) => s.status === 'customs_hold').length;
    const delayed = shipments.filter((s) => s.status === 'delayed').length;

    return { total, inTransit, pending, delivered, customsHold, delayed };
  }, [shipments]);

  const addShipment = useCallback((newShipment: Omit<FreightShipment, 'id' | 'createdAt'>) => {
    const shipment: FreightShipment = {
      ...newShipment,
      id: `${mode}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setShipments(prev => [shipment, ...prev]);
    toast.success('Shipment created successfully');
  }, [mode]);

  const updateShipment = useCallback((id: string, updates: Partial<FreightShipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Shipment updated');
  }, []);

  const deleteShipment = useCallback((id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    toast.success('Shipment deleted');
  }, []);

  return {
    shipments: filteredShipments,
    allShipments: shipments,
    filters,
    stats,
    addShipment,
    updateShipment,
    deleteShipment,
    updateFilters: (newFilters: Partial<FreightFilters>) => setFilters((prev) => ({ ...prev, ...newFilters })),
    clearFilters: () => setFilters({
      search: '',
      status: 'all',
      dateRange: 'all',
      origin: '',
      destination: '',
    }),
  };
}
