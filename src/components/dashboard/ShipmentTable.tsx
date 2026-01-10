import { Ship, Truck, Plane, Train, MoreHorizontal, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusColors = {
  pending: 'bg-pending/10 text-pending',
  in_transit: 'bg-info/10 text-info',
  customs_hold: 'bg-warning/10 text-warning',
  cleared: 'bg-success/10 text-success',
  delivered: 'bg-success/10 text-success',
  delayed: 'bg-destructive/10 text-destructive',
};

const modeIcons = {
  sea: Ship,
  road: Truck,
  air: Plane,
  rail: Train,
};

interface Shipment {
  id: string;
  reference: string;
  mode: 'sea' | 'road' | 'air' | 'rail';
  status: keyof typeof statusColors;
  origin: string;
  destination: string;
  consignee: string;
  eta: string;
  containers: number;
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    reference: 'SHP-2024-001234',
    mode: 'sea',
    status: 'in_transit',
    origin: 'Shanghai, China',
    destination: 'Karachi Port',
    consignee: 'ABC Trading Co.',
    eta: '2024-01-20',
    containers: 4,
  },
  {
    id: '2',
    reference: 'SHP-2024-001235',
    mode: 'road',
    status: 'customs_hold',
    origin: 'Karachi Port',
    destination: 'Lahore Dry Port',
    consignee: 'XYZ Industries',
    eta: '2024-01-15',
    containers: 2,
  },
  {
    id: '3',
    reference: 'SHP-2024-001236',
    mode: 'air',
    status: 'cleared',
    origin: 'Dubai, UAE',
    destination: 'Islamabad Airport',
    consignee: 'Tech Solutions Ltd',
    eta: '2024-01-14',
    containers: 0,
  },
  {
    id: '4',
    reference: 'SHP-2024-001237',
    mode: 'sea',
    status: 'pending',
    origin: 'Singapore',
    destination: 'Port Qasim',
    consignee: 'Global Exports Pvt',
    eta: '2024-01-25',
    containers: 6,
  },
  {
    id: '5',
    reference: 'SHP-2024-001238',
    mode: 'road',
    status: 'delivered',
    origin: 'Torkham Border',
    destination: 'Kabul, Afghanistan',
    consignee: 'Afghan Transit Ltd',
    eta: '2024-01-12',
    containers: 3,
  },
];

export function ShipmentTable() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Shipments</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Mode</th>
              <th>Route</th>
              <th>Consignee</th>
              <th>ETA</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockShipments.map((shipment) => {
              const ModeIcon = modeIcons[shipment.mode];
              return (
                <tr key={shipment.id}>
                  <td>
                    <span className="font-mono text-sm font-medium">{shipment.reference}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ModeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{shipment.mode}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-sm">{shipment.origin}</span>
                      <span className="text-xs text-muted-foreground">→ {shipment.destination}</span>
                    </div>
                  </td>
                  <td>{shipment.consignee}</td>
                  <td className="font-mono text-sm">{shipment.eta}</td>
                  <td>
                    <span className={cn('status-badge', statusColors[shipment.status])}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
