import { useState, useMemo, useCallback } from 'react';

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
  notifyParties: string[]; // Changed from single string to array
  // Cargo
  cargoType: 'FCL' | 'LCL'; // Added
  containers: string[];
  marksAndNumbers?: string; // Added for LCL
  hsCode?: string; // Added
  weight: string;
  volume: string;
  dimensions?: { length: number; width: number; height: number; unit: 'cm' | 'in' }; // Added
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
  // Manifest Specific
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

const generateMockDocuments = (type: DocumentType, count: number): ShippingDocument[] => {
  const statuses: DocumentStatus[] = ['draft', 'pending', 'original', 'telex', 'released', 'hold'];

  const typeConfig = {
    bl: {
      prefix: 'MAEU',
      carriers: ['Maersk Line', 'MSC', 'CMA CGM', 'Hapag-Lloyd', 'Evergreen'],
      vessels: ['MV Ever Fortune', 'MSC Oscar', 'CMA CGM Marco Polo', 'Maersk Triple E'],
      voyages: ['V.2401E', 'V.2402W', 'V.2403N', 'V.2404S'],
      origins: ['Shanghai, China', 'Singapore', 'Dubai, UAE', 'Rotterdam, Netherlands'],
      destinations: ['Karachi Port', 'Port Qasim', 'Gwadar Port', 'PICT'],
    },
    awb: {
      prefix: 'AWB',
      carriers: ['PIA Cargo', 'Emirates SkyCargo', 'Qatar Airways Cargo', 'Turkish Cargo'],
      vessels: ['Boeing 777F', 'Airbus A330F', 'Boeing 747-8F'],
      voyages: ['PK-701', 'EK-5891', 'QR-8012', 'TK-6002'],
      origins: ['Dubai Airport', 'Singapore Changi', 'London Heathrow', 'Frankfurt Airport'],
      destinations: ['Jinnah International', 'Allama Iqbal Airport', 'Islamabad Airport'],
    },
    bilty: {
      prefix: 'BLT',
      carriers: ['National Logistics', 'Express Trucking', 'Pak Carriers', 'Swift Transport'],
      vessels: ['ABC-1234', 'XYZ-5678', 'KHI-9012', 'LHR-3456'],
      voyages: ['Muhammad Ali', 'Ahmed Khan', 'Hamid Shah', 'Imran Malik'],
      origins: ['Karachi Port', 'Port Qasim', 'Lahore Dry Port', 'Peshawar'],
      destinations: ['Lahore Dry Port', 'Faisalabad Dry Port', 'Multan Dry Port', 'Torkham Border'],
    },
    manifest: {
      prefix: 'MAN',
      carriers: ['Various Carriers'],
      vessels: ['MV Container Ship', 'MV Bulk Carrier'],
      voyages: ['V.2401', 'V.2402'],
      origins: ['Multiple Origins'],
      destinations: ['Karachi Port', 'Port Qasim'],
    },
    packing_list: {
      prefix: 'PL',
      carriers: ['N/A'],
      vessels: ['ATHENS BRIDGE V.147S', 'CMA CGM RABELAIS'],
      voyages: ['V.147S', '065E'],
      origins: ['Nagoya Port, Japan', 'Shanghai, China'],
      destinations: ['Karachi Port, Pakistan', 'Port Qasim'],
    },
  };

  const config = typeConfig[type];
  const shippers = ['ABC Trading Co.', 'XYZ Industries', 'Global Exports Pvt', 'Toyota Boshoku Corporation'];
  const consignees = ['Import Co. Ltd', 'Pakistan Traders', 'Thal Boshoku Pakistan (Pvt.) Ltd.'];

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 30));
    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + Math.floor(Math.random() * 14));

    const isFCL = Math.random() > 0.3;
    const containerCount = type === 'awb' || !isFCL ? 0 : Math.floor(Math.random() * 5 + 1);
    const containers = Array.from({ length: containerCount }, (_, j) =>
      `${type === 'packing_list' ? 'C/NO.' : config.prefix.slice(0, 4)}${String(Math.floor(Math.random() * 9999999)).padStart(7, '0')}`
    );

    const length = Math.floor(Math.random() * 200 + 50);
    const width = Math.floor(Math.random() * 100 + 50);
    const height = Math.floor(Math.random() * 100 + 50);
    const volume = (length * width * height) / 1000000; // CBM

    const shipper = shippers[Math.floor(Math.random() * shippers.length)];
    const consignee = consignees[Math.floor(Math.random() * consignees.length)];

    return {
      id: `${config.prefix}${String(Math.floor(Math.random() * 999999999)).padStart(9, '0')}`,
      type,
      documentNumber: `${config.prefix}${String(Math.floor(Math.random() * 999999999)).padStart(9, '0')}`,
      status,
      carrier: config.carriers[Math.floor(Math.random() * config.carriers.length)],
      vesselFlightTruck: config.vessels[Math.floor(Math.random() * config.vessels.length)],
      voyageFlightNo: config.voyages[Math.floor(Math.random() * config.voyages.length)],
      origin: config.origins[Math.floor(Math.random() * config.origins.length)],
      destination: config.destinations[Math.floor(Math.random() * config.destinations.length)],
      pol: (type === 'bl' || type === 'packing_list') ? config.origins[Math.floor(Math.random() * config.origins.length)] : undefined,
      pod: (type === 'bl' || type === 'packing_list') ? config.destinations[Math.floor(Math.random() * config.destinations.length)] : undefined,
      shipper,
      shipperAddress: '123 Export Zone, Industrial Area, Shanghai, China',
      shipperContact: '+86 21 1234 5678',
      consignee,
      consigneeAddress: 'Plot 45-B, Industrial Estate, Karachi, Pakistan',
      consigneeContact: '+92 21 3456 7890',
      notifyParties: [consignee],
      cargoType: isFCL ? 'FCL' : 'LCL',
      containers,
      marksAndNumbers: !isFCL ? `M/NO: ${Math.floor(Math.random() * 1000)}` : undefined,
      hsCode: '8543.7090',
      weight: `${Math.floor(Math.random() * 40000 + 5000).toLocaleString()} kg`,
      volume: `${volume.toFixed(3)} CBM`,
      dimensions: { length, width, height, unit: 'cm' },
      packages: Math.floor(Math.random() * 500 + 50),
      description: ['Airbag Traceability Control System', 'Auto Parts', 'Machinery Parts', 'Consumer Electronics'][Math.floor(Math.random() * 4)],
      issueDate: issueDate.toISOString().split('T')[0],
      etd: issueDate.toISOString().split('T')[0],
      eta: etaDate.toISOString().split('T')[0],
      freightTerms: Math.random() > 0.5 ? 'prepaid' : 'collect',
      remarks: '',
      createdAt: new Date().toISOString(),
      recipient: consignee,
      recipientEmail: 'recipient@example.com',
      recipientAddress: '456 Import Lane, Destination City',
      recipientPhone: '+92 300 1234567',
      manifestItems: type === 'manifest' ? [
        {
          id: '1',
          description: 'Electronic Components',
          quantity: 100,
          weight: 500,
          dimensions: '50x50x50 cm',
          value: 5000
        },
        {
          id: '2',
          description: 'Spare Parts',
          quantity: 50,
          weight: 200,
          dimensions: '30x30x30 cm',
          value: 1500
        }
      ] : undefined
    };
  });
};

export interface DocumentFilters {
  search: string;
  status: DocumentStatus | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
}

export function useDocuments(type: DocumentType) {
  const [documents, setDocuments] = useState<ShippingDocument[]>(() => generateMockDocuments(type, 10));
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
    const draft = documents.filter((d) => d.status === 'draft').length;
    const pending = documents.filter((d) => d.status === 'pending').length;
    const released = documents.filter((d) => d.status === 'released').length;
    const original = documents.filter((d) => d.status === 'original').length;
    const telex = documents.filter((d) => d.status === 'telex').length;
    const hold = documents.filter((d) => d.status === 'hold').length;

    return { total, draft, pending, released, original, telex, hold };
  }, [documents]);

  const addDocument = useCallback((doc: Omit<ShippingDocument, 'id' | 'createdAt'>) => {
    const prefix = type === 'bl' ? 'MAEU' : type === 'awb' ? 'AWB' : type === 'bilty' ? 'BLT' : 'MAN';
    const newDoc: ShippingDocument = {
      ...doc,
      id: `${prefix}${String(Date.now()).slice(-9)}`,
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  }, [type]);

  const updateDocument = useCallback((id: string, updates: Partial<ShippingDocument>) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
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
