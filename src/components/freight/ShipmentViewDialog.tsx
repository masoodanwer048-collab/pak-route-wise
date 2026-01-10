import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FreightShipment } from '@/hooks/useFreightShipments';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Truck,
  Ship,
  Plane,
  Train,
  Package,
  Calendar,
  User,
  Building,
  Weight,
  Box,
} from 'lucide-react';

interface ShipmentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: FreightShipment | null;
}

const statusColors = {
  pending: 'bg-pending/10 text-pending border-pending/30',
  in_transit: 'bg-info/10 text-info border-info/30',
  customs_hold: 'bg-warning/10 text-warning border-warning/30',
  cleared: 'bg-success/10 text-success border-success/30',
  delivered: 'bg-success/10 text-success border-success/30',
  delayed: 'bg-destructive/10 text-destructive border-destructive/30',
};

const modeIcons = {
  road: Truck,
  sea: Ship,
  air: Plane,
  rail: Train,
};

export function ShipmentViewDialog({
  open,
  onOpenChange,
  shipment,
}: ShipmentViewDialogProps) {
  if (!shipment) return null;

  const ModeIcon = modeIcons[shipment.mode];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <ModeIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono">{shipment.reference}</span>
                <p className="text-sm font-normal text-muted-foreground capitalize">
                  {shipment.mode} Freight
                </p>
              </div>
            </DialogTitle>
            <Badge
              variant="outline"
              className={cn('capitalize', statusColors[shipment.status])}
            >
              {shipment.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Route */}
          <div className="rounded-lg border border-border p-4 bg-muted/30">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Route Information</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Origin</span>
                </div>
                <p className="font-medium mt-1">{shipment.origin}</p>
              </div>
              <div className="hidden sm:block text-muted-foreground">→</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Destination</span>
                </div>
                <p className="font-medium mt-1">{shipment.destination}</p>
              </div>
            </div>
          </div>

          {/* Carrier Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Building className="h-4 w-4" />
                <span>Carrier</span>
              </div>
              <p className="font-medium">{shipment.carrier}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ModeIcon className="h-4 w-4" />
                <span>{shipment.mode === 'road' ? 'Vehicle' : shipment.mode === 'sea' ? 'Vessel' : shipment.mode === 'air' ? 'Flight' : 'Train'}</span>
              </div>
              <p className="font-medium font-mono">{shipment.vehicle}</p>
            </div>
          </div>

          {/* Driver (if applicable) */}
          {shipment.driver && (
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                <span>{shipment.mode === 'road' ? 'Driver' : 'Operator'}</span>
              </div>
              <p className="font-medium">{shipment.driver}</p>
            </div>
          )}

          <Separator />

          {/* Cargo Details */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Cargo Details</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-lg border border-border p-3 text-center">
                <Weight className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="font-medium text-sm">{shipment.weight}</p>
                <p className="text-xs text-muted-foreground">Weight</p>
              </div>
              {shipment.volume && (
                <div className="rounded-lg border border-border p-3 text-center">
                  <Box className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="font-medium text-sm">{shipment.volume}</p>
                  <p className="text-xs text-muted-foreground">Volume</p>
                </div>
              )}
              <div className="rounded-lg border border-border p-3 text-center">
                <Package className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="font-medium text-sm">{shipment.containers}</p>
                <p className="text-xs text-muted-foreground">{shipment.mode === 'sea' ? 'Containers' : 'Units'}</p>
              </div>
              {shipment.packages !== undefined && shipment.packages > 0 && (
                <div className="rounded-lg border border-border p-3 text-center">
                  <Package className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="font-medium text-sm">{shipment.packages}</p>
                  <p className="text-xs text-muted-foreground">Packages</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Parties */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Parties</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shipment.consignor && (
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Consignor (Shipper)</p>
                  <p className="font-medium">{shipment.consignor}</p>
                </div>
              )}
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Consignee (Receiver)</p>
                <p className="font-medium">{shipment.consignee}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Schedule</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shipment.etd && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ETD (Departure)</p>
                    <p className="font-medium font-mono">{shipment.etd}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Calendar className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ETA (Arrival)</p>
                  <p className="font-medium font-mono">{shipment.eta}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {shipment.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{shipment.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
