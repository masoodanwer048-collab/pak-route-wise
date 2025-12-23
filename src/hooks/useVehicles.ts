import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Vehicle {
    id: string;
    registration_number: string;
    make: string;
    model: string;
    year: number;
    capacity: string; // e.g., "20 tons"
    status: 'Active' | 'Inactive' | 'Maintenance';
    driver_id?: string | null;
}

export function useVehicles() {
    const queryClient = useQueryClient();

    const { data: vehicles = [], isLoading } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Fetch vehicles error:', error);
                toast.error('Failed to load vehicles');
                return [];
            }
            return data as Vehicle[];
        },
    });

    const addVehicleMutation = useMutation({
        mutationFn: async (vehicle: Omit<Vehicle, 'id'>) => {
            const { data, error } = await supabase
                .from('vehicles')
                .insert(vehicle)
                .select()
                .single();
            if (error) throw error;
            return data as Vehicle;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            toast.success('Vehicle added');
        },
        onError: (err: any) => {
            toast.error(`Add vehicle failed: ${err.message}`);
        },
    });

    const updateVehicleMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Vehicle> }) => {
            const { error } = await supabase.from('vehicles').update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            toast.success('Vehicle updated');
        },
        onError: (err: any) => {
            toast.error(`Update failed: ${err.message}`);
        },
    });

    const deleteVehicleMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('vehicles').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            toast.success('Vehicle deleted');
        },
        onError: (err: any) => {
            toast.error(`Delete failed: ${err.message}`);
        },
    });

    return {
        vehicles,
        isLoading,
        addVehicle: addVehicleMutation.mutate,
        updateVehicle: (id: string, updates: Partial<Vehicle>) =>
            updateVehicleMutation.mutate({ id, updates }),
        deleteVehicle: deleteVehicleMutation.mutate,
    };
}
