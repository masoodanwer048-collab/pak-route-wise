import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

export type DocumentType = 'bl' | 'awb' | 'bilty' | 'manifest' | 'packing_list';
export type DocumentStatus = 'draft' | 'pending' | 'original' | 'telex' | 'released' | 'hold' | 'cancelled';

export interface ShippingDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  status: DocumentStatus;
  carrier: string;
  vesselFlightTruck: string;
  voyageFlightNo: string;
  origin: string;
  destination: string;
  pol?: string;
  pod?: string;
  shipper: string;
  shipperAddress?: string;
  shipperContact?: string;
  consignee: string;
  consigneeAddress?: string;
  consigneeContact?: string;
  notifyParties: string[];
  cargoType: 'FCL' | 'LCL';
  containers: string[];
  marksAndNumbers?: string;
  hsCode?: string;
  weight: string;
  volume: string;
  dimensions?: { length: number; width: number; height: number; unit: 'cm' | 'in' };
  packages: number;
  description: string;
  issueDate: string;
  etd?: string;
  eta?: string;
  freightTerms: 'prepaid' | 'collect';
  remarks?: string;
  createdAt: string;
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

const generateMockDocuments = (type: DocumentType): ShippingDocument[] => {
  const baseDoc = {
    carrier: 'Maersk Line',
    vesselFlightTruck: 'MSC GENOVA',
    voyageFlightNo: 'VY-2024-001',
    origin: 'Shanghai',
    destination: 'Karachi',
    pol: 'Shanghai',
    pod: 'Karachi',
    shipper: 'Samsung Korea',
    shipperAddress: '123 Samsung Way, Seoul',
    consignee: 'Allied Electronics Ltd',
    consigneeAddress: 'Plot 123, SITE, Karachi',
    notifyParties: ['Bank of Punjab', 'Allied Insurance'],
    cargoType: 'FCL' as const,
    containers: ['MSKU1234567', 'MSKU7654321'],
    hsCode: '8471.30.0000',
    weight: '2500 KG',
    volume: '45 CBM',
    packages: 500,
    description: 'Laptop Computers',
    freightTerms: 'prepaid' as const,
  };

  const prefixes: Record<DocumentType, string> = {
    bl: 'BL',
    awb: 'AWB',
    bilty: 'BTY',
    manifest: 'MAN',
    packing_list: 'PKL',
  };

  return [
    {
      id: `${type}-1`,
      type,
      documentNumber: `${prefixes[type]}-2024-00001`,
      status: 'released',
      ...baseDoc,
      issueDate: '2024-01-15',
      etd: '2024-01-20',
      eta: '2024-02-05',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: `${type}-2`,
      type,
      documentNumber: `${prefixes[type]}-2024-00002`,
      status: 'pending',
      ...baseDoc,
      carrier: 'Hapag Lloyd',
      vesselFlightTruck: 'EVER GIVEN',
      voyageFlightNo: 'VY-2024-002',
      shipper: 'Dubai Trading LLC',
      consignee: 'Textile Mills Pakistan',
      description: 'Raw Cotton Bales',
      hsCode: '5201.00.0000',
      packages: 100,
      weight: '22000 KG',
      issueDate: '2024-01-18',
      etd: '2024-01-22',
      eta: '2024-02-08',
      createdAt: '2024-01-18T09:00:00Z',
    },
    {
      id: `${type}-3`,
      type,
      documentNumber: `${prefixes[type]}-2024-00003`,
      status: 'draft',
      ...baseDoc,
      carrier: 'OOCL',
      vesselFlightTruck: 'CMA CGM MARCO POLO',
      voyageFlightNo: 'VY-2024-003',
      shipper: 'MedChem Singapore',
      consignee: 'Pharma Solutions Pvt Ltd',
      description: 'Pharmaceutical Products',
      hsCode: '3004.90.0000',
      packages: 200,
      weight: '800 KG',
      issueDate: '2024-01-20',
      createdAt: '2024-01-20T14:00:00Z',
    },
  ];
};

export function useDocuments(type: DocumentType) {
  const [documents, setDocuments] = useState<ShippingDocument[]>(() => generateMockDocuments(type));
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
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

  const addDocument = useCallback((doc: Omit<ShippingDocument, 'id' | 'createdAt'>) => {
    const newDoc: ShippingDocument = {
      ...doc,
      id: `${type}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDocuments(prev => [newDoc, ...prev]);
    toast.success('Document Created');
  }, [type]);

  const updateDocument = useCallback((id: string, updates: Partial<ShippingDocument>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
    toast.success('Document Updated');
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success('Document Deleted');
  }, []);

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
    addDocument,
    updateDocument,
    deleteDocument,
    updateFilters,
    clearFilters,
  };
}
