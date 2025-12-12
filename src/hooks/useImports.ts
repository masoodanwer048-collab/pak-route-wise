import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

export type ImportStatus = 'pending' | 'igm_filed' | 'gd_filed' | 'assessed' | 'duty_paid' | 'examined' | 'released' | 'delivered';

export interface ImportShipment {
  id: string;
  indexNumber: string;
  igmNumber: string;
  igmDate: Date;
  blNumber: string;
  blDate: Date;
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
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
  totalDutyTax: number;
  gdNumber?: string;
  gdDate?: Date;
  dutyPaidDate?: Date;
  examDate?: Date;
  releaseDate?: Date;
  deliveryDate?: Date;
  status: ImportStatus;
  terminal: string;
  createdAt: Date;
}

export interface ImportFormData {
  blNumber: string;
  blDate: string;
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
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
  terminal: string;
}

const terminals = ['PICT', 'KICT', 'QICT', 'SAPT', 'KPT'];
const vessels = ['MSC ANNA', 'MAERSK SEALAND', 'CMA CGM MARCO POLO', 'EVERGREEN EVER GIVEN', 'COSCO SHIPPING'];
const origins = ['China', 'UAE', 'Germany', 'USA', 'Japan', 'South Korea', 'Turkey', 'Malaysia'];

