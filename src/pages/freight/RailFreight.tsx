import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download, Train } from 'lucide-react';
import { useFreightShipments, FreightShipment } from '@/hooks/useFreightShipments';
import { FreightStats } from '@/components/freight/FreightStats';
import { FreightTable } from '@/components/freight/FreightTable';
import { FreightFilters } from '@/components/freight/FreightFilters';
import { ShipmentDialog } from '@/components/freight/ShipmentDialog';
import { ShipmentViewDialog } from '@/components/freight/ShipmentViewDialog';
import { toast } from 'sonner';

export default function RailFreight() {
  const {
    shipments,
    allShipments,
    filters,
    stats,
    addShipment,
    updateShipment,
    deleteShipment,
    updateFilters,
    clearFilters,
  } = useFreightShipments('rail');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editShipment, setEditShipment] = useState<FreightShipment | null>(null);
  const [viewShipment, setViewShipment] = useState<FreightShipment | null>(null);

  const origins = useMemo(() => [...new Set(allShipments.map((s) => s.origin))], [allShipments]);
  const destinations = useMemo(() => [...new Set(allShipments.map((s) => s.destination))], [allShipments]);

  const handleSave = (shipmentData: Omit<FreightShipment, 'id' | 'createdAt'>) => {
    if (editShipment) {
      updateShipment(editShipment.id, shipmentData);
      toast.success('Shipment updated successfully');
      setEditShipment(null);
    } else {
      addShipment(shipmentData);
      toast.success('Shipment created successfully');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Reference', 'Origin', 'Destination', 'Carrier', 'Train', 'Weight', 'Units', 'Status', 'ETA'].join(','),
      ...shipments.map((s) =>
        [s.reference, s.origin, s.destination, s.carrier, s.vehicle, s.weight, s.containers, s.status, s.eta].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rail-freight-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Export completed');
  };

  return (
    <MainLayout title="Rail Freight" subtitle="Manage railway cargo and train operations">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search train, carrier, consignee..."
                className="pl-9 w-full sm:w-80"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>
            <FreightFilters
              filters={filters}
              onFilterChange={updateFilters}
              onClearFilters={clearFilters}
              origins={origins}
              destinations={destinations}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="accent" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Shipment</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <FreightStats mode="rail" stats={stats} />

        {/* Shipments Table */}
        <FreightTable
          shipments={shipments}
          onView={setViewShipment}
          onEdit={setEditShipment}
          onDelete={deleteShipment}
        />
      </div>

      {/* Create/Edit Dialog */}
      <ShipmentDialog
        open={isCreateOpen || !!editShipment}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditShipment(null);
          }
        }}
        mode="rail"
        shipment={editShipment}
        onSave={handleSave}
      />

      {/* View Dialog */}
      <ShipmentViewDialog
        open={!!viewShipment}
        onOpenChange={(open) => !open && setViewShipment(null)}
        shipment={viewShipment}
      />
    </MainLayout>
  );
}
