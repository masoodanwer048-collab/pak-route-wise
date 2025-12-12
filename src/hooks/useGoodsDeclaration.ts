import { useState, useMemo, useCallback } from 'react';
import { GoodsDeclaration, TradeType } from '@/types/logistics';
import { toast } from 'sonner';

type GDStatus = 'draft' | 'submitted' | 'assessed' | 'paid' | 'examined' | 'released';

export interface GDFormData {
  gdType: 'import' | 'export' | 'transit' | 'transshipment';
  blNumber: string;
  importerName: string;
  importerNtn: string;
  exporterName: string;
  exporterNtn: string;
  customsStation: string;
  portOfEntry: string;
  hsCode: string;
  goodsDescription: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceValue: number;
  currency: string;
  exchangeRate: number;
  assessedValue: number;
}

interface UseGoodsDeclarationProps {
  gdType?: 'import' | 'export' | 'transit' | 'transshipment' | 'all';
}

const generateMockGDs = (): GoodsDeclaration[] => {
  const types: Array<'import' | 'export' | 'transit' | 'transshipment'> = ['import', 'export', 'transit', 'transshipment'];
  const statuses: GDStatus[] = ['draft', 'submitted', 'assessed', 'paid', 'examined', 'released'];
  const stations = ['Karachi', 'Port Qasim', 'Lahore Dry Port', 'Islamabad', 'Peshawar'];
  const ports = ['PKKAR', 'PKQAS', 'LAHORE_DP', 'PESHAWAR_DP', 'QUETTA_DP'];
  const hsCodes = ['8471.30.00', '5208.21.00', '8703.23.00', '8443.32.00', '8517.12.00', '8704.21.00'];
  const descriptions = [
    'Computer Hardware & Accessories',
    'Cotton Fabrics - Plain Weave',
    'Motor Vehicles for Transport',
    'Printing Machines & Parts',
    'Telecommunication Equipment',
    'Vehicle Parts & Accessories',
  ];

  const gds: GoodsDeclaration[] = [];
  
  for (let i = 1; i <= 25; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const stationIdx = Math.floor(Math.random() * stations.length);
    const hsIdx = Math.floor(Math.random() * hsCodes.length);
    const invoiceValue = Math.floor(Math.random() * 15000000) + 500000;
    const exchangeRate = 278.50;
    const assessedValue = invoiceValue * 1.1;
    const customsDuty = assessedValue * 0.15;
    const regulatoryDuty = type === 'import' ? assessedValue * 0.05 : 0;
    const salesTax = assessedValue * 0.18;
    const additionalSalesTax = assessedValue * 0.03;
    const withholdingTax = assessedValue * 0.055;

    gds.push({
      id: `gd-${i}`,
      gdNumber: `GD-2024-${String(45678 + i).padStart(6, '0')}`,
      gdType: type,
      status,
      shipmentId: `shipment-${i}`,
      blNumber: `MAEU${String(100000 + i * 1000).padStart(9, '0')}`,
      importer: {
        id: `imp-${i}`,
        name: ['ABC Trading Co.', 'XYZ Industries', 'Global Importers', 'National Traders', 'Premier Exports'][i % 5],
        ntn: `${1234567 + i}`,
        address: '123 Business Center',
        city: 'Karachi',
        country: 'Pakistan',
        contactPerson: 'Muhammad Ali',
        phone: '+92 300 1234567',
        email: 'info@company.com',
      },
      exporter: {
        id: `exp-${i}`,
        name: ['China Trading LLC', 'Dubai Exports', 'Singapore Corp', 'Hong Kong Ltd', 'Germany GmbH'][i % 5],
        ntn: 'N/A',
        address: 'International Trade Zone',
        city: 'Shanghai',
        country: 'China',
        contactPerson: 'John Smith',
        phone: '+86 123 456789',
        email: 'export@company.com',
      },
      customsStation: stations[stationIdx],
      portOfEntry: ports[stationIdx],
      hsCode: hsCodes[hsIdx],
      goodsDescription: descriptions[hsIdx],
      invoiceNumber: `INV-2024-${1000 + i}`,
      invoiceDate: new Date(2024, 0, Math.floor(Math.random() * 14) + 1),
      invoiceValue,
      currency: 'USD',
      exchangeRate,
      assessedValue,
      customsDuty,
      additionalCustomsDuty: assessedValue * 0.02,
      regulatoryDuty,
      salesTax,
      additionalSalesTax,
      withholdingTax,
      exciseDuty: 0,
      totalDutyTax: customsDuty + regulatoryDuty + salesTax + additionalSalesTax + withholdingTax,
      filingDate: new Date(2024, 0, Math.floor(Math.random() * 14) + 1),
      assessmentDate: status !== 'draft' && status !== 'submitted' ? new Date(2024, 0, Math.floor(Math.random() * 14) + 2) : undefined,
      paymentDate: status === 'paid' || status === 'examined' || status === 'released' ? new Date(2024, 0, Math.floor(Math.random() * 14) + 3) : undefined,
      releaseDate: status === 'released' ? new Date(2024, 0, Math.floor(Math.random() * 14) + 4) : undefined,
    });
  }

  return gds;
};

