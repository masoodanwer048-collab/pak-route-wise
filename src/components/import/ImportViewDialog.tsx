import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImportShipment, ImportStatus } from '@/hooks/useImports';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Ship,
  Package,
  Download,
  Printer,
  ArrowRight,
  Shield,
  Truck,
  Container,
  FileCheck
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ImportViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData: ImportShipment | null;
  onUpdateStatus?: (id: string, status: ImportStatus) => void;
}

const statusConfig: Record<ImportStatus, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: 'bg-muted text-muted-foreground', icon: FileText, label: 'Pending' },
  igm_filed: { color: 'bg-info/10 text-info', icon: Ship, label: 'IGM Filed' },
  gd_filed: { color: 'bg-primary/10 text-primary', icon: FileCheck, label: 'GD Filed' },
  assessed: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Assessed' },
  duty_paid: { color: 'bg-accent/10 text-accent', icon: DollarSign, label: 'Duty Paid' },
  examined: { color: 'bg-primary/10 text-primary', icon: Shield, label: 'Examined' },
  released: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Released' },
  delivered: { color: 'bg-success/10 text-success', icon: Truck, label: 'Delivered' },
};

const formatCurrency = (value: number, currency = 'PKR') => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export function ImportViewDialog({ open, onOpenChange, importData, onUpdateStatus }: ImportViewDialogProps) {
  if (!importData) return null;

  const status = statusConfig[importData.status];
  const StatusIcon = status.icon;

  const nextStatus: Record<ImportStatus, ImportStatus | null> = {
    pending: 'igm_filed',
    igm_filed: 'gd_filed',
    gd_filed: 'assessed',
    assessed: 'duty_paid',
    duty_paid: 'examined',
    examined: 'released',
    released: 'delivered',
    delivered: null,
  };

  const nextStatusLabel: Record<ImportStatus, string> = {
    pending: 'File IGM',
    igm_filed: 'File GD',
    gd_filed: 'Mark Assessed',
    assessed: 'Record Duty Payment',
    duty_paid: 'Mark Examined',
    examined: 'Release Cargo',
    released: 'Mark Delivered',
    delivered: '',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono">{importData.indexNumber}</span>
              <Badge className={cn('capitalize', status.color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">BL Number</p>
                <p className="font-mono text-sm font-medium">{importData.blNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">IGM Number</p>
                <p className="font-mono text-sm font-medium">{importData.igmNumber || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">GD Number</p>
                <p className="font-mono text-sm font-medium">{importData.gdNumber || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Terminal</p>
                <p className="text-sm font-medium">{importData.terminal}</p>
              </div>
            </div>

            {/* Vessel & Route */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-3 text-sm text-muted-foreground flex items-center gap-2">
                <Ship className="h-4 w-4" />
                Vessel & Route
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Vessel</p>
                  <p className="font-medium">{importData.vesselName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Voyage</p>
                  <p className="font-medium">{importData.voyageNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Port of Loading</p>
                  <p className="font-medium">{importData.portOfLoading}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Port of Discharge</p>
                  <p className="font-medium">{importData.portOfDischarge}</p>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Importer</h4>
                <p className="font-medium">{importData.importerName}</p>
                <p className="text-sm text-muted-foreground">NTN: {importData.importerNtn}</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Exporter</h4>
                <p className="font-medium">{importData.exporterName}</p>
                <p className="text-sm text-muted-foreground">Origin: {importData.countryOfOrigin}</p>
              </div>
            </div>

            {/* Cargo Details */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-3 text-sm text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                Cargo Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">HS Code</p>
                  <p className="font-mono font-medium">{importData.hsCode}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Packages</p>
                  <p className="font-medium">{importData.packages} {importData.packageType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gross Weight</p>
                  <p className="font-medium">{importData.grossWeight.toLocaleString()} KG</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net Weight</p>
                  <p className="font-medium">{importData.netWeight.toLocaleString()} KG</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{importData.goodsDescription}</p>
              </div>
              {importData.containerNumbers.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Container className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {importData.containerNumbers.map((cn, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono">{cn}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Value & Duty */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-4 text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Value & Duty
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Invoice Value</span>
                  <span className="font-mono">{formatCurrency(importData.invoiceValue, importData.currency)} ({importData.currency})</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-mono">PKR {importData.exchangeRate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Assessed Value</span>
                  <span className="font-mono font-medium">{formatCurrency(importData.assessedValue)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Customs Duty</span>
                  <span className="font-mono">{formatCurrency(importData.customsDuty)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Sales Tax</span>
                  <span className="font-mono">{formatCurrency(importData.salesTax)}</span>
                </div>
                <div className="flex justify-between py-3 bg-accent/10 rounded-lg px-3 -mx-3">
                  <span className="font-semibold">Total Duty & Taxes</span>
                  <span className="font-mono font-bold text-lg text-accent">{formatCurrency(importData.totalDutyTax)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-4 text-sm text-muted-foreground">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Ship className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">BL Issued</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(importData.blDate), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                {importData.igmNumber && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-info" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">IGM Filed - {importData.igmNumber}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(importData.igmDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
                {importData.gdDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">GD Filed - {importData.gdNumber}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(importData.gdDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
                {importData.dutyPaidDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duty Paid</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(importData.dutyPaidDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
                {importData.examDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Examination Complete</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(importData.examDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
                {importData.releaseDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cargo Released</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(importData.releaseDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
                {importData.deliveryDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Delivered</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(importData.deliveryDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
          {nextStatus[importData.status] && onUpdateStatus && (
            <Button 
              variant="accent" 
              size="sm"
              onClick={() => onUpdateStatus(importData.id, nextStatus[importData.status]!)}
            >
              {nextStatusLabel[importData.status]}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
