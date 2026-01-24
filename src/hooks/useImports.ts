import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

export type ImportStatus = 'pending' | 'igm_filed' | 'gd_filed' | 'assessed' | 'duty_paid' | 'examined' | 'released' | 'delivered';

export interface ImportShipment {
  id: string;
  indexNumber: string;
  igmNumber: string;
  igmDate: string;
  blNumber: string;
  blDate: string;
  blType: 'Original' | 'Telex' | 'Express';
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  terminal: string;
  importerName: string;
  importerNtn: string;
  exporterName: string;
  countryOfOrigin: string;
  hsCode: string;
  goodsDescription: string;
  packages: number;
  packageType: string;
  grossWeight: number;
  netWeight: number;
  containerNumbers: string[];
  invoiceNumber: string;
  invoiceValue: number;
  currency: string;
  exchangeRate: number;
  assessedValue: number;
  customsDuty: number;
  salesTax: number;
  additionalDuty: number;
  totalDutyTax: number;
  gdNumber?: string;
  gdDate?: string;
  paymentDate?: string;
  releaseDate?: string;
  deliveryDate?: string;
  status: ImportStatus;
  createdAt: string;
}

export interface ImportFormData {
  blNumber: string;
  blDate: string;
  blType: 'Original' | 'Telex' | 'Express';
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  terminal: string;
  importerName: string;
  importerNtn: string;
  exporterName: string;
  countryOfOrigin: string;
  hsCode: string;
  goodsDescription: string;
  packages: number;
  packageType: string;
  grossWeight: number;
  netWeight: number;
  containerNumbers: string;
  invoiceNumber: string;
  invoiceValue: number;
  currency: string;
}

const generateMockImports = (): ImportShipment[] => {
  return [
    {
      id: '1',
      indexNumber: 'IMP-2024-00001',
      igmNumber: 'IGM-KHI-2024-12345',
      igmDate: '2024-01-15',
      blNumber: 'MAEU123456789',
      blDate: '2024-01-10',
      blType: 'Original',
      vesselName: 'MSC GENOVA',
      voyageNumber: 'VY-2024-001',
      portOfLoading: 'Shanghai, China',
      portOfDischarge: 'Karachi',
      terminal: 'PICT',
      importerName: 'Allied Electronics Ltd',
      importerNtn: '1234567-8',
      exporterName: 'Samsung Korea',
      countryOfOrigin: 'South Korea',
      hsCode: '8471.30.0000',
      goodsDescription: 'Laptop Computers',
      packages: 500,
      packageType: 'Cartons',
      grossWeight: 2500,
      netWeight: 2200,
      containerNumbers: ['MSKU1234567', 'MSKU7654321'],
      invoiceNumber: 'INV-2024-00123',
      invoiceValue: 125000,
      currency: 'USD',
      exchangeRate: 278.50,
      assessedValue: 35187500,
      customsDuty: 5278125,
      salesTax: 7333050,
      additionalDuty: 2111250,
      totalDutyTax: 14722425,
      gdNumber: 'GD-2024-001234',
      gdDate: '2024-01-16',
      paymentDate: '2024-01-18',
      releaseDate: '2024-01-19',
      status: 'released',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      indexNumber: 'IMP-2024-00002',
      igmNumber: 'IGM-KHI-2024-12346',
      igmDate: '2024-01-18',
      blNumber: 'HLCU987654321',
      blDate: '2024-01-12',
      blType: 'Telex',
      vesselName: 'EVER GIVEN',
      voyageNumber: 'VY-2024-002',
      portOfLoading: 'Dubai, UAE',
      portOfDischarge: 'Port Qasim',
      terminal: 'QICT',
      importerName: 'Textile Mills Pakistan',
      importerNtn: '9876543-2',
      exporterName: 'Dubai Trading LLC',
      countryOfOrigin: 'UAE',
      hsCode: '5201.00.0000',
      goodsDescription: 'Raw Cotton',
      packages: 100,
      packageType: 'Bales',
      grossWeight: 22000,
      netWeight: 20000,
      containerNumbers: ['HLCU1111111', 'HLCU2222222', 'HLCU3333333'],
      invoiceNumber: 'INV-2024-00456',
      invoiceValue: 75000,
      currency: 'USD',
      exchangeRate: 278.50,
      assessedValue: 21112500,
      customsDuty: 1055625,
      salesTax: 3990187,
      additionalDuty: 0,
      totalDutyTax: 5045812,
      gdNumber: 'GD-2024-001235',
      gdDate: '2024-01-19',
      status: 'assessed',
      createdAt: '2024-01-18T09:00:00Z',
    },
    {
      id: '3',
      indexNumber: 'IMP-2024-00003',
      igmNumber: '',
      igmDate: '',
      blNumber: 'OOCL456789123',
      blDate: '2024-01-20',
      blType: 'Express',
      vesselName: 'CMA CGM MARCO POLO',
      voyageNumber: 'VY-2024-003',
      portOfLoading: 'Singapore',
      portOfDischarge: 'Karachi',
      terminal: 'KICT',
      importerName: 'Pharma Solutions Pvt Ltd',
      importerNtn: '5555555-5',
      exporterName: 'MedChem Singapore',
      countryOfOrigin: 'Singapore',
      hsCode: '3004.90.0000',
      goodsDescription: 'Pharmaceutical Products',
      packages: 200,
      packageType: 'Cartons',
      grossWeight: 800,
      netWeight: 750,
      containerNumbers: ['OOCL9999999'],
      invoiceNumber: 'INV-2024-00789',
      invoiceValue: 180000,
      currency: 'USD',
      exchangeRate: 278.50,
      assessedValue: 50625000,
      customsDuty: 0,
      salesTax: 9112500,
      additionalDuty: 0,
      totalDutyTax: 9112500,
      status: 'pending',
      createdAt: '2024-01-20T14:00:00Z',
    },
  ];
};