const generateMockImports = (): ImportShipment[] => {
  const statuses: ImportStatus[] = ['pending', 'igm_filed', 'gd_filed', 'assessed', 'duty_paid', 'examined', 'released', 'delivered'];
  const imports: ImportShipment[] = [];

  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const invoiceValue = Math.floor(Math.random() * 500000) + 10000;
    const exchangeRate = 278.50;
    const assessedValue = invoiceValue * exchangeRate * 1.01;
    const customsDuty = assessedValue * 0.15;
    const salesTax = (assessedValue + customsDuty) * 0.18;

    imports.push({
      id: `imp-${i}`,
      indexNumber: `IMP-2024-${String(10000 + i).padStart(6, '0')}`,
      igmNumber: `IGM-${2024}-${String(5000 + i).padStart(5, '0')}`,
      igmDate: new Date(2024, 0, Math.floor(Math.random() * 14) + 1),
      blNumber: `MAEU${String(100000 + i * 1000).padStart(9, '0')}`,
      blDate: new Date(2024, 0, Math.floor(Math.random() * 10) + 1),
      vesselName: vessels[Math.floor(Math.random() * vessels.length)],
      voyageNumber: `V${String(100 + i).padStart(3, '0')}E`,
      portOfLoading: ['Shanghai', 'Dubai', 'Hamburg', 'Singapore', 'Busan'][Math.floor(Math.random() * 5)],
      portOfDischarge: 'PKKAR',
      importerName: ['ABC Trading Co.', 'XYZ Industries', 'Global Importers', 'National Traders', 'Premier Imports'][i % 5],
      importerNtn: `${1234567 + i}`,
      exporterName: ['China Trading LLC', 'Dubai Exports', 'Singapore Corp', 'Hamburg GmbH', 'Korea Ltd'][i % 5],
      countryOfOrigin: origins[Math.floor(Math.random() * origins.length)],
      hsCode: ['8471.30.00', '8443.32.00', '8517.12.00', '8703.23.00', '7208.10.00'][Math.floor(Math.random() * 5)],
      goodsDescription: ['Computer Hardware', 'Printing Machines', 'Mobile Phones', 'Motor Vehicles', 'Steel Coils'][Math.floor(Math.random() * 5)],
      packages: Math.floor(Math.random() * 500) + 10,
      packageType: ['Cartons', 'Pallets', 'Crates', 'Drums', 'Bags'][Math.floor(Math.random() * 5)],
      grossWeight: Math.floor(Math.random() * 20000) + 500,
      netWeight: Math.floor(Math.random() * 18000) + 400,
      containerNumbers: [`MAEU${String(1000000 + i).padStart(7, '0')}`],
      invoiceNumber: `INV-2024-${1000 + i}`,
      invoiceValue,
      currency: 'USD',
      exchangeRate,
      assessedValue,
      customsDuty,
      salesTax,
      totalDutyTax: customsDuty + salesTax + (assessedValue * 0.055),
      gdNumber: ['gd_filed', 'assessed', 'duty_paid', 'examined', 'released', 'delivered'].includes(status) 
        ? `GD-2024-${String(45000 + i).padStart(6, '0')}` : undefined,
      gdDate: ['gd_filed', 'assessed', 'duty_paid', 'examined', 'released', 'delivered'].includes(status) 
        ? new Date(2024, 0, Math.floor(Math.random() * 14) + 2) : undefined,
      dutyPaidDate: ['duty_paid', 'examined', 'released', 'delivered'].includes(status) 
        ? new Date(2024, 0, Math.floor(Math.random() * 14) + 3) : undefined,
      examDate: ['examined', 'released', 'delivered'].includes(status) 
        ? new Date(2024, 0, Math.floor(Math.random() * 14) + 4) : undefined,
      releaseDate: ['released', 'delivered'].includes(status) 
        ? new Date(2024, 0, Math.floor(Math.random() * 14) + 5) : undefined,
      deliveryDate: status === 'delivered' ? new Date(2024, 0, Math.floor(Math.random() * 14) + 6) : undefined,
      status,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 14) + 1),
    });
  }

  return imports;
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
          imp.gdNumber?.toLowerCase().includes(query) ||
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

    const newImport: ImportShipment = {
      id: `imp-${Date.now()}`,
      indexNumber: `IMP-2024-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      igmNumber: '',
      igmDate: new Date(),
      blNumber: data.blNumber,
      blDate: new Date(data.blDate),
      vesselName: data.vesselName,
      voyageNumber: data.voyageNumber,
      portOfLoading: data.portOfLoading,
      portOfDischarge: data.portOfDischarge,
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
      totalDutyTax: customsDuty + salesTax + (assessedValue * 0.055),
      status: 'pending',
      terminal: data.terminal,
      createdAt: new Date(),
    };

    setImports(prev => [newImport, ...prev]);
    toast.success('Import created', { description: newImport.indexNumber });
    return newImport;
  }, []);

  const updateImport = useCallback((id: string, data: Partial<ImportFormData>) => {
    setImports(prev => prev.map(imp => {
      if (imp.id !== id) return imp;
      const updated = { ...imp };
      if (data.blNumber) updated.blNumber = data.blNumber;
      if (data.importerName) updated.importerName = data.importerName;
      if (data.invoiceValue) {
        updated.invoiceValue = data.invoiceValue;
        updated.assessedValue = data.invoiceValue * updated.exchangeRate * 1.01;
        updated.customsDuty = updated.assessedValue * 0.15;
        updated.salesTax = (updated.assessedValue + updated.customsDuty) * 0.18;
        updated.totalDutyTax = updated.customsDuty + updated.salesTax + (updated.assessedValue * 0.055);
      }
      return updated;
    }));
    toast.success('Import updated');
  }, []);

  const updateStatus = useCallback((id: string, newStatus: ImportStatus) => {
    setImports(prev => prev.map(imp => {
      if (imp.id !== id) return imp;
      const updated = { ...imp, status: newStatus };
      
      if (newStatus === 'igm_filed') {
        updated.igmNumber = `IGM-2024-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;
        updated.igmDate = new Date();
      }
      if (newStatus === 'gd_filed') {
        updated.gdNumber = `GD-2024-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;
        updated.gdDate = new Date();
      }
      if (newStatus === 'duty_paid') updated.dutyPaidDate = new Date();
      if (newStatus === 'examined') updated.examDate = new Date();
      if (newStatus === 'released') updated.releaseDate = new Date();
      if (newStatus === 'delivered') updated.deliveryDate = new Date();
      
      return updated;
    }));
    toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
  }, []);

  const deleteImport = useCallback((id: string) => {
    const imp = imports.find(i => i.id === id);
    setImports(prev => prev.filter(i => i.id !== id));
    toast.success('Import deleted', { description: imp?.indexNumber });
  }, [imports]);

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
