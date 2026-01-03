import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ShippingDocument, DocumentType, DocumentStatus } from '@/hooks/useDocuments';
import { Plus, X, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

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
  packing_list: { title: 'Packing List', vehicle: 'Vessel Name', voyage: 'Voyage Number' },
};

const statusOptions: DocumentStatus[] = ['draft', 'pending', 'original', 'telex', 'released', 'hold'];

// Mock data for comboboxes - in a real app this would come from an API
const commonPorts = [
  "Karachi Port", "Port Qasim", "Gwadar Port", "Nagoya Port", "Shanghai", "Jebel Ali", "Singapore"
];
const commonShippers = [
  "Toyota Boshoku Corp.", "ABC Trading Co.", "Global Exports", "Indus Motors"
];

export function DocumentDialog({
  open,
  onOpenChange,
  type,
  document,
  onSave,
}: DocumentDialogProps) {
  const [formData, setFormData] = useState<Partial<ShippingDocument>>({});
  const [newContainer, setNewContainer] = useState('');
  const [newNotifyParty, setNewNotifyParty] = useState('');

  // Combobox states
  const [podOpen, setPodOpen] = useState(false);
  const [shipperOpen, setShipperOpen] = useState(false);

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
        notifyParties: [],
        cargoType: 'FCL',
        containers: [],
        weight: '',
        volume: '',
        dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
        packages: 0,
        hsCode: '',
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

  const handleAddNotifyParty = () => {
    if (newNotifyParty.trim()) {
      setFormData({
        ...formData,
        notifyParties: [...(formData.notifyParties || []), newNotifyParty.trim()],
      });
      setNewNotifyParty('');
    }
  };

  const handleRemoveNotifyParty = (index: number) => {
    setFormData({
      ...formData,
      notifyParties: formData.notifyParties?.filter((_, i) => i !== index),
    });
  };

  const calculateVolume = (l: number, w: number, h: number) => {
    const vol = (l * w * h) / 1000000;
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions!, length: l, width: w, height: h },
      volume: vol > 0 ? `${vol.toFixed(3)} CBM` : prev.volume
    }));
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
      notifyParties: formData.notifyParties || [],
      cargoType: formData.cargoType || 'FCL',
      containers: formData.containers || [],
      marksAndNumbers: formData.marksAndNumbers,
      hsCode: formData.hsCode,
      weight: formData.weight || '0 kg',
      volume: formData.volume || '0 CBM',
      dimensions: formData.dimensions,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? `Edit ${labels.title}` : `Create New ${labels.title}`}
          </DialogTitle>
          <DialogDescription>
            {document ? `Update document ${document.documentNumber}` : `Add a new ${labels.title}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Section: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
            <div className="space-y-2">
              <Label>Document Number *</Label>
              <Input
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                placeholder={type === 'bl' ? 'MAEU123456789' : 'DOC-001'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Logistics & Route */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b pb-2">Logistics Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Carrier *</Label>
                  <Input
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    placeholder="e.g. Maersk Line"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{labels.vehicle} *</Label>
                  <Input
                    value={formData.vesselFlightTruck}
                    onChange={(e) => setFormData({ ...formData, vesselFlightTruck: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{labels.voyage}</Label>
                  <Input
                    value={formData.voyageFlightNo}
                    onChange={(e) => setFormData({ ...formData, voyageFlightNo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>HS Code</Label>
                  <Input
                    value={formData.hsCode}
                    onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                    placeholder="e.g. 8543.7090"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{type === 'bl' ? 'Port of Loading' : 'Origin'} *</Label>
                <Input
                  value={type === 'bl' ? formData.pol : formData.origin}
                  onChange={(e) => setFormData({ ...formData, [type === 'bl' ? 'pol' : 'origin']: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{type === 'bl' ? 'Port of Discharge' : 'Destination'} *</Label>
                <Popover open={podOpen} onOpenChange={setPodOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={podOpen}
                      className="w-full justify-between"
                    >
                      {(type === 'bl' ? formData.pod : formData.destination) || "Select Port..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search port..." />
                      <CommandList>
                        <CommandEmpty>No port found.</CommandEmpty>
                        <CommandGroup>
                          {commonPorts.map((port) => (
                            <CommandItem
                              key={port}
                              value={port}
                              onSelect={(currentValue) => {
                                setFormData({ ...formData, [type === 'bl' ? 'pod' : 'destination']: currentValue });
                                setPodOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  (type === 'bl' ? formData.pod : formData.destination) === port ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {port}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

            </div>

            {/* Right Column: Parties */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm border-b pb-2">Parties Involved</h3>

              <div className="space-y-2">
                <Label>Shipper *</Label>
                <Popover open={shipperOpen} onOpenChange={setShipperOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={shipperOpen}
                      className="w-full justify-between"
                    >
                      {formData.shipper || "Select Shipper..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search shipper..." />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2">
                            <p className="text-sm text-muted-foreground mb-2">No shipper found.</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                // Just a visual handler for now as we don't have the input value from command handy in a clean way without controlled input
                                // In a real app we'd capture the search term. For now let's just allow typing in the button or fallback to Input if this is too complex.
                                // simpler: just replace with Input if not found?
                                // actually, let's just add an "Add Manually" button that switches to Input or just use the input search term as value.
                              }}
                            >
                              + Add New
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {commonShippers.map((shipper) => (
                            <CommandItem
                              key={shipper}
                              value={shipper}
                              onSelect={(currentValue) => {
                                setFormData({ ...formData, shipper: currentValue });
                                setShipperOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.shipper === shipper ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {shipper}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Consignee *</Label>
                <Input
                  value={formData.consignee}
                  onChange={(e) => setFormData({ ...formData, consignee: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Notify Parties</Label>
                <div className="flex gap-2">
                  <Input
                    value={newNotifyParty}
                    onChange={(e) => setNewNotifyParty(e.target.value)}
                    placeholder="Add Notify Party"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNotifyParty())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddNotifyParty}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.notifyParties && formData.notifyParties.length > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    {formData.notifyParties.map((party, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-muted rounded px-2 py-1">
                        <span className="truncate">{party}</span>
                        <button type="button" onClick={() => handleRemoveNotifyParty(index)}>
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cargo Details Section */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-semibold text-sm">Cargo Details</h3>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Cargo Type:</Label>
                <RadioGroup
                  defaultValue="FCL"
                  value={formData.cargoType}
                  onValueChange={(val) => setFormData({ ...formData, cargoType: val as 'FCL' | 'LCL' })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FCL" id="fcl" />
                    <Label htmlFor="fcl" className="cursor-pointer">FCL (Container)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="LCL" id="lcl" />
                    <Label htmlFor="lcl" className="cursor-pointer">LCL (Loose)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {formData.cargoType === 'FCL' ? (
              <div className="space-y-2">
                <Label>Container Numbers</Label>
                <div className="flex gap-2">
                  <Input
                    value={newContainer}
                    onChange={(e) => setNewContainer(e.target.value)}
                    placeholder="e.g. MSCU1234567"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddContainer())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddContainer}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.containers && formData.containers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.containers.map((container, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-mono border"
                      >
                        {container}
                        <button type="button" onClick={() => handleRemoveContainer(index)}>
                          <X className="h-3 w-3 hover:text-destructive" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Marks & Numbers</Label>
                <Textarea
                  value={formData.marksAndNumbers}
                  onChange={(e) => setFormData({ ...formData, marksAndNumbers: e.target.value })}
                  placeholder="Enter shipping marks..."
                  rows={3}
                />
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Weight</Label>
                <Input
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="24,500 kg"
                  required
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
              <div className="space-y-2 col-span-2">
                <Label>Dimensions (L x W x H) cm</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number" className="h-9 px-2" placeholder="L"
                    value={formData.dimensions?.length || ''}
                    onChange={(e) => calculateVolume(parseFloat(e.target.value) || 0, formData.dimensions?.width || 0, formData.dimensions?.height || 0)}
                  />
                  <span className="text-muted-foreground">x</span>
                  <Input
                    type="number" className="h-9 px-2" placeholder="W"
                    value={formData.dimensions?.width || ''}
                    onChange={(e) => calculateVolume(formData.dimensions?.length || 0, parseFloat(e.target.value) || 0, formData.dimensions?.height || 0)}
                  />
                  <span className="text-muted-foreground">x</span>
                  <Input
                    type="number" className="h-9 px-2" placeholder="H"
                    value={formData.dimensions?.height || ''}
                    onChange={(e) => calculateVolume(formData.dimensions?.length || 0, formData.dimensions?.width || 0, parseFloat(e.target.value) || 0)}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">
                  Total: {formData.volume || '0 CBM'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Goods Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of goods..."
                rows={2}
                required
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
