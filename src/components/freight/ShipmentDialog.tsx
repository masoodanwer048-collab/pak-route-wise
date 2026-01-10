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
  road: { vehicle: 'Vehicle Reg #', driver: 'Driver Name' },
  sea: { vehicle: 'Vessel Name' },
  air: { vehicle: 'Flight Number' },
  rail: { vehicle: 'Train Number', driver: 'Conductor' },
};

const statusOptions: ShipmentStatus[] = ['pending', 'in_transit', 'customs_hold', 'cleared', 'delivered', 'delayed'];

const incotermsOptions = ['EXW', 'FCA', 'FOB', 'CIF', 'DDP', 'DAP'];

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
    commodity: '',
    hs_code: '',
    container_number: '',
    incoterms: '',
    insurance_policy: '',
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
        commodity: '',
        hs_code: '',
        container_number: '',
        incoterms: '',
        insurance_policy: '',
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
      weight: formData.weight || '0',
      volume: formData.volume,
      containers: formData.containers || 0,
      packages: formData.packages,
      status: formData.status || 'pending',
      eta: formData.eta || new Date().toISOString().split('T')[0],
      etd: formData.etd,
      consignee: formData.consignee || '',
      consignor: formData.consignor,
      notes: formData.notes,
      commodity: formData.commodity,
      hs_code: formData.hs_code,
      container_number: formData.container_number,
      incoterms: formData.incoterms,
      insurance_policy: formData.insurance_policy,
    });
    onOpenChange(false);
  };

  const labels = modeLabels[mode];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {shipment ? 'Edit Shipment' : 'Create Bonded Shipment'}
          </DialogTitle>
          <DialogDescription>
            {shipment
              ? `Update shipment ${shipment.reference}`
              : `Create a new ${mode} bonded shipment record`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Route & Transport */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">Route & Transport</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin (Bonded Wh.) *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="eta">ETA *</Label>
                <Input
                  id="eta"
                  type="date"
                  value={formData.eta}
                  onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Cargo Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">Cargo & Customs</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commodity">Commodity *</Label>
                <Input
                  id="commodity"
                  value={formData.commodity}
                  onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                  placeholder="e.g., Textiles"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hs_code">HS Code</Label>
                <Input
                  id="hs_code"
                  value={formData.hs_code}
                  onChange={(e) => setFormData({ ...formData, hs_code: e.target.value })}
                  placeholder="e.g., 6109.10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packages">Packages</Label>
                <Input
                  id="packages"
                  type="number"
                  value={formData.packages}
                  onChange={(e) => setFormData({ ...formData, packages: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="container_number">Container Number</Label>
                <Input
                  id="container_number"
                  value={formData.container_number}
                  onChange={(e) => setFormData({ ...formData, container_number: e.target.value })}
                  placeholder="e.g., ABCD1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incoterms">Incoterms</Label>
                <Select
                  value={formData.incoterms}
                  onValueChange={(value) => setFormData({ ...formData, incoterms: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Incoterm" />
                  </SelectTrigger>
                  <SelectContent>
                    {incotermsOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance_policy">Insurance Policy</Label>
                <Input
                  id="insurance_policy"
                  value={formData.insurance_policy}
                  onChange={(e) => setFormData({ ...formData, insurance_policy: e.target.value })}
                  placeholder="Policy Number"
                />
              </div>
            </div>
          </div>

          {/* Section: Vehicle Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">Vehicle & Driver</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">{labels.vehicle}</Label>
                <Input
                  id="vehicle"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  placeholder="Bonded Vehicle Reg #"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">{labels.driver}</Label>
                <Input
                  id="driver"
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  placeholder="Assigned Driver"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              {shipment ? 'Update Shipment' : 'Create Bonded Shipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
