import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GoodsDeclaration } from '@/types/logistics';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Send, 
  AlertCircle,
  Download,
  Printer,
  ArrowRight,
  Shield
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface GDViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gd: GoodsDeclaration | null;
  onUpdateStatus?: (id: string, status: string) => void;
}

const statusConfig = {
  draft: { color: 'bg-muted text-muted-foreground', icon: FileText, label: 'Draft' },
  submitted: { color: 'bg-info/10 text-info', icon: Send, label: 'Submitted' },
  assessed: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Assessed' },
  paid: { color: 'bg-accent/10 text-accent', icon: DollarSign, label: 'Paid' },
  examined: { color: 'bg-primary/10 text-primary', icon: Shield, label: 'Examined' },
  released: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Released' },
  hold: { color: 'bg-destructive/10 text-destructive', icon: AlertCircle, label: 'On Hold' },
};

const typeConfig = {
  import: 'bg-info/10 text-info border-info/20',
  export: 'bg-success/10 text-success border-success/20',
  transit: 'bg-warning/10 text-warning border-warning/20',
  transshipment: 'bg-primary/10 text-primary border-primary/20',
};

const formatCurrency = (value: number, currency = 'PKR') => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export function GDViewDialog({ open, onOpenChange, gd, onUpdateStatus }: GDViewDialogProps) {
  if (!gd) return null;

  const status = statusConfig[gd.status as keyof typeof statusConfig] || statusConfig.draft;
  const StatusIcon = status.icon;

  const nextStatus: Record<string, string | null> = {
    draft: 'submitted',
    submitted: 'assessed',
    assessed: 'paid',
    paid: 'examined',
    examined: 'released',
    released: null,
  };

  const nextStatusLabel: Record<string, string> = {
    draft: 'Submit to Customs',
    submitted: 'Mark as Assessed',
    assessed: 'Record Payment',
    paid: 'Mark Examined',
    examined: 'Release Goods',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono">{gd.gdNumber}</span>
              <Badge className={cn('capitalize', status.color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
              <Badge variant="outline" className={cn('capitalize', typeConfig[gd.gdType])}>
                {gd.gdType}
              </Badge>
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">BL/AWB Number</p>
                <p className="font-mono text-sm font-medium">{gd.blNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Filing Date</p>
                <p className="text-sm font-medium">{format(new Date(gd.filingDate), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customs Station</p>
                <p className="text-sm font-medium">{gd.customsStation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Port of Entry</p>
                <p className="text-sm font-medium">{gd.portOfEntry}</p>
              </div>
            </div>

            {/* Parties */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Importer</h4>
                <p className="font-medium">{gd.importer.name}</p>
                <p className="text-sm text-muted-foreground">NTN: {gd.importer.ntn}</p>
                <p className="text-sm text-muted-foreground">{gd.importer.city}, {gd.importer.country}</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Exporter</h4>
                <p className="font-medium">{gd.exporter.name}</p>
                <p className="text-sm text-muted-foreground">{gd.exporter.city}, {gd.exporter.country}</p>
              </div>
            </div>

            {/* Goods Details */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">Goods Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">HS Code</p>
                  <p className="font-mono font-medium">{gd.hsCode}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Invoice Number</p>
                  <p className="font-medium">{gd.invoiceNumber}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{gd.goodsDescription}</p>
              </div>
            </div>

            {/* Value & Duty Breakdown */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-4 text-sm text-muted-foreground">Value & Duty Breakdown</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Invoice Value</span>
                  <span className="font-mono">{formatCurrency(gd.invoiceValue, gd.currency)} ({gd.currency})</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-mono">PKR {gd.exchangeRate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Assessed Value</span>
                  <span className="font-mono font-medium">{formatCurrency(gd.assessedValue)}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Customs Duty (CD)</span>
                  <span className="font-mono">{formatCurrency(gd.customsDuty)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Additional CD (ACD)</span>
                  <span className="font-mono">{formatCurrency(gd.additionalCustomsDuty)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Regulatory Duty (RD)</span>
                  <span className="font-mono">{formatCurrency(gd.regulatoryDuty)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Sales Tax (ST)</span>
                  <span className="font-mono">{formatCurrency(gd.salesTax)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Additional ST</span>
                  <span className="font-mono">{formatCurrency(gd.additionalSalesTax)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Withholding Tax (WHT)</span>
                  <span className="font-mono">{formatCurrency(gd.withholdingTax)}</span>
                </div>

                <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3 -mx-3">
                  <span className="font-semibold">Total Duty & Taxes</span>
                  <span className="font-mono font-bold text-lg text-accent">{formatCurrency(gd.totalDutyTax)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-4 text-sm text-muted-foreground">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Filed</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(gd.filingDate), 'dd MMM yyyy HH:mm')}</p>
                  </div>
                </div>
                {gd.assessmentDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Assessed</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(gd.assessmentDate), 'dd MMM yyyy HH:mm')}</p>
                    </div>
                  </div>
                )}
                {gd.paymentDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(gd.paymentDate), 'dd MMM yyyy HH:mm')}</p>
                    </div>
                  </div>
                )}
                {gd.releaseDate && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Released</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(gd.releaseDate), 'dd MMM yyyy HH:mm')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* Actions */}
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
          {nextStatus[gd.status] && onUpdateStatus && (
            <Button 
              variant="accent" 
              size="sm"
              onClick={() => onUpdateStatus(gd.id, nextStatus[gd.status]!)}
            >
              {nextStatusLabel[gd.status]}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
