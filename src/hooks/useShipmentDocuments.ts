import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ShipmentDocument {
    id: string;
    shipment_id?: string;
    name: string; // document_number or derived
    type: string; // 'permit', 'invoice', etc.
    category: 'Customs' | 'Shipping' | 'Invoices' | 'Certificates';
    uploadDate: string;
    size: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    file_url: string;
}

export function useShipmentDocuments() {
    const queryClient = useQueryClient();

    const { data: documents = [], isLoading } = useQuery({
        queryKey: ['shipment_documents'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('shipment_documents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Fetch docs error:', error);
                return [];
            }

            return data.map((d: any) => ({
                id: d.id,
                shipment_id: d.shipment_id,
                name: d.file_url ? d.file_url.split('/').pop() : `Doc-${d.id.slice(0, 8)}`,
                type: d.type.toUpperCase(),
                category: (d.type === 'permit' || d.type === 'gd') ? 'Customs' : 'Shipping', // logic to map type to category
                uploadDate: d.created_at.split('T')[0],
                size: 'N/A', // Size not stored in DB normally unless added
                status: d.status || 'Pending',
                file_url: d.file_url,
            })) as ShipmentDocument[];
        },
    });

    const uploadDocumentMutation = useMutation({
        mutationFn: async ({ file, type, category, shipmentId }: { file: File, type: string, category: string, shipmentId?: string }) => {
            const fileName = `${Date.now()}-${file.name}`;

            // 1. Upload to Storage
            // Check if bucket exists, or assume 'documents' bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (uploadError) {
                // If bucket doesn't exist, this will fail. User needs to create bucket.
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const fileUrl = uploadData.path; // or getPublicUrl

            // 2. Insert Record
            const { data, error } = await supabase
                .from('shipment_documents')
                .insert({
                    shipment_id: shipmentId, // Optional, can be null
                    type: type.toLowerCase(), // Store as 'permit', 'invoice'
                    file_url: fileUrl,
                    status: 'pending',
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipment_documents'] });
            toast.success('Document uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(`Upload error: ${error.message}`);
        }
    });

    const deleteDocumentMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('shipment_documents').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipment_documents'] });
            toast.success('Document deleted');
        },
    });

    return {
        documents,
        isLoading,
        uploadDocument: uploadDocumentMutation.mutate,
        deleteDocument: deleteDocumentMutation.mutate,
    };
}
