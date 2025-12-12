import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Truck,
  MapPin,
  Clock,
  Package,
  MoreHorizontal,
  Eye,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

const shipments = [
  {
    id: 'TRK-2024-001',
    origin: 'Karachi Port',
    destination: 'Lahore Dry Port',
    truck: 'ABC-1234',
    driver: 'Muhammad Ali',
    weight: '24,500 kg',
    status: 'in_transit',
    eta: '2024-01-15 14:30',
    containers: 2,
  },
  {
    id: 'TRK-2024-002',
    origin: 'Port Qasim',
    destination: 'Faisalabad Dry Port',
    truck: 'XYZ-5678',
    driver: 'Ahmed Khan',
    weight: '18,200 kg',
    status: 'loading',
    eta: '2024-01-16 09:00',
    containers: 1,
  },
  {
    id: 'TRK-2024-003',
    origin: 'Peshawar',
    destination: 'Torkham Border',
    truck: 'AFG-9012',
    driver: 'Hamid Shah',
    weight: '32,000 kg',
    status: 'delivered',
    eta: '2024-01-14 18:00',
    containers: 3,
  },
  {
    id: 'TRK-2024-004',
    origin: 'Karachi Port',
    destination: 'Multan Dry Port',
    truck: 'MUL-3456',
    driver: 'Imran Malik',
    weight: '21,800 kg',
    status: 'pending',
    eta: '2024-01-17 11:30',
    containers: 2,
  },
];

const statusColors = {
  in_transit: 'bg-info/10 text-info',
  loading: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  pending: 'bg-pending/10 text-pending',
};

export default function RoadFreight() {
  return (
    <MainLayout 
      title="Road Freight" 
      subtitle="Manage road transportation and trucking operations"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by truck, driver, reference..."
                className="pl-9 w-80"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              New Shipment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-sm text-muted-foreground">Active Trucks</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">32</p>
                <p className="text-sm text-muted-foreground">In Transit</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Delivered Today</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">8.5h</p>
                <p className="text-sm text-muted-foreground">Avg. Transit Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Route</th>
                  <th>Truck / Driver</th>
                  <th>Weight</th>
                  <th>Containers</th>
                  <th>ETA</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <span className="font-mono font-medium">{shipment.id}</span>
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
                        <span className="text-sm font-medium font-mono">{shipment.truck}</span>
                        <span className="text-xs text-muted-foreground">{shipment.driver}</span>
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
                      <span className={cn('status-badge capitalize', statusColors[shipment.status as keyof typeof statusColors])}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
