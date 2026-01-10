import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TransportMode, ShipmentStatus } from '@/types/logistics';

export interface FreightShipment {
  id: string; // UUID from DB
  reference: string; // shipment_id from DB
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
  // Bonded Carrier Fields
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

// Mapper to convert DB row to Frontend Model
const mapToFreightShipment = (row: any): FreightShipment => ({
  id: row.id,
  reference: row.shipment_id,
  mode: 'road', // Defaulting to road
  origin: row.origin,
  destination: row.destination,
  carrier: 'N/A',
  vehicle: row.vehicle_id || 'Unknown',
  driver: row.driver_id,
  weight: row.weight?.toString() || '',
  volume: '',
  containers: row.packages ? 1 : 0,
  packages: row.packages,
  status: row.status as ShipmentStatus,
  eta: row.eta,
  etd: row.etd || '',
  consignee: 'Unknown', // row.customer?.name
  consignor: '',
  notes: '',
  createdAt: row.created_at,
  commodity: row.commodity,
  hs_code: row.hs_code,
  container_number: row.container_number,
  incoterms: row.incoterms,
  insurance_policy: row.insurance_policy,
});

export function useFreightShipments(mode: TransportMode) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FreightFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
    origin: '',
    destination: '',
  });

  const { data: shipments = [] } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);

        // Handle specific error codes
        if (error.code === '42P01') { // undefined_table
          // This is "Schema not applied"
          toast.error('Database setup required: "shipments" table missing.');
        } else {
          // Generic error
          toast.error(`Failed to fetch shipments: ${error.message}`);
        }

        // Return empty array so UI shows "No shipments found" instead of crashing
        return [];
      }

      return data.map(mapToFreightShipment);
    },
  });

  // Filter Logic
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          shipment.reference.toLowerCase().includes(searchLower) ||
          shipment.origin.toLowerCase().includes(searchLower) ||
          shipment.destination.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && shipment.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [shipments, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter((s) => s.status === 'in_transit').length;
    const pending = shipments.filter((s) => s.status === 'pending').length;
    const delivered = shipments.filter((s) => s.status === 'delivered').length;
    const customsHold = shipments.filter((s) => s.status === 'customs_hold').length;
    const delayed = shipments.filter((s) => s.status === 'delayed').length;

    return { total, inTransit, pending, delivered, customsHold, delayed };
  }, [shipments]);

  // Mutations
  const addShipmentMutation = useMutation({
    mutationFn: async (newShipment: Omit<FreightShipment, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('shipments')
        .insert({
          shipment_id: newShipment.reference,
          origin: newShipment.origin,
          destination: newShipment.destination,
          status: newShipment.status,
          eta: newShipment.eta, // Ensure date format if needed
          etd: newShipment.etd || null,
          commodity: newShipment.commodity,
          hs_code: newShipment.hs_code,
          container_number: newShipment.container_number,
          incoterms: newShipment.incoterms,
          insurance_policy: newShipment.insurance_policy,
          weight: parseFloat(newShipment.weight) || 0,
          packages: newShipment.packages || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return mapToFreightShipment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment created successfully');
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast.error(`Error creating shipment: ${error.message}`);
    },
  });

  const updateShipmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FreightShipment> }) => {
      const dbUpdates: any = {
        origin: updates.origin,
        destination: updates.destination,
        status: updates.status,
        eta: updates.eta,
        etd: updates.etd,
        commodity: updates.commodity,
        hs_code: updates.hs_code,
        container_number: updates.container_number,
        incoterms: updates.incoterms,
        insurance_policy: updates.insurance_policy,
      };
      // Cleanup undefined
      Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

      const { error } = await supabase
        .from('shipments')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment updated');
    },
    onError: (error: any) => {
      toast.error(`Error updating: ${error.message}`);
    }
  });

  const deleteShipmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('shipments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment deleted');
    },
  });

  return {
    shipments: filteredShipments,
    allShipments: shipments,
    filters,
    stats,
    addShipment: addShipmentMutation.mutate,
    updateShipment: (id: string, updates: Partial<FreightShipment>) => updateShipmentMutation.mutate({ id, updates }),
    deleteShipment: deleteShipmentMutation.mutate,
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
