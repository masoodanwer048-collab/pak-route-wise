import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ImportStatus = 'pending' | 'igm_filed' | 'gd_filed' | 'assessed' | 'duty_paid' | 'examined' | 'released' | 'delivered';

export interface ImportShipment {
  id: string;
  indexNumber: string;
  igmNumber: string;
  igmDate: string; // Changed to string for serialization
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
  gdDate?: string;
  dutyPaidDate?: string;
  examDate?: string;
  releaseDate?: string;
  deliveryDate?: string;
  status: ImportStatus;
  terminal: string;
  createdAt: string;
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

const mapToImport = (row: any): ImportShipment => ({
  id: row.id,
  indexNumber: row.index_number || 'N/A',
  igmNumber: row.igm_number || '',
  igmDate: row.igm_date || '',
  blNumber: row.bl_number || '',
  blDate: row.bl_date || '',
  vesselName: row.vessel_name || '',
  voyageNumber: row.voyage_number || '',
  portOfLoading: row.port_of_loading || '',
  portOfDischarge: row.port_of_discharge || '',
  importerName: row.importer_name || '',
  importerNtn: row.importer_ntn || '',
  exporterName: row.exporter_name || '',
  countryOfOrigin: row.country_of_origin || '',
  hsCode: row.hs_code || '',
  goodsDescription: row.goods_description || '',
  packages: row.packages || 0,
  packageType: row.package_type || '',
  grossWeight: row.gross_weight || 0,
  netWeight: row.net_weight || 0,
  containerNumbers: Array.isArray(row.container_numbers) ? row.container_numbers : [],
  invoiceNumber: row.invoice_number || '',
  invoiceValue: row.invoice_value || 0,
  currency: row.currency || 'USD',
  exchangeRate: row.exchange_rate || 278.50,
  assessedValue: row.assessed_value || 0,
  customsDuty: row.customs_duty || 0,
  salesTax: row.sales_tax || 0,
  totalDutyTax: row.total_duty_tax || 0,
  gdNumber: row.gd_number,
  gdDate: row.gd_date,
  dutyPaidDate: row.duty_paid_date,
  examDate: row.exam_date,
  releaseDate: row.release_date,
  deliveryDate: row.delivery_date,
  status: (row.status as ImportStatus) || 'pending',
  terminal: row.terminal || '',
  createdAt: row.created_at,
});

export function useImports() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ImportStatus | 'all'>('all');
  const [terminalFilter, setTerminalFilter] = useState<string>('all');

  const { data: imports = [], isLoading } = useQuery({
    queryKey: ['imports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch Imports error:', error);
        if (error.code === '42P01') {
          toast.error('DB Setup required: "imports" table missing.');
        } else {
          toast.error('Failed to load imports');
        }
        return [];
      }
      return data.map(mapToImport);
    },
  });

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

  const addImportMutation = useMutation({
    mutationFn: async (data: ImportFormData) => {
      const exchangeRate = 278.50;
      const assessedValue = data.invoiceValue * exchangeRate * 1.01;
      const customsDuty = assessedValue * 0.15;
      const salesTax = (assessedValue + customsDuty) * 0.18;
      const totalDuty = customsDuty + salesTax + (assessedValue * 0.055);

      const { data: newRow, error } = await supabase
        .from('imports')
        .insert({
          index_number: `IMP-${Date.now()}`,
          bl_number: data.blNumber,
          bl_date: data.blDate, // Ensure date string format YYYY-MM-DD
          vessel_name: data.vesselName,
          voyage_number: data.voyageNumber,
          port_of_loading: data.portOfLoading,
          port_of_discharge: data.portOfDischarge,
          importer_name: data.importerName,
          importer_ntn: data.importerNtn,
          exporter_name: data.exporterName,
          country_of_origin: data.countryOfOrigin,
          hs_code: data.hsCode,
          goods_description: data.goodsDescription,
          packages: data.packages,
          package_type: data.packageType,
          gross_weight: data.grossWeight,
          net_weight: data.netWeight,
          container_numbers: data.containerNumbers.split(',').map(c => c.trim()), // TS expects string[] here if typed correctly
          invoice_number: data.invoiceNumber,
          invoice_value: data.invoiceValue,
          currency: data.currency,
          terminal: data.terminal,

          exchange_rate: exchangeRate,
          assessed_value: assessedValue,
          customs_duty: customsDuty,
          sales_tax: salesTax,
          total_duty_tax: totalDuty,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return mapToImport(newRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      toast.success('Import created');
    },
    onError: (err: any) => {
      toast.error(`Error creating Import: ${err.message}`);
    }
  });

  const updateImport = useCallback(() => toast.info('Update not implemented in demo'), []);
  const updateStatus = useCallback(() => toast.info('Status update not implemented'), []);
  const deleteImport = useCallback(() => toast.info('Delete not implemented'), []);

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
    addImport: addImportMutation.mutate, // Expose mutate as addImport
    updateImport,
    updateStatus,
    deleteImport,
  };
}
