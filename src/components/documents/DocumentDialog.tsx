import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { ShippingDocument, DocumentType, DocumentStatus } from '@/hooks/useDocuments';
import { Plus, X } from 'lucide-react';

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DocumentType;
  document?: ShippingDocument | null;
  onSave: (document: Omit<ShippingDocument, 'id' | 'createdAt'>) => void;
}

const typeLabels: Record<DocumentType, { title: string; vehicle: string; voyage: string }> = {
  bl: { title: 'Bill of Lading', vehicle: 'Vessel Name', voyage: 'Voyage Number' },
  awb: { title: 'Air Waybill', vehicle: 'Aircraft', voyage: 'Flight Number' },
  bilty: { title: 'Bilty / Road Receipt', vehicle: 'Truck Number', voyage: 'Driver Name' },
  manifest: { title: 'Shipping Manifest', vehicle: 'Vessel Name', voyage: 'Voyage Number' },
};

const statusOptions: DocumentStatus[] = ['draft', 'pending', 'original', 'telex', 'released', 'hold'];

export function DocumentDialog({
  open,
  onOpenChange,
  type,
  document,
  onSave,
}: DocumentDialogProps) {
  const [formData, setFormData] = useState<Partial<ShippingDocument>>({});
  const [newContainer, setNewContainer] = useState('');

  useEffect(() => {
    if (document) {
      setFormData(document);
    } else {
      setFormData({
        type,
        documentNumber: '',
        status: 'draft',
        carrier: '',
        vesselFlightTruck: '',
        voyageFlightNo: '',
        origin: '',
        destination: '',
        pol: '',
        pod: '',
        shipper: '',
        consignee: '',
        notifyParty: '',
        containers: [],
        weight: '',
        volume: '',
        packages: 0,
        description: '',
        issueDate: new Date().toISOString().split('T')[0],
        etd: '',
        eta: '',
        freightTerms: 'prepaid',
        remarks: '',
      });
    }
  }, [document, type, open]);

  const handleAddContainer = () => {
    if (newContainer.trim()) {
      setFormData({
        ...formData,
        containers: [...(formData.containers || []), newContainer.trim()],
      });
      setNewContainer('');
    }
  };

  const handleRemoveContainer = (index: number) => {
    setFormData({
      ...formData,
      containers: formData.containers?.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      documentNumber: formData.documentNumber || '',
      status: formData.status || 'draft',
      carrier: formData.carrier || '',
      vesselFlightTruck: formData.vesselFlightTruck || '',
      voyageFlightNo: formData.voyageFlightNo || '',
      origin: formData.origin || '',
      destination: formData.destination || '',
      pol: formData.pol,
      pod: formData.pod,
      shipper: formData.shipper || '',
      consignee: formData.consignee || '',
      notifyParty: formData.notifyParty,
      containers: formData.containers || [],
      weight: formData.weight || '0 kg',
      volume: formData.volume || '0 CBM',
      packages: formData.packages || 0,
      description: formData.description || '',
      issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
      etd: formData.etd,
      eta: formData.eta,
      freightTerms: formData.freightTerms || 'prepaid',
      remarks: formData.remarks,
    });
    onOpenChange(false);
  };

  const labels = typeLabels[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? `Edit ${labels.title}` : `Create New ${labels.title}`}
          </DialogTitle>
          <DialogDescription>
            {document ? `Update document ${document.documentNumber}` : `Add a new ${labels.title}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Document Number *</Label>
              <Input
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                placeholder={type === 'bl' ? 'MAEU123456789' : type === 'awb' ? 'AWB-12345678' : 'BLT-2024-001'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as DocumentStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Carrier & Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Carrier *</Label>
              <Input
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                placeholder="e.g., Maersk Line"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{labels.vehicle} *</Label>
              <Input
                value={formData.vesselFlightTruck}
                onChange={(e) => setFormData({ ...formData, vesselFlightTruck: e.target.value })}
                placeholder={type === 'bl' ? 'MV Ever Fortune' : type === 'awb' ? 'Boeing 777F' : 'ABC-1234'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{labels.voyage}</Label>
              <Input
                value={formData.voyageFlightNo}
                onChange={(e) => setFormData({ ...formData, voyageFlightNo: e.target.value })}
                placeholder={type === 'bl' ? 'V.2401E' : type === 'awb' ? 'PK-701' : 'Driver Name'}
              />
            </div>
          </div>

          {/* Route */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{type === 'bl' ? 'Port of Loading' : 'Origin'} *</Label>
              <Input
                value={type === 'bl' ? formData.pol : formData.origin}
                onChange={(e) => setFormData({ ...formData, [type === 'bl' ? 'pol' : 'origin']: e.target.value })}
                placeholder="e.g., Shanghai, China"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{type === 'bl' ? 'Port of Discharge' : 'Destination'} *</Label>
              <Input
                value={type === 'bl' ? formData.pod : formData.destination}
                onChange={(e) => setFormData({ ...formData, [type === 'bl' ? 'pod' : 'destination']: e.target.value })}
                placeholder="e.g., Karachi Port"
                required
              />
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Shipper *</Label>
              <Input
                value={formData.shipper}
                onChange={(e) => setFormData({ ...formData, shipper: e.target.value })}
                placeholder="Shipper name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Consignee *</Label>
              <Input
                value={formData.consignee}
                onChange={(e) => setFormData({ ...formData, consignee: e.target.value })}
                placeholder="Consignee name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Notify Party</Label>
              <Input
                value={formData.notifyParty}
                onChange={(e) => setFormData({ ...formData, notifyParty: e.target.value })}
                placeholder="Notify party"
              />
            </div>
          </div>

          {/* Containers (not for AWB) */}
          {type !== 'awb' && (
            <div className="space-y-2">
              <Label>Container Numbers</Label>
              <div className="flex gap-2">
                <Input
                  value={newContainer}
                  onChange={(e) => setNewContainer(e.target.value)}
                  placeholder="e.g., MSCU1234567"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddContainer())}
                />
                <Button type="button" variant="outline" onClick={handleAddContainer}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.containers && formData.containers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.containers.map((container, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm font-mono"
                    >
                      {container}
                      <button type="button" onClick={() => handleRemoveContainer(index)}>
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cargo Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Weight *</Label>
              <Input
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g., 24,500 kg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Volume</Label>
              <Input
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                placeholder="e.g., 48.5 CBM"
              />
            </div>
            <div className="space-y-2">
              <Label>Packages</Label>
              <Input
                type="number"
                min="0"
                value={formData.packages}
                onChange={(e) => setFormData({ ...formData, packages: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Freight Terms</Label>
              <Select
                value={formData.freightTerms}
                onValueChange={(value) => setFormData({ ...formData, freightTerms: value as 'prepaid' | 'collect' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prepaid">Prepaid</SelectItem>
                  <SelectItem value="collect">Collect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Goods Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description of goods..."
              rows={2}
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ETD (Departure)</Label>
              <Input
                type="date"
                value={formData.etd}
                onChange={(e) => setFormData({ ...formData, etd: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>ETA (Arrival)</Label>
              <Input
                type="date"
                value={formData.eta}
                onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              {document ? 'Update Document' : 'Create Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
