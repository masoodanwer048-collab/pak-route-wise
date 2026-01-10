import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

const mapToGD = (row: any): GoodsDeclaration => ({
  id: row.id,
  gdNumber: row.gd_number,
  gdType: row.gd_type,
  status: row.status as GDStatus,
  shipmentId: row.shipment_id || '',
  blNumber: row.bl_number || '',
  importer: {
    id: row.importer_id || 'unknown',
    name: 'Importer Name (Pending Join)', // In real app, join with customers table
    ntn: 'N/A',
    address: '',
    city: '',
    country: '',
    contactPerson: '',
    phone: '',
    email: '',
  },
  exporter: {
    id: 'unknown',
    name: row.exporter_name || 'Unknown Exporter',
    ntn: 'N/A',
    address: '',
    city: '',
    country: '',
    contactPerson: '',
    phone: '',
    email: '',
  },
  customsStation: row.customs_station || '',
  portOfEntry: row.port_of_entry || '',
  hsCode: row.hs_code || '',
  goodsDescription: row.goods_description || '',
  invoiceNumber: row.invoice_number || '',
  invoiceDate: row.invoice_date || new Date().toISOString(),
  invoiceValue: row.invoice_value || 0,
  currency: row.currency || 'USD',
  exchangeRate: row.exchange_rate || 278.50,
  assessedValue: row.assessed_value || 0,
  customsDuty: row.customs_duty || 0,
  additionalCustomsDuty: 0,
  regulatoryDuty: row.regulatory_duty || 0,
  salesTax: row.sales_tax || 0,
  additionalSalesTax: row.additional_sales_tax || 0,
  withholdingTax: row.withholding_tax || 0,
  exciseDuty: row.federal_excise_duty || 0,
  totalDutyTax: row.total_duty_tax || 0,
  filingDate: row.filing_date,
  assessmentDate: row.assessment_date,
  paymentDate: row.payment_date,
  releaseDate: row.release_date,
});

export function useGoodsDeclaration({ gdType = 'all' }: UseGoodsDeclarationProps = {}) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GDStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'filingDate' | 'gdNumber' | 'invoiceValue'>('filingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: gds = [], isLoading } = useQuery({
    queryKey: ['goods_declarations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goods_declarations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch GDs error:', error);
        if (error.code === '42P01') {
          toast.error('DB Setup required: "goods_declarations" table missing.');
        } else {
          toast.error('Failed to load declarations');
        }
        return [];
      }
      return data.map(mapToGD);
    },
  });

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
      .sort((a, b) => { // Client side sort for now
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

  const addGDMutation = useMutation({
    mutationFn: async (data: GDFormData) => {
      // Calculate duties roughly for demo insert
      const customsDuty = data.assessedValue * 0.15;
      const salesTax = data.assessedValue * 0.18;
      const totalDuty = customsDuty + salesTax; // simplified

      const { data: newRow, error } = await supabase
        .from('goods_declarations')
        .insert({
          gd_number: `GD-${Date.now()}`, // Temporary ID gen
          gd_type: data.gdType,
          status: 'draft',
          bl_number: data.blNumber,
          exporter_name: data.exporterName,
          customs_station: data.customsStation,
          port_of_entry: data.portOfEntry,
          hs_code: data.hsCode,
          goods_description: data.goodsDescription,
          invoice_number: data.invoiceNumber,
          invoice_date: data.invoiceDate,
          invoice_value: data.invoiceValue,
          currency: data.currency,
          exchange_rate: data.exchangeRate,
          assessed_value: data.assessedValue,
          customs_duty: customsDuty,
          sales_tax: salesTax,
          total_duty_tax: totalDuty
        })
        .select()
        .single();

      if (error) throw error;
      return mapToGD(newRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods_declarations'] });
      toast.success('GD Created');
    },
    onError: (err: any) => {
      toast.error(`Error creating GD: ${err.message}`);
    }
  });

  // Stubs for update/delete/status logic to avoid breaking UI that expects them
  // In a real migration we'd implement real mutations for each
  const updateGD = useCallback(() => toast.info('Update not fully implemented in demo migration'), []);
  const updateStatus = useCallback(() => toast.info('Status update not fully implemented'), []);
  const deleteGD = useCallback(() => toast.info('Delete not fully implemented'), []);

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
    addGD: addGDMutation.mutate,
    updateGD,
    updateStatus,
    deleteGD,
  };
}
