import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Party } from '@/types/logistics';

type GDStatus = 'draft' | 'submitted' | 'assessed' | 'paid' | 'examined' | 'released';
type GDType = 'import' | 'export' | 'transit' | 'transshipment';

export interface GDFormData {
  gdType: GDType;
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

// Local GoodsDeclaration type with string dates for easier handling
export interface GoodsDeclarationLocal {
  id: string;
  gdNumber: string;
  gdType: GDType;
  status: GDStatus;
  shipmentId: string;
  blNumber: string;
  importer: Party;
  exporter: Party;
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
  customsDuty: number;
  additionalCustomsDuty: number;
  regulatoryDuty: number;
  salesTax: number;
  additionalSalesTax: number;
  withholdingTax: number;
  exciseDuty: number;
  totalDutyTax: number;
  filingDate: string;
  assessmentDate?: string;
  paymentDate?: string;
  releaseDate?: string;
}

interface UseGoodsDeclarationProps {
  gdType?: GDType | 'all';
}

const generateMockGDs = (): GoodsDeclarationLocal[] => {
  return [
    {
      id: '1',
      gdNumber: 'GD-2024-001234',
      gdType: 'import',
      status: 'released',
      shipmentId: 'SHP-001',
      blNumber: 'MAEU123456789',
      importer: { id: '1', name: 'Allied Electronics Ltd', ntn: '1234567-8', address: 'Karachi', city: 'Karachi', country: 'Pakistan', contactPerson: 'Ahmed', phone: '+92-21-1234567', email: 'info@allied.pk' },
      exporter: { id: '2', name: 'Samsung Korea', ntn: 'KR-12345', address: 'Seoul', city: 'Seoul', country: 'South Korea', contactPerson: 'Kim', phone: '+82-123-456', email: 'export@samsung.kr' },
      customsStation: 'Karachi Port',
      portOfEntry: 'Port Qasim',
      hsCode: '8471.30.0000',
      goodsDescription: 'Laptop Computers, 500 units',
      invoiceNumber: 'INV-2024-00123',
      invoiceDate: '2024-01-15',
      invoiceValue: 125000,
      currency: 'USD',
      exchangeRate: 278.50,
      assessedValue: 35187500,
      customsDuty: 5278125,
      additionalCustomsDuty: 0,
      regulatoryDuty: 351875,
      salesTax: 7333050,
      additionalSalesTax: 1759450,
      withholdingTax: 703750,
      exciseDuty: 0,
      totalDutyTax: 15426250,
      filingDate: '2024-01-16',
      assessmentDate: '2024-01-17',
      paymentDate: '2024-01-18',
      releaseDate: '2024-01-19',
    },
    {
      id: '2',
      gdNumber: 'GD-2024-001235',
      gdType: 'import',
      status: 'assessed',
      shipmentId: 'SHP-002',
      blNumber: 'HLCU987654321',
      importer: { id: '3', name: 'Textile Mills Pakistan', ntn: '9876543-2', address: 'Lahore', city: 'Lahore', country: 'Pakistan', contactPerson: 'Ali', phone: '+92-42-9876543', email: 'info@textiles.pk' },
      exporter: { id: '4', name: 'Cotton Corp China', ntn: 'CN-54321', address: 'Shanghai', city: 'Shanghai', country: 'China', contactPerson: 'Wang', phone: '+86-21-54321', email: 'export@cotton.cn' },
      customsStation: 'Lahore Dry Port',
      portOfEntry: 'KICT',
      hsCode: '5201.00.0000',
      goodsDescription: 'Raw Cotton, 100 Bales',
      invoiceNumber: 'INV-2024-00456',
      invoiceDate: '2024-01-18',
      invoiceValue: 75000,
      currency: 'USD',
      exchangeRate: 278.50,
      assessedValue: 21112500,
      customsDuty: 1055625,
      additionalCustomsDuty: 0,
      regulatoryDuty: 0,
      salesTax: 3990187,
      additionalSalesTax: 0,
      withholdingTax: 422250,
      exciseDuty: 0,
      totalDutyTax: 5468062,
      filingDate: '2024-01-19',
      assessmentDate: '2024-01-20',
    },
    {
      id: '3',
      gdNumber: 'GD-2024-001236',
      gdType: 'export',
      status: 'submitted',
      shipmentId: 'SHP-003',
      blNumber: 'OOCL456789123',
      importer: { id: '5', name: 'Dubai Trading LLC', ntn: 'UAE-11111', address: 'Dubai', city: 'Dubai', country: 'UAE', contactPerson: 'Mohammed', phone: '+971-4-1234567', email: 'info@dubaitrading.ae' },
      exporter: { id: '6', name: 'Pakistan Rice Export', ntn: '1111111-1', address: 'Karachi', city: 'Karachi', country: 'Pakistan', contactPerson: 'Hassan', phone: '+92-21-1111111', email: 'export@pkrice.pk' },
      customsStation: 'Karachi Port',
      portOfEntry: 'PICT',
      hsCode: '1006.30.0000',
      goodsDescription: 'Basmati Rice, 500 MT',
      invoiceNumber: 'EXP-2024-00789',
      invoiceDate: '2024-01-20',
      invoiceValue: 250000,
      currency: 'USD',
      exchangeRate: 278.50,
      assessedValue: 70312500,
      customsDuty: 0,
      additionalCustomsDuty: 0,
      regulatoryDuty: 0,
      salesTax: 0,
      additionalSalesTax: 0,
      withholdingTax: 0,
      exciseDuty: 0,
      totalDutyTax: 0,
      filingDate: '2024-01-21',
    },
  ];
};

export function useGoodsDeclaration({ gdType = 'all' }: UseGoodsDeclarationProps = {}) {
  const [gds, setGDs] = useState<GoodsDeclarationLocal[]>(generateMockGDs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GDStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'filingDate' | 'gdNumber' | 'invoiceValue'>('filingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredGDs = useMemo(() => {
    return gds
      .filter(gd => {
        if (gdType !== 'all' && gd.gdType !== gdType) return false;
        if (statusFilter !== 'all' && gd.status !== statusFilter) return false;

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            gd.gdNumber.toLowerCase().includes(query) ||
            gd.blNumber.toLowerCase().includes(query) ||
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
            comparison = new Date(a.filingDate || 0).getTime() - new Date(b.filingDate || 0).getTime();
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
    const customsDuty = data.assessedValue * 0.15;
    const salesTax = data.assessedValue * 0.18;
    const totalDuty = customsDuty + salesTax;

    const newGD: GoodsDeclarationLocal = {
      id: `gd-${Date.now()}`,
      gdNumber: `GD-${new Date().getFullYear()}-${String(gds.length + 1).padStart(6, '0')}`,
      gdType: data.gdType,
      status: 'draft',
      shipmentId: '',
      blNumber: data.blNumber,
      importer: { id: '1', name: data.importerName, ntn: data.importerNtn, address: '', city: '', country: 'Pakistan', contactPerson: '', phone: '', email: '' },
      exporter: { id: '2', name: data.exporterName, ntn: data.exporterNtn, address: '', city: '', country: '', contactPerson: '', phone: '', email: '' },
      customsStation: data.customsStation,
      portOfEntry: data.portOfEntry,
      hsCode: data.hsCode,
      goodsDescription: data.goodsDescription,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate,
      invoiceValue: data.invoiceValue,
      currency: data.currency,
      exchangeRate: data.exchangeRate,
      assessedValue: data.assessedValue,
      customsDuty,
      additionalCustomsDuty: 0,
      regulatoryDuty: 0,
      salesTax,
      additionalSalesTax: 0,
      withholdingTax: 0,
      exciseDuty: 0,
      totalDutyTax: totalDuty,
      filingDate: new Date().toISOString().split('T')[0],
    };

    setGDs(prev => [newGD, ...prev]);
    toast.success('GD Created');
  }, [gds.length]);

  const updateGD = useCallback((id: string, data: GDFormData) => {
    setGDs(prev => prev.map(gd => {
      if (gd.id !== id) return gd;
      
      const customsDuty = data.assessedValue * 0.15;
      const salesTax = data.assessedValue * 0.18;
      const totalDuty = customsDuty + salesTax;

      return {
        ...gd,
        gdType: data.gdType,
        blNumber: data.blNumber,
        importer: { ...gd.importer, name: data.importerName, ntn: data.importerNtn },
        exporter: { ...gd.exporter, name: data.exporterName, ntn: data.exporterNtn },
        customsStation: data.customsStation,
        portOfEntry: data.portOfEntry,
        hsCode: data.hsCode,
        goodsDescription: data.goodsDescription,
        invoiceNumber: data.invoiceNumber,
        invoiceDate: data.invoiceDate,
        invoiceValue: data.invoiceValue,
        currency: data.currency,
        exchangeRate: data.exchangeRate,
        assessedValue: data.assessedValue,
        customsDuty,
        salesTax,
        totalDutyTax: totalDuty,
      };
    }));
    toast.success('GD Updated');
  }, []);

  const updateStatus = useCallback((id: string, newStatus: GDStatus) => {
    setGDs(prev => prev.map(gd => {
      if (gd.id !== id) return gd;
      
      const updates: Partial<GoodsDeclarationLocal> = { status: newStatus };
      const today = new Date().toISOString().split('T')[0];
      
      if (newStatus === 'submitted') updates.filingDate = today;
      if (newStatus === 'assessed') updates.assessmentDate = today;
      if (newStatus === 'paid') updates.paymentDate = today;
      if (newStatus === 'released') updates.releaseDate = today;
      
      return { ...gd, ...updates };
    }));
    toast.success(`Status updated to ${newStatus}`);
  }, []);

  const deleteGD = useCallback((id: string) => {
    setGDs(prev => prev.filter(gd => gd.id !== id));
    toast.success('GD Deleted');
  }, []);

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
