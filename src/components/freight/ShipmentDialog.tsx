import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FreightShipment } from '@/hooks/useFreightShipments';
import { TransportMode, ShipmentStatus } from '@/types/logistics';

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: TransportMode;
  shipment?: FreightShipment | null;
  onSave: (shipment: Omit<FreightShipment, 'id' | 'createdAt'>) => void;
}

const modeLabels: Record<TransportMode, { vehicle: string; driver?: string }> = {
  road: { vehicle: 'Truck Number', driver: 'Driver Name' },
  sea: { vehicle: 'Vessel Name' },
  air: { vehicle: 'Flight Number' },
  rail: { vehicle: 'Train Number', driver: 'Conductor' },
};

const statusOptions: ShipmentStatus[] = ['pending', 'in_transit', 'customs_hold', 'cleared', 'delivered', 'delayed'];

export function ShipmentDialog({
  open,
  onOpenChange,
  mode,
  shipment,
  onSave,
}: ShipmentDialogProps) {
  const [formData, setFormData] = useState<Partial<FreightShipment>>({
    mode,
    status: 'pending',
    origin: '',
    destination: '',
    carrier: '',
    vehicle: '',
    driver: '',
    weight: '',
    volume: '',
    containers: 1,
    packages: 0,
    consignee: '',
    consignor: '',
    eta: '',
    etd: '',
    notes: '',
  });

  useEffect(() => {
    if (shipment) {
      setFormData(shipment);
    } else {
      setFormData({
        mode,
        status: 'pending',
        origin: '',
        destination: '',
        carrier: '',
        vehicle: '',
        driver: '',
        weight: '',
        volume: '',
        containers: 1,
        packages: 0,
        consignee: '',
        consignor: '',
        eta: '',
        etd: '',
        notes: '',
      });
    }
  }, [shipment, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      reference: formData.reference || `${mode.toUpperCase().slice(0, 3)}-${Date.now()}`,
      mode,
      origin: formData.origin || '',
      destination: formData.destination || '',
      carrier: formData.carrier || '',
      vehicle: formData.vehicle || '',
      driver: formData.driver,
      weight: formData.weight || '0 kg',
      volume: formData.volume,
      containers: formData.containers || 0,
      packages: formData.packages,
      status: formData.status || 'pending',
      eta: formData.eta || new Date().toISOString().split('T')[0],
      etd: formData.etd,
      consignee: formData.consignee || '',
      consignor: formData.consignor,
      notes: formData.notes,
    });
    onOpenChange(false);
  };

  const labels = modeLabels[mode];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {shipment ? 'Edit Shipment' : 'Create New Shipment'}
          </DialogTitle>
          <DialogDescription>
            {shipment
              ? `Update shipment ${shipment.reference}`
              : `Add a new ${mode} freight shipment`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g., Karachi Port"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Lahore Dry Port"
                required
              />
            </div>
          </div>

          {/* Carrier & Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier *</Label>
              <Input
                id="carrier"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                placeholder="e.g., National Logistics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle">{labels.vehicle} *</Label>
              <Input
                id="vehicle"
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                placeholder={mode === 'road' ? 'e.g., ABC-1234' : mode === 'sea' ? 'e.g., MV Ever Given' : 'e.g., PK-701'}
                required
              />
            </div>
          </div>

          {/* Driver (if applicable) */}
          {labels.driver && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver">{labels.driver}</Label>
                <Input
                  id="driver"
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  placeholder="e.g., Muhammad Ali"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ShipmentStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consignor">Consignor (Shipper)</Label>
              <Input
                id="consignor"
                value={formData.consignor}
                onChange={(e) => setFormData({ ...formData, consignor: e.target.value })}
                placeholder="e.g., ABC Trading Co."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consignee">Consignee *</Label>
              <Input
                id="consignee"
                value={formData.consignee}
                onChange={(e) => setFormData({ ...formData, consignee: e.target.value })}
                placeholder="e.g., XYZ Industries"
                required
              />
            </div>
          </div>

          {/* Cargo Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight *</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g., 24,500 kg"
                required
              />
            </div>
            {(mode === 'sea' || mode === 'air') && (
              <div className="space-y-2">
                <Label htmlFor="volume">Volume (CBM)</Label>
                <Input
                  id="volume"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  placeholder="e.g., 120 CBM"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="containers">{mode === 'sea' ? 'Containers' : 'Units'}</Label>
              <Input
                id="containers"
                type="number"
                min="0"
                value={formData.containers}
                onChange={(e) => setFormData({ ...formData, containers: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packages">Packages</Label>
              <Input
                id="packages"
                type="number"
                min="0"
                value={formData.packages}
                onChange={(e) => setFormData({ ...formData, packages: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="etd">ETD (Departure)</Label>
              <Input
                id="etd"
                type="date"
                value={formData.etd}
                onChange={(e) => setFormData({ ...formData, etd: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eta">ETA (Arrival) *</Label>
              <Input
                id="eta"
                type="date"
                value={formData.eta}
                onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <Label>Documents (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input type="file" multiple className="cursor-pointer" />
            </div>
            <p className="text-xs text-muted-foreground">Upload any relevant shipping documents (BL, Packing List, etc.)</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              {shipment ? 'Update Shipment' : 'Create Shipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
