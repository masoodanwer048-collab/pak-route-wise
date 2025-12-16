import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { FreightShipment } from '@/hooks/useFreightShipments';
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  Truck,
  Ship,
  Plane,
  Train,
  Copy,
  FileDown,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';

interface FreightTableProps {
  shipments: FreightShipment[];
  onView: (shipment: FreightShipment) => void;
  onEdit: (shipment: FreightShipment) => void;
  onDelete: (id: string) => void;
  onPrint?: (shipment: FreightShipment) => void;
}

const statusColors = {
  pending: 'bg-pending/10 text-pending',
  in_transit: 'bg-info/10 text-info',
  customs_hold: 'bg-warning/10 text-warning',
  cleared: 'bg-success/10 text-success',
  delivered: 'bg-success/10 text-success',
  delayed: 'bg-destructive/10 text-destructive',
};

const modeIcons = {
  road: Truck,
  sea: Ship,
  air: Plane,
  rail: Train,
};

export function FreightTable({ shipments, onView, onEdit, onDelete, onPrint }: FreightTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCopyReference = (reference: string) => {
    navigator.clipboard.writeText(reference);
    toast.success('Reference copied to clipboard');
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      toast.success('Shipment deleted successfully');
      setDeleteId(null);
    }
  };

  if (shipments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Truck className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No shipments found</h3>
          <p className="text-sm text-muted-foreground">
            No shipments match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Route</th>
                <th>Carrier / Vehicle</th>
                <th>Weight</th>
                <th>Units</th>
                <th>ETA</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => {
                const ModeIcon = modeIcons[shipment.mode];
                return (
                  <tr key={shipment.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <ModeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono font-medium">{shipment.reference}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{shipment.origin}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {shipment.destination}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{shipment.carrier}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {shipment.vehicle}
                          {shipment.driver && ` • ${shipment.driver}`}
                        </span>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{shipment.weight}</td>
                    <td>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {shipment.containers}
                      </span>
                    </td>
                    <td className="font-mono text-sm">{shipment.eta}</td>
                    <td>
                      <span className={cn('status-badge capitalize', statusColors[shipment.status])}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView(shipment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(shipment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => handleCopyReference(shipment.reference)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Reference
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileDown className="h-4 w-4 mr-2" />
                              Export Details
                            </DropdownMenuItem>
                            {onPrint && (
                              <DropdownMenuItem onClick={() => onPrint(shipment)}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteId(shipment.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-border">
          {shipments.map((shipment) => {
            const ModeIcon = modeIcons[shipment.mode];
            return (
              <div key={shipment.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ModeIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-medium text-sm">{shipment.reference}</span>
                  </div>
                  <span className={cn('status-badge capitalize text-xs', statusColors[shipment.status])}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-medium truncate">{shipment.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-medium truncate">{shipment.destination}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Carrier</p>
                    <p className="font-medium">{shipment.carrier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="font-mono">{shipment.eta}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(shipment)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(shipment)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(shipment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this shipment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
