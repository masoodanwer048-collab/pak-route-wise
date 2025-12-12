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
import { GoodsDeclaration, PAKISTAN_PORTS } from '@/types/logistics';
import { GDFormData } from '@/hooks/useGoodsDeclaration';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GDDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gd?: GoodsDeclaration | null;
  gdType?: 'import' | 'export' | 'transit' | 'transshipment';
  onSubmit: (data: GDFormData) => void;
}

const defaultFormData: GDFormData = {
  gdType: 'import',
  blNumber: '',
  importerName: '',
  importerNtn: '',
  exporterName: '',
  exporterNtn: '',
  customsStation: 'Karachi',
  portOfEntry: 'PKKAR',
  hsCode: '',
  goodsDescription: '',
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  invoiceValue: 0,
  currency: 'USD',
  exchangeRate: 278.50,
  assessedValue: 0,
};

export function GDDialog({ open, onOpenChange, gd, gdType, onSubmit }: GDDialogProps) {
  const [formData, setFormData] = useState<GDFormData>(defaultFormData);

  useEffect(() => {
    if (gd) {
      setFormData({
        gdType: gd.gdType,
        blNumber: gd.blNumber,
        importerName: gd.importer.name,
        importerNtn: gd.importer.ntn,
        exporterName: gd.exporter.name,
        exporterNtn: gd.exporter.ntn || '',
        customsStation: gd.customsStation,
        portOfEntry: gd.portOfEntry,
        hsCode: gd.hsCode,
        goodsDescription: gd.goodsDescription,
        invoiceNumber: gd.invoiceNumber,
        invoiceDate: new Date(gd.invoiceDate).toISOString().split('T')[0],
        invoiceValue: gd.invoiceValue,
        currency: gd.currency,
        exchangeRate: gd.exchangeRate,
        assessedValue: gd.assessedValue,
      });
    } else {
      setFormData({
        ...defaultFormData,
        gdType: gdType || 'import',
      });
    }
  }, [gd, gdType, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assessedValue = formData.invoiceValue * formData.exchangeRate * 1.01;
    onSubmit({ ...formData, assessedValue });
    onOpenChange(false);
  };

  const allPorts = [...PAKISTAN_PORTS.sea, ...PAKISTAN_PORTS.dry, ...PAKISTAN_PORTS.air, ...PAKISTAN_PORTS.border];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{gd ? 'Edit Goods Declaration' : 'New Goods Declaration'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GD Type & BL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GD Type</Label>
                <Select
                  value={formData.gdType}
                  onValueChange={(value: 'import' | 'export' | 'transit' | 'transshipment') => 
                    setFormData(prev => ({ ...prev, gdType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="transit">Transit</SelectItem>
                    <SelectItem value="transshipment">Transshipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>BL/AWB Number</Label>
                <Input
                  value={formData.blNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, blNumber: e.target.value }))}
                  placeholder="MAEU123456789"
                  required
                />
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
                  <Label>Exporter ID</Label>
                  <Input
                    value={formData.exporterNtn}
                    onChange={(e) => setFormData(prev => ({ ...prev, exporterNtn: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Customs Station & Port */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customs Station</Label>
                <Select
                  value={formData.customsStation}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, customsStation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Karachi">Karachi</SelectItem>
                    <SelectItem value="Port Qasim">Port Qasim</SelectItem>
                    <SelectItem value="Lahore Dry Port">Lahore Dry Port</SelectItem>
                    <SelectItem value="Islamabad">Islamabad</SelectItem>
                    <SelectItem value="Peshawar">Peshawar</SelectItem>
                    <SelectItem value="Quetta">Quetta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Port of Entry</Label>
                <Select
                  value={formData.portOfEntry}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, portOfEntry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allPorts.map(port => (
                      <SelectItem key={port.code} value={port.code}>
                        {port.name} ({port.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Label>Invoice Number</Label>
                  <Input
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="INV-2024-001"
                    required
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
            </div>

            {/* Value Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Value Details</h4>
              <div className="grid grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label>Exchange Rate (PKR)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.exchangeRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, exchangeRate: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent">
                {gd ? 'Update GD' : 'Create GD'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
