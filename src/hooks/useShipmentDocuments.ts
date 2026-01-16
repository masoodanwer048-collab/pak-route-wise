import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ShipmentDocument {
  id: string;
  shipment_id?: string;
  name: string;
  type: string;
  category: 'Customs' | 'Shipping' | 'Invoices' | 'Certificates';
  uploadDate: string;
  size: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  file_url: string;
}

const generateMockDocuments = (): ShipmentDocument[] => [
  {
    id: '1',
    shipment_id: 'shp-001',
    name: 'Bill_of_Lading_MAEU123456.pdf',
    type: 'BL',
    category: 'Shipping',
    uploadDate: '2024-01-15',
    size: '2.4 MB',
    status: 'Verified',
    file_url: '/documents/bl-123.pdf',
  },
  {
    id: '2',
    shipment_id: 'shp-001',
    name: 'Commercial_Invoice_INV2024001.pdf',
    type: 'INVOICE',
    category: 'Invoices',
    uploadDate: '2024-01-15',
    size: '1.2 MB',
    status: 'Verified',
    file_url: '/documents/inv-001.pdf',
  },
  {
    id: '3',
    shipment_id: 'shp-002',
    name: 'Customs_Declaration_GD2024001.pdf',
    type: 'GD',
    category: 'Customs',
    uploadDate: '2024-01-18',
    size: '3.1 MB',
    status: 'Pending',
    file_url: '/documents/gd-001.pdf',
  },
  {
    id: '4',
    name: 'Certificate_of_Origin_COO2024.pdf',
    type: 'CERTIFICATE',
    category: 'Certificates',
    uploadDate: '2024-01-20',
    size: '0.8 MB',
    status: 'Verified',
    file_url: '/documents/coo-001.pdf',
  },
];

export function useShipmentDocuments() {
  const [documents, setDocuments] = useState<ShipmentDocument[]>(generateMockDocuments);
  const [isLoading] = useState(false);

  const uploadDocument = useCallback(({ file, type, category, shipmentId }: { 
    file: File; 
    type: string; 
    category: string; 
    shipmentId?: string 
  }) => {
    const newDoc: ShipmentDocument = {
      id: `doc-${Date.now()}`,
      shipment_id: shipmentId,
      name: file.name,
      type: type.toUpperCase(),
      category: category as ShipmentDocument['category'],
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Pending',
      file_url: URL.createObjectURL(file),
    };
    setDocuments(prev => [newDoc, ...prev]);
    toast.success('Document uploaded successfully');
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast.success('Document deleted');
  }, []);

  const updateDocumentStatus = useCallback((id: string, status: ShipmentDocument['status']) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    toast.success('Document status updated');
  }, []);

  return {
    documents,
    isLoading,
    uploadDocument,
    deleteDocument,
    updateDocumentStatus,
  };
}
