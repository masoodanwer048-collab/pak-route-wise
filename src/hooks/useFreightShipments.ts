import { useState, useMemo, useCallback } from 'react';
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
}

export interface FreightFilters {
  search: string;
  status: ShipmentStatus | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
  origin: string;
  destination: string;
}

const generateMockShipments = (mode: TransportMode, count: number): FreightShipment[] => {
  const statuses: ShipmentStatus[] = ['pending', 'in_transit', 'customs_hold', 'cleared', 'delivered', 'delayed'];
  
  const modeConfig = {
    road: {
      prefix: 'TRK',
      carriers: ['National Logistics', 'Express Trucking', 'Pak Carriers', 'Swift Transport'],
      vehicles: ['ABC-1234', 'XYZ-5678', 'KHI-9012', 'LHR-3456'],
      drivers: ['Muhammad Ali', 'Ahmed Khan', 'Hamid Shah', 'Imran Malik'],
      origins: ['Karachi Port', 'Port Qasim', 'Lahore Dry Port', 'Peshawar'],
      destinations: ['Lahore Dry Port', 'Faisalabad Dry Port', 'Multan Dry Port', 'Torkham Border'],
    },
    sea: {
      prefix: 'SEA',
      carriers: ['Maersk Line', 'MSC', 'CMA CGM', 'Hapag-Lloyd', 'Evergreen'],
      vehicles: ['MV Ever Given', 'MSC Oscar', 'CMA CGM Marco Polo', 'Maersk Triple E'],
      origins: ['Shanghai, China', 'Singapore', 'Dubai, UAE', 'Rotterdam, Netherlands'],
      destinations: ['Karachi Port', 'Port Qasim', 'Gwadar Port', 'PICT'],
    },
    air: {
      prefix: 'AIR',
      carriers: ['PIA Cargo', 'Emirates SkyCargo', 'Qatar Airways Cargo', 'Turkish Cargo'],
      vehicles: ['PK-701', 'EK-5891', 'QR-8012', 'TK-6002'],
      origins: ['Dubai Airport', 'Singapore Changi', 'London Heathrow', 'Frankfurt Airport'],
      destinations: ['Jinnah International', 'Allama Iqbal Airport', 'Islamabad Airport'],
    },
    rail: {
      prefix: 'RAL',
      carriers: ['Pakistan Railways', 'ML-1 Cargo', 'Freight Rail Services'],
      vehicles: ['RAIL-001', 'RAIL-002', 'RAIL-003', 'RAIL-004'],
      drivers: ['Rail Master A', 'Rail Master B'],
      origins: ['Karachi Cantt Station', 'Lahore Junction', 'Peshawar Cantt'],
      destinations: ['Lahore Junction', 'Faisalabad Station', 'Rawalpindi Station'],
    },
  };

  const config = modeConfig[mode];
  const consignees = ['ABC Trading Co.', 'XYZ Industries', 'Global Exports Pvt', 'Tech Solutions Ltd', 'Afghan Transit Ltd'];
  const drivers = 'drivers' in config ? config.drivers : undefined;

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + Math.floor(Math.random() * 14));
    const etdDate = new Date();
    etdDate.setDate(etdDate.getDate() - Math.floor(Math.random() * 7));

    return {
      id: `${config.prefix}-2024-${String(i + 1).padStart(4, '0')}`,
      reference: `${config.prefix}-2024-${String(i + 1).padStart(4, '0')}`,
      mode,
      origin: config.origins[Math.floor(Math.random() * config.origins.length)],
      destination: config.destinations[Math.floor(Math.random() * config.destinations.length)],
      carrier: config.carriers[Math.floor(Math.random() * config.carriers.length)],
      vehicle: config.vehicles[Math.floor(Math.random() * config.vehicles.length)],
      driver: drivers?.[Math.floor(Math.random() * (drivers?.length || 0))],
      weight: `${Math.floor(Math.random() * 40000 + 5000).toLocaleString()} kg`,
      volume: mode === 'sea' || mode === 'air' ? `${Math.floor(Math.random() * 200 + 20)} CBM` : undefined,
      containers: mode === 'road' || mode === 'rail' ? Math.floor(Math.random() * 4 + 1) : Math.floor(Math.random() * 10 + 1),
      packages: Math.floor(Math.random() * 500 + 50),
      status,
      eta: etaDate.toISOString().split('T')[0],
      etd: etdDate.toISOString().split('T')[0],
      consignee: consignees[Math.floor(Math.random() * consignees.length)],
      consignor: consignees[Math.floor(Math.random() * consignees.length)],
      notes: '',
      createdAt: new Date().toISOString(),
    };
  });
};

export function useFreightShipments(mode: TransportMode) {
  const [shipments, setShipments] = useState<FreightShipment[]>(() => generateMockShipments(mode, 12));
  const [filters, setFilters] = useState<FreightFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
    origin: '',
    destination: '',
  });

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          shipment.reference.toLowerCase().includes(searchLower) ||
          shipment.carrier.toLowerCase().includes(searchLower) ||
          shipment.vehicle.toLowerCase().includes(searchLower) ||
          shipment.driver?.toLowerCase().includes(searchLower) ||
          shipment.origin.toLowerCase().includes(searchLower) ||
          shipment.destination.toLowerCase().includes(searchLower) ||
          shipment.consignee.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && shipment.status !== filters.status) {
        return false;
      }

      // Origin filter
      if (filters.origin && !shipment.origin.toLowerCase().includes(filters.origin.toLowerCase())) {
        return false;
      }

      // Destination filter
      if (filters.destination && !shipment.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
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

  const addShipment = useCallback((shipment: Omit<FreightShipment, 'id' | 'createdAt'>) => {
    const newShipment: FreightShipment = {
      ...shipment,
      id: `${mode.toUpperCase().slice(0, 3)}-2024-${String(Date.now()).slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setShipments((prev) => [newShipment, ...prev]);
    return newShipment;
  }, [mode]);

  const updateShipment = useCallback((id: string, updates: Partial<FreightShipment>) => {
    setShipments((prev) =>
      prev.map((shipment) => (shipment.id === id ? { ...shipment, ...updates } : shipment))
    );
  }, []);

  const deleteShipment = useCallback((id: string) => {
    setShipments((prev) => prev.filter((shipment) => shipment.id !== id));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<FreightFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: 'all',
      origin: '',
      destination: '',
    });
  }, []);

  return {
    shipments: filteredShipments,
    allShipments: shipments,
    filters,
    stats,
    addShipment,
    updateShipment,
    deleteShipment,
    updateFilters,
    clearFilters,
  };
}
