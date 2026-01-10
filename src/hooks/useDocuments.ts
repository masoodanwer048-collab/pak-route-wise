import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DocumentType = 'bl' | 'awb' | 'bilty' | 'manifest' | 'packing_list';
export type DocumentStatus = 'draft' | 'pending' | 'original' | 'telex' | 'released' | 'hold' | 'cancelled';

export interface ShippingDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  status: DocumentStatus;
  // Vessel/Flight/Vehicle Info
  carrier: string;
  vesselFlightTruck: string;
  voyageFlightNo: string;
  // Route
  origin: string;
  destination: string;
  pol?: string; // Port of Loading
  pod?: string; // Port of Discharge
  // Parties
  shipper: string;
  shipperAddress?: string;
  shipperContact?: string;
  consignee: string;
  consigneeAddress?: string;
  consigneeContact?: string;
  notifyParties: string[];
  // Cargo
  cargoType: 'FCL' | 'LCL';
  containers: string[];
  marksAndNumbers?: string;
  hsCode?: string;
  weight: string;
  volume: string;
  dimensions?: { length: number; width: number; height: number; unit: 'cm' | 'in' };
  packages: number;
  description: string;
  // Dates
  issueDate: string;
  etd?: string;
  eta?: string;
  // Additional
  freightTerms: 'prepaid' | 'collect';
  remarks?: string;
  createdAt: string;
  // Manifest Specific - Stored in metadata
  recipient?: string;
  recipientEmail?: string;
  recipientAddress?: string;
  recipientPhone?: string;
  manifestItems?: {
    id: string;
    description: string;
    quantity: number;
    weight: number;
    dimensions: string;
    value: number;
  }[];
}

export interface DocumentFilters {
  search: string;
  status: DocumentStatus | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
}

const mapToDocument = (row: any): ShippingDocument => {
  const meta = row.metadata || {};
  return {
    id: row.id,
    type: row.type as DocumentType,
    documentNumber: row.document_number || '',
    status: (row.status as DocumentStatus) || 'pending',
    createdAt: row.created_at,

    // Spread metadata fields
    carrier: meta.carrier || '',
    vesselFlightTruck: meta.vesselFlightTruck || '',
    voyageFlightNo: meta.voyageFlightNo || '',
    origin: meta.origin || '',
    destination: meta.destination || '',
    pol: meta.pol,
    pod: meta.pod,
    shipper: meta.shipper || '',
    shipperAddress: meta.shipperAddress,
    shipperContact: meta.shipperContact,
    consignee: meta.consignee || '',
    consigneeAddress: meta.consigneeAddress,
    consigneeContact: meta.consigneeContact,
    notifyParties: meta.notifyParties || [],
    cargoType: meta.cargoType || 'FCL',
    containers: meta.containers || [],
    marksAndNumbers: meta.marksAndNumbers,
    hsCode: meta.hsCode,
    weight: meta.weight || '',
    volume: meta.volume || '',
    dimensions: meta.dimensions,
    packages: meta.packages || 0,
    description: meta.description || '',
    issueDate: meta.issueDate || row.created_at,
    etd: meta.etd,
    eta: meta.eta,
    freightTerms: meta.freightTerms || 'prepaid',
    remarks: meta.remarks,
    recipient: meta.recipient,
    recipientEmail: meta.recipientEmail,
    recipientAddress: meta.recipientAddress,
    recipientPhone: meta.recipientPhone,
    manifestItems: meta.manifestItems,
  };
};

export function useDocuments(type: DocumentType) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
  });

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['shipment_documents', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('type', type) // Filter by type at DB level
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch Documents error:', error);
        if (error.code === '42P01') {
          toast.error('DB Setup required: "shipment_documents" table missing.');
        } else if (error.code === '42703') { // undefined_column if metadata missing
          toast.error('Schema outdated: "metadata" column missing.');
        } else {
          toast.error('Failed to load documents');
        }
        return [];
      }
      return data.map(mapToDocument);
    },
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Client-side search and status filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          doc.documentNumber.toLowerCase().includes(searchLower) ||
          doc.carrier.toLowerCase().includes(searchLower) ||
          doc.vesselFlightTruck.toLowerCase().includes(searchLower) ||
          doc.shipper.toLowerCase().includes(searchLower) ||
          doc.consignee.toLowerCase().includes(searchLower) ||
          doc.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.status !== 'all' && doc.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [documents, filters]);

  const stats = useMemo(() => {
    const total = documents.length;
    return {
      total,
      draft: documents.filter((d) => d.status === 'draft').length,
      pending: documents.filter((d) => d.status === 'pending').length,
      released: documents.filter((d) => d.status === 'released').length,
      original: documents.filter((d) => d.status === 'original').length,
      telex: documents.filter((d) => d.status === 'telex').length,
      hold: documents.filter((d) => d.status === 'hold').length,
    };
  }, [documents]);

  const addDocumentMutation = useMutation({
    mutationFn: async (doc: Omit<ShippingDocument, 'id' | 'createdAt'>) => {
      // Extract metadata fields
      const {
        documentNumber, status, type,
        ...metadata
      } = doc;

      const { data: newRow, error } = await supabase
        .from('shipment_documents')
        .insert({
          type: type,
          document_number: documentNumber,
          status: status,
          metadata: metadata // Store rest as JSON
        })
        .select()
        .single();

      if (error) throw error;
      return mapToDocument(newRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipment_documents'] });
      toast.success('Document Created');
    },
    onError: (err: any) => {
      toast.error(`Error creating document: ${err.message}`);
    }
  });

  const updateDocument = useCallback(() => toast.info('Update not implemented in demo'), []);
  const deleteDocument = useCallback(() => toast.info('Delete not implemented in demo'), []);

  const updateFilters = useCallback((newFilters: Partial<DocumentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', status: 'all', dateRange: 'all' });
  }, []);

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    filters,
    stats,
    addDocument: addDocumentMutation.mutate,
    updateDocument,
    deleteDocument,
    updateFilters,
    clearFilters,
  };
}