export function useGoodsDeclaration({ gdType = 'all' }: UseGoodsDeclarationProps = {}) {
  const [gds, setGDs] = useState<GoodsDeclaration[]>(generateMockGDs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GDStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'filingDate' | 'gdNumber' | 'invoiceValue'>('filingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredGDs = useMemo(() => {
    return gds
      .filter(gd => {
        // Type filter
        if (gdType !== 'all' && gd.gdType !== gdType) return false;
        
        // Status filter
        if (statusFilter !== 'all' && gd.status !== statusFilter) return false;
        
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            gd.gdNumber.toLowerCase().includes(query) ||
            gd.blNumber.toLowerCase().includes(query) ||
            gd.importer.name.toLowerCase().includes(query) ||
            gd.exporter.name.toLowerCase().includes(query) ||
            gd.hsCode.toLowerCase().includes(query) ||
            gd.goodsDescription.toLowerCase().includes(query)
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'filingDate':
            comparison = new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime();
            break;
          case 'gdNumber':
            comparison = a.gdNumber.localeCompare(b.gdNumber);
            break;
          case 'invoiceValue':
            comparison = a.invoiceValue - b.invoiceValue;
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [gds, gdType, statusFilter, searchQuery, sortField, sortOrder]);

  const stats = useMemo(() => {
    const typeFiltered = gdType === 'all' ? gds : gds.filter(g => g.gdType === gdType);
    return {
      total: typeFiltered.length,
      draft: typeFiltered.filter(g => g.status === 'draft').length,
      submitted: typeFiltered.filter(g => g.status === 'submitted').length,
      assessed: typeFiltered.filter(g => g.status === 'assessed').length,
      paid: typeFiltered.filter(g => g.status === 'paid').length,
      examined: typeFiltered.filter(g => g.status === 'examined').length,
      released: typeFiltered.filter(g => g.status === 'released').length,
      totalValue: typeFiltered.reduce((sum, g) => sum + g.invoiceValue, 0),
      totalDuty: typeFiltered.reduce((sum, g) => sum + g.totalDutyTax, 0),
    };
  }, [gds, gdType]);

  const addGD = useCallback((data: GDFormData) => {
    const newGD: GoodsDeclaration = {
      id: `gd-${Date.now()}`,
      gdNumber: `GD-2024-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      gdType: data.gdType,
      status: 'draft',
      shipmentId: `shipment-${Date.now()}`,
      blNumber: data.blNumber,
      importer: {
        id: `imp-${Date.now()}`,
        name: data.importerName,
        ntn: data.importerNtn,
        address: '',
        city: 'Karachi',
        country: 'Pakistan',
        contactPerson: '',
        phone: '',
        email: '',
      },
      exporter: {
        id: `exp-${Date.now()}`,
        name: data.exporterName,
        ntn: data.exporterNtn,
        address: '',
        city: '',
        country: '',
        contactPerson: '',
        phone: '',
        email: '',
      },
      customsStation: data.customsStation,
      portOfEntry: data.portOfEntry,
      hsCode: data.hsCode,
      goodsDescription: data.goodsDescription,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: new Date(data.invoiceDate),
      invoiceValue: data.invoiceValue,
      currency: data.currency,
      exchangeRate: data.exchangeRate,
      assessedValue: data.assessedValue,
      customsDuty: data.assessedValue * 0.15,
      additionalCustomsDuty: data.assessedValue * 0.02,
      regulatoryDuty: data.gdType === 'import' ? data.assessedValue * 0.05 : 0,
      salesTax: data.assessedValue * 0.18,
      additionalSalesTax: data.assessedValue * 0.03,
      withholdingTax: data.assessedValue * 0.055,
      exciseDuty: 0,
      totalDutyTax: 0,
      filingDate: new Date(),
    };
    
    newGD.totalDutyTax = newGD.customsDuty + newGD.additionalCustomsDuty + newGD.regulatoryDuty + 
      newGD.salesTax + newGD.additionalSalesTax + newGD.withholdingTax;

    setGDs(prev => [newGD, ...prev]);
    toast.success('GD created successfully', { description: newGD.gdNumber });
    return newGD;
  }, []);

  const updateGD = useCallback((id: string, data: Partial<GDFormData>) => {
    setGDs(prev => prev.map(gd => {
      if (gd.id !== id) return gd;
      
      const updated = { ...gd };
      if (data.blNumber) updated.blNumber = data.blNumber;
      if (data.hsCode) updated.hsCode = data.hsCode;
      if (data.goodsDescription) updated.goodsDescription = data.goodsDescription;
      if (data.invoiceValue) {
        updated.invoiceValue = data.invoiceValue;
        updated.assessedValue = data.invoiceValue * 1.1;
        updated.customsDuty = updated.assessedValue * 0.15;
        updated.regulatoryDuty = updated.gdType === 'import' ? updated.assessedValue * 0.05 : 0;
        updated.salesTax = updated.assessedValue * 0.18;
        updated.totalDutyTax = updated.customsDuty + updated.regulatoryDuty + updated.salesTax + 
          updated.additionalSalesTax + updated.withholdingTax;
      }
      
      return updated;
    }));
    toast.success('GD updated successfully');
  }, []);

  const updateStatus = useCallback((id: string, newStatus: GDStatus) => {
    setGDs(prev => prev.map(gd => {
      if (gd.id !== id) return gd;
      
      const updated = { ...gd, status: newStatus };
      if (newStatus === 'assessed') updated.assessmentDate = new Date();
      if (newStatus === 'paid') updated.paymentDate = new Date();
      if (newStatus === 'released') updated.releaseDate = new Date();
      
      return updated;
    }));
    toast.success(`GD status updated to ${newStatus}`);
  }, []);

  const deleteGD = useCallback((id: string) => {
    const gd = gds.find(g => g.id === id);
    setGDs(prev => prev.filter(g => g.id !== id));
    toast.success('GD deleted', { description: gd?.gdNumber });
  }, [gds]);

  return {
    gds: filteredGDs,
    allGDs: gds,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    addGD,
    updateGD,
    updateStatus,
    deleteGD,
  };
}
