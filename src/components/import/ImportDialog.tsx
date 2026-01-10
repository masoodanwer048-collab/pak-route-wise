import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImportShipment, ImportFormData } from '@/hooks/useImports';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PAKISTAN_PORTS } from '@/types/logistics';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData?: ImportShipment | null;
  onSubmit: (data: ImportFormData) => void;
}

const defaultFormData: ImportFormData = {
  blNumber: '',
  blDate: new Date().toISOString().split('T')[0],
  vesselName: '',
  voyageNumber: '',
  portOfLoading: '',
  portOfDischarge: 'PKKAR',
  importerName: '',
  importerNtn: '',
  exporterName: '',
  countryOfOrigin: '',
  hsCode: '',
  goodsDescription: '',
  packages: 0,
  packageType: 'Cartons',
  grossWeight: 0,
  netWeight: 0,
  containerNumbers: '',
  invoiceNumber: '',
  invoiceValue: 0,
  currency: 'USD',
  terminal: 'PICT',
};

export function ImportDialog({ open, onOpenChange, importData, onSubmit }: ImportDialogProps) {
  const [formData, setFormData] = useState<ImportFormData>(defaultFormData);

  useEffect(() => {
    if (importData) {
      setFormData({
        blNumber: importData.blNumber,
        blDate: new Date(importData.blDate).toISOString().split('T')[0],
        vesselName: importData.vesselName,
        voyageNumber: importData.voyageNumber,
        portOfLoading: importData.portOfLoading,
        portOfDischarge: importData.portOfDischarge,
        importerName: importData.importerName,
        importerNtn: importData.importerNtn,
        exporterName: importData.exporterName,
        countryOfOrigin: importData.countryOfOrigin,
        hsCode: importData.hsCode,
        goodsDescription: importData.goodsDescription,
        packages: importData.packages,
        packageType: importData.packageType,
        grossWeight: importData.grossWeight,
        netWeight: importData.netWeight,
        containerNumbers: importData.containerNumbers.join(', '),
        invoiceNumber: importData.invoiceNumber,
        invoiceValue: importData.invoiceValue,
        currency: importData.currency,
        terminal: importData.terminal,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [importData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const terminals = ['PICT', 'KICT', 'QICT', 'SAPT', 'KPT'];
  const countries = ['China', 'UAE', 'Germany', 'USA', 'Japan', 'South Korea', 'Turkey', 'Malaysia', 'Singapore', 'India'];
  const portOptions = [...PAKISTAN_PORTS.sea, ...PAKISTAN_PORTS.air];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{importData ? 'Edit Import' : 'New Import Shipment'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* BL & Vessel Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Bill of Lading Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>BL Number</Label>
                  <Input
                    value={formData.blNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, blNumber: e.target.value }))}
                    placeholder="MAEU123456789"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>BL Date</Label>
                  <Input
                    type="date"
                    value={formData.blDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, blDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vessel Name</Label>
                  <Input
                    value={formData.vesselName}
                    onChange={(e) => setFormData(prev => ({ ...prev, vesselName: e.target.value }))}
                    placeholder="MSC ANNA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Voyage Number</Label>
                  <Input
                    value={formData.voyageNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, voyageNumber: e.target.value }))}
                    placeholder="V123E"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Port & Terminal */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Port of Loading</Label>
                <Input
                  value={formData.portOfLoading}
                  onChange={(e) => setFormData(prev => ({ ...prev, portOfLoading: e.target.value }))}
                  placeholder="Shanghai"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Port of Discharge</Label>
                <Select
                  value={formData.portOfDischarge}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, portOfDischarge: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {portOptions.map(port => (
                      <SelectItem key={port.code} value={port.code}>{port.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Terminal</Label>
                <Select
                  value={formData.terminal}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, terminal: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {terminals.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Importer Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Importer Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Importer Name</Label>
                  <Input
                    value={formData.importerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, importerName: e.target.value }))}
                    placeholder="ABC Trading Co."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>NTN</Label>
                  <Input
                    value={formData.importerNtn}
                    onChange={(e) => setFormData(prev => ({ ...prev, importerNtn: e.target.value }))}
                    placeholder="1234567-8"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Exporter Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Exporter Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exporter Name</Label>
                  <Input
                    value={formData.exporterName}
                    onChange={(e) => setFormData(prev => ({ ...prev, exporterName: e.target.value }))}
                    placeholder="China Trading LLC"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country of Origin</Label>
                  <Select
                    value={formData.countryOfOrigin}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, countryOfOrigin: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Goods Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Goods Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>HS Code</Label>
                  <Input
                    value={formData.hsCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, hsCode: e.target.value }))}
                    placeholder="8471.30.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Container Numbers</Label>
                  <Input
                    value={formData.containerNumbers}
                    onChange={(e) => setFormData(prev => ({ ...prev, containerNumbers: e.target.value }))}
                    placeholder="MAEU1234567, MAEU7654321"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Goods Description</Label>
                <Textarea
                  value={formData.goodsDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, goodsDescription: e.target.value }))}
                  placeholder="Computer Hardware & Accessories"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Packages</Label>
                  <Input
                    type="number"
                    value={formData.packages}
                    onChange={(e) => setFormData(prev => ({ ...prev, packages: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Package Type</Label>
                  <Select
                    value={formData.packageType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, packageType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cartons">Cartons</SelectItem>
                      <SelectItem value="Pallets">Pallets</SelectItem>
                      <SelectItem value="Crates">Crates</SelectItem>
                      <SelectItem value="Drums">Drums</SelectItem>
                      <SelectItem value="Bags">Bags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gross Weight (KG)</Label>
                  <Input
                    type="number"
                    value={formData.grossWeight}
                    onChange={(e) => setFormData(prev => ({ ...prev, grossWeight: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net Weight (KG)</Label>
                  <Input
                    type="number"
                    value={formData.netWeight}
                    onChange={(e) => setFormData(prev => ({ ...prev, netWeight: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Invoice Details</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="INV-2024-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Value</Label>
                  <Input
                    type="number"
                    value={formData.invoiceValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceValue: Number(e.target.value) }))}
                    placeholder="10000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CNY">CNY</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent">
                {importData ? 'Update Import' : 'Create Import'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