export function useImports() {
  const [imports, setImports] = useState<ImportShipment[]>(generateMockImports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ImportStatus | 'all'>('all');
  const [terminalFilter, setTerminalFilter] = useState<string>('all');

  const filteredImports = useMemo(() => {
    return imports.filter(imp => {
      if (statusFilter !== 'all' && imp.status !== statusFilter) return false;
      if (terminalFilter !== 'all' && imp.terminal !== terminalFilter) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          imp.indexNumber.toLowerCase().includes(query) ||
          imp.igmNumber.toLowerCase().includes(query) ||
          imp.blNumber.toLowerCase().includes(query) ||
          imp.importerName.toLowerCase().includes(query) ||
          (imp.gdNumber && imp.gdNumber.toLowerCase().includes(query)) ||
          imp.containerNumbers.some(c => c.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [imports, statusFilter, terminalFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: imports.length,
    pending: imports.filter(i => i.status === 'pending').length,
    igmFiled: imports.filter(i => i.status === 'igm_filed').length,
    gdFiled: imports.filter(i => i.status === 'gd_filed').length,
    assessed: imports.filter(i => i.status === 'assessed').length,
    dutyPaid: imports.filter(i => i.status === 'duty_paid').length,
    examined: imports.filter(i => i.status === 'examined').length,
    released: imports.filter(i => i.status === 'released').length,
    delivered: imports.filter(i => i.status === 'delivered').length,
    totalValue: imports.reduce((sum, i) => sum + i.invoiceValue, 0),
    totalDuty: imports.reduce((sum, i) => sum + i.totalDutyTax, 0),
  }), [imports]);

  const addImport = useCallback((data: ImportFormData) => {
    const exchangeRate = 278.50;
    const assessedValue = data.invoiceValue * exchangeRate * 1.01;
    const customsDuty = assessedValue * 0.15;
    const salesTax = (assessedValue + customsDuty) * 0.18;
    const totalDuty = customsDuty + salesTax + (assessedValue * 0.055);

    const newImport: ImportShipment = {
      id: `imp-${Date.now()}`,
      indexNumber: `IMP-${new Date().getFullYear()}-${String(imports.length + 1).padStart(5, '0')}`,
      igmNumber: '',
      igmDate: '',
      blNumber: data.blNumber,
      blDate: data.blDate,
      blType: data.blType,
      vesselName: data.vesselName,
      voyageNumber: data.voyageNumber,
      portOfLoading: data.portOfLoading,
      portOfDischarge: data.portOfDischarge,
      terminal: data.terminal,
      importerName: data.importerName,
      importerNtn: data.importerNtn,
      exporterName: data.exporterName,
      countryOfOrigin: data.countryOfOrigin,
      hsCode: data.hsCode,
      goodsDescription: data.goodsDescription,
      packages: data.packages,
      packageType: data.packageType,
      grossWeight: data.grossWeight,
      netWeight: data.netWeight,
      containerNumbers: data.containerNumbers.split(',').map(c => c.trim()),
      invoiceNumber: data.invoiceNumber,
      invoiceValue: data.invoiceValue,
      currency: data.currency,
      exchangeRate,
      assessedValue,
      customsDuty,
      salesTax,
      additionalDuty: assessedValue * 0.055,
      totalDutyTax: totalDuty,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setImports(prev => [newImport, ...prev]);
    toast.success('Import shipment created');
  }, [imports.length]);

  const updateImport = useCallback((id: string, data: ImportFormData) => {
    setImports(prev => prev.map(imp => {
      if (imp.id !== id) return imp;

      const exchangeRate = 278.50;
      const assessedValue = data.invoiceValue * exchangeRate * 1.01;
      const customsDuty = assessedValue * 0.15;
      const salesTax = (assessedValue + customsDuty) * 0.18;
      const totalDuty = customsDuty + salesTax + (assessedValue * 0.055);

      return {
        ...imp,
        blNumber: data.blNumber,
        blDate: data.blDate,
        blType: data.blType,
        vesselName: data.vesselName,
        voyageNumber: data.voyageNumber,
        portOfLoading: data.portOfLoading,
        portOfDischarge: data.portOfDischarge,
        terminal: data.terminal,
        importerName: data.importerName,
        importerNtn: data.importerNtn,
        exporterName: data.exporterName,
        countryOfOrigin: data.countryOfOrigin,
        hsCode: data.hsCode,
        goodsDescription: data.goodsDescription,
        packages: data.packages,
        packageType: data.packageType,
        grossWeight: data.grossWeight,
        netWeight: data.netWeight,
        containerNumbers: data.containerNumbers.split(',').map(c => c.trim()),
        invoiceNumber: data.invoiceNumber,
        invoiceValue: data.invoiceValue,
        currency: data.currency,
        exchangeRate,
        assessedValue,
        customsDuty,
        salesTax,
        additionalDuty: assessedValue * 0.055,
        totalDutyTax: totalDuty,
      };
    }));
    toast.success('Import shipment updated');
  }, []);

  const updateStatus = useCallback((id: string, newStatus: ImportStatus) => {
    setImports(prev => prev.map(imp => {
      if (imp.id !== id) return imp;

      const updates: Partial<ImportShipment> = { status: newStatus };

      if (newStatus === 'igm_filed') {
        updates.igmNumber = `IGM-KHI-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
        updates.igmDate = new Date().toISOString().split('T')[0];
      }
      if (newStatus === 'gd_filed') {
        updates.gdNumber = `GD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
        updates.gdDate = new Date().toISOString().split('T')[0];
      }
      if (newStatus === 'duty_paid') updates.paymentDate = new Date().toISOString().split('T')[0];
      if (newStatus === 'released') updates.releaseDate = new Date().toISOString().split('T')[0];
      if (newStatus === 'delivered') updates.deliveryDate = new Date().toISOString().split('T')[0];

      return { ...imp, ...updates };
    }));
    toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
  }, []);

  const deleteImport = useCallback((id: string) => {
    setImports(prev => prev.filter(imp => imp.id !== id));
    toast.success('Import shipment deleted');
  }, []);

  return {
    imports: filteredImports,
    allImports: imports,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    terminalFilter,
    setTerminalFilter,
    addImport,
    updateImport,
    updateStatus,
    deleteImport,
  };
}
