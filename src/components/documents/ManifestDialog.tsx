import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ShippingDocument } from '@/hooks/useDocuments';
import { Plus, Trash2 } from 'lucide-react';

interface ManifestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document?: ShippingDocument | null;
    onSave: (document: Omit<ShippingDocument, 'id' | 'createdAt'>, type: 'manifest') => void;
}

export function ManifestDialog({
    open,
    onOpenChange,
    document,
    onSave,
}: ManifestDialogProps) {
    const [formData, setFormData] = useState<Partial<ShippingDocument>>({});

    useEffect(() => {
        if (document) {
            setFormData(document);
        } else {
            setFormData({
                type: 'manifest',
                documentNumber: '',
                issueDate: new Date().toISOString().split('T')[0],
                shipper: '',
                shipperContact: '',
                shipperAddress: '',
                recipient: '',
                recipientEmail: '',
                recipientAddress: '',
                recipientPhone: '',
                manifestItems: [],
                status: 'draft',
                // Defaults for required fields to avoid type errors
                carrier: 'Kohesar Logistics',
                vesselFlightTruck: '',
                voyageFlightNo: '',
                origin: '',
                destination: '',
                cargoType: 'LCL',
                weight: '0 kg',
                volume: '0 CBM',
                packages: 0,
                description: 'Consolidated Cargo',
                freightTerms: 'prepaid',
            });
        }
    }, [document, open]);

    const handleAddItem = () => {
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            description: '',
            quantity: 1,
            weight: 0,
            dimensions: '',
            value: 0,
        };
        setFormData({
            ...formData,
            manifestItems: [...(formData.manifestItems || []), newItem],
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...(formData.manifestItems || [])];
        newItems.splice(index, 1);
        setFormData({ ...formData, manifestItems: newItems });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...(formData.manifestItems || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, manifestItems: newItems });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Calculate totals for summary fields
        const totalQty = formData.manifestItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const totalWt = formData.manifestItems?.reduce((sum, item) => sum + item.weight, 0) || 0;

        onSave({
            ...formData,
            type: 'manifest',
            packages: totalQty,
            weight: `${totalWt} kg`,
        } as ShippingDocument, 'manifest');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{document ? 'Edit Shipping Manifest' : 'Create New Shipping Manifest'}</DialogTitle>
                    <DialogDescription>
                        Enter details for the shipping manifest.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                        <div>
                            <Label>Manifest Number</Label>
                            <Input
                                value={formData.documentNumber || ''}
                                onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                                placeholder="MAN-001"
                                required
                            />
                        </div>
                        <div>
                            <Label>Date of Issue</Label>
                            <Input
                                type="date"
                                value={formData.issueDate || ''}
                                onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section 1: Shipper Information */}
                        <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="font-semibold text-lg border-b pb-2">Shipper Information</h3>
                            <div className="space-y-2">
                                <Label>Shipper Name</Label>
                                <Input value={formData.shipper || ''} onChange={e => setFormData({ ...formData, shipper: e.target.value })} placeholder="Shipper Name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Shipper Email</Label>
                                <Input value={formData.shipperContact || ''} onChange={e => setFormData({ ...formData, shipperContact: e.target.value })} placeholder="email@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Shipper Address</Label>
                                <Input value={formData.shipperAddress || ''} onChange={e => setFormData({ ...formData, shipperAddress: e.target.value })} placeholder="Shipper Address" />
                            </div>
                            {/* Reusing contact for phone to match print view structure if needed, or add distinct phone field later if DB allows */}
                            <p className="text-xs text-muted-foreground">Phone uses "Shipper Email" field for now (edit mapped in print view).</p>
                        </div>

                        {/* Section 2: Recipient Information */}
                        <div className="space-y-4 border p-4 rounded-md">
                            <h3 className="font-semibold text-lg border-b pb-2">Recipient Information</h3>
                            <div className="space-y-2">
                                <Label>Recipient Name</Label>
                                <Input value={formData.recipient || ''} onChange={e => setFormData({ ...formData, recipient: e.target.value })} placeholder="Recipient Name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Recipient Email</Label>
                                <Input value={formData.recipientEmail || ''} onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })} placeholder="recipient@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Recipient Address</Label>
                                <Input value={formData.recipientAddress || ''} onChange={e => setFormData({ ...formData, recipientAddress: e.target.value })} placeholder="Address" />
                            </div>
                            <div className="space-y-2">
                                <Label>Recipient Phone</Label>
                                <Input value={formData.recipientPhone || ''} onChange={e => setFormData({ ...formData, recipientPhone: e.target.value })} placeholder="+92..." />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Shipping Details (Items Table) */}
                    <div className="border p-4 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Shipping Details</h3>
                            <Button type="button" size="sm" onClick={handleAddItem} variant="outline">
                                <Plus className="h-4 w-4 mr-2" /> Add Item
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-2 text-left font-medium">Description</th>
                                        <th className="p-2 text-left font-medium w-24">Quantity</th>
                                        <th className="p-2 text-left font-medium w-24">Weight (kg)</th>
                                        <th className="p-2 text-left font-medium w-32">Dimensions</th>
                                        <th className="p-2 text-left font-medium w-32">Value ($)</th>
                                        <th className="p-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.manifestItems?.map((item, index) => (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="p-2">
                                                <Input
                                                    value={item.description}
                                                    onChange={e => handleItemChange(index, 'description', e.target.value)}
                                                    placeholder="Item description"
                                                    className="h-8"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                    className="h-8"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={item.weight}
                                                    onChange={e => handleItemChange(index, 'weight', parseFloat(e.target.value))}
                                                    className="h-8"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    value={item.dimensions}
                                                    onChange={e => handleItemChange(index, 'dimensions', e.target.value)}
                                                    placeholder="LxWxH"
                                                    className="h-8"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={item.value}
                                                    onChange={e => handleItemChange(index, 'value', parseFloat(e.target.value))}
                                                    className="h-8"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveItem(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!formData.manifestItems || formData.manifestItems.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No items added. Click "Add Item" to begin.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Summary */}
                        <div className="flex justify-end gap-6 mt-4 text-sm font-medium">
                            <div>Total Quantity: {formData.manifestItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}</div>
                            <div>Total Weight: {formData.manifestItems?.reduce((sum, item) => sum + item.weight, 0) || 0} kg</div>
                            <div>Total Value: ${formData.manifestItems?.reduce((sum, item) => sum + item.value, 0) || 0}</div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Manifest</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
