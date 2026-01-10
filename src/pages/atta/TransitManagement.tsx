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
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ExportActions from '@/components/common/ExportActions';

const transitShipments = [
  {
    id: 'ATTA-2024-0012',
    blNumber: 'MAEU123456789',
    bondNumber: 'BOND-2024-5678',
    carrier: 'Afghan Transit Ltd',
    truck: 'AFG-1234',
    driver: 'Hamid Shah',
    sealNumber: 'SEAL-78901',
    origin: 'Karachi Port',
    destination: 'Kabul, Afghanistan',
    via: 'Torkham Border',
    weight: '32,500 kg',
    containers: 3,
    status: 'in_transit',
    currentLocation: 'Peshawar Dry Port',
    eta: '2024-01-16',
    bondAmount: 'PKR 2,500,000',
  },
  {
    id: 'ATTA-2024-0013',
    blNumber: 'HLCU987654321',
    bondNumber: 'BOND-2024-5679',
    carrier: 'Pak-Afghan Carriers',
    truck: 'AFG-5678',
    driver: 'Abdul Karim',
    sealNumber: 'SEAL-78902',
    origin: 'Port Qasim',
    destination: 'Jalalabad, Afghanistan',
    via: 'Torkham Border',
    weight: '28,200 kg',
    containers: 2,
    status: 'at_border',
    currentLocation: 'Torkham Border',
    eta: '2024-01-15',
    bondAmount: 'PKR 1,800,000',
  },
  {
    id: 'ATTA-2024-0011',
    blNumber: 'CMAU456789123',
    bondNumber: 'BOND-2024-5677',
    carrier: 'Transit Masters',
    truck: 'AFG-9012',
    driver: 'Mohammad Ali',
    sealNumber: 'SEAL-78900',
    origin: 'Karachi Port',
    destination: 'Kandahar, Afghanistan',
    via: 'Chaman Border',
    weight: '45,000 kg',
    containers: 4,
    status: 'cleared',
    currentLocation: 'Kandahar, Afghanistan',
    eta: '2024-01-14',
    bondAmount: 'PKR 3,200,000',
  },
  {
    id: 'ATTA-2024-0014',
    blNumber: 'MSCU111222333',
    bondNumber: 'BOND-2024-5680',
    carrier: 'Afghan Transit Ltd',
    truck: 'AFG-3456',
    driver: 'Gul Khan',
    sealNumber: 'SEAL-78903',
    origin: 'Karachi Port',
    destination: 'Mazar-i-Sharif, Afghanistan',
    via: 'Torkham Border',
    weight: '38,600 kg',
    containers: 3,
    status: 'loading',
    currentLocation: 'Karachi Port',
    eta: '2024-01-18',
    bondAmount: 'PKR 2,800,000',
  },
];

const statusConfig = {
  loading: { color: 'bg-pending/10 text-pending', icon: Clock, label: 'Loading' },
  in_transit: { color: 'bg-info/10 text-info', icon: Truck, label: 'In Transit' },
  at_border: { color: 'bg-warning/10 text-warning', icon: Shield, label: 'At Border' },
  cleared: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Cleared' },
  hold: { color: 'bg-destructive/10 text-destructive', icon: AlertTriangle, label: 'Hold' },
};

export default function TransitManagement() {
  return (
    <MainLayout
      title="Afghan Transit Trade"
      subtitle="ATTA Management - Transit Pass & Border Clearance"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ATTA number, truck, BL..."
                className="pl-9 w-80"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex gap-3">
            <ExportActions
              data={transitShipments}
              fileName="atta_transit_shipments"
              columnMapping={{
                id: "ATTA ID",
                bondNumber: "Bond #",
                carrier: "Carrier",
                status: "Status",
                currentLocation: "Location"
              }}
            />
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              New Transit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Loading</p>
            <p className="text-2xl font-bold mt-1 text-pending">8</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">In Transit</p>
            <p className="text-2xl font-bold mt-1 text-info">24</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">At Border</p>
            <p className="text-2xl font-bold mt-1 text-warning">12</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Cleared Today</p>
            <p className="text-2xl font-bold mt-1 text-success">18</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Bond Value</p>
            <p className="text-2xl font-bold mt-1">PKR 45M</p>
          </div>
        </div>

        {/* Border Points Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Torkham Border</h3>
                <p className="text-sm text-muted-foreground">Khyber Pakhtunkhwa</p>
              </div>
              <span className="ml-auto status-badge bg-success/10 text-success">Operational</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-muted-foreground">Trucks Waiting</p>
              </div>
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-muted-foreground">Cleared Today</p>
              </div>
              <div>
                <p className="text-2xl font-bold">2.5h</p>
                <p className="text-xs text-muted-foreground">Avg. Wait Time</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Chaman Border</h3>
                <p className="text-sm text-muted-foreground">Balochistan</p>
              </div>
              <span className="ml-auto status-badge bg-success/10 text-success">Operational</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Trucks Waiting</p>
              </div>
              <div>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-muted-foreground">Cleared Today</p>
              </div>
              <div>
                <p className="text-2xl font-bold">3.0h</p>
                <p className="text-xs text-muted-foreground">Avg. Wait Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transit Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ATTA / Bond</th>
                  <th>Route</th>
                  <th>Carrier / Truck</th>
                  <th>Cargo</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transitShipments.map((shipment) => {
                  const StatusIcon = statusConfig[shipment.status as keyof typeof statusConfig].icon;
                  return (
                    <tr key={shipment.id}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono font-medium">{shipment.id}</span>
                          <span className="text-xs text-muted-foreground">{shipment.bondNumber}</span>
                          <span className="text-xs text-accent">{shipment.bondAmount}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm">{shipment.origin}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            via {shipment.via}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {shipment.destination}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{shipment.carrier}</span>
                          <span className="font-mono text-xs">{shipment.truck}</span>
                          <span className="text-xs text-muted-foreground">{shipment.driver}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm">{shipment.containers} containers</span>
                          <span className="text-xs text-muted-foreground">{shipment.weight}</span>
                          <span className="text-xs text-muted-foreground">Seal: {shipment.sealNumber}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-accent" />
                          <span className="text-sm">{shipment.currentLocation}</span>
                        </div>
                      </td>
                      <td>
                        <span className={cn('status-badge', statusConfig[shipment.status as keyof typeof statusConfig].color)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[shipment.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Navigation className="h-4 w-4" />
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
      </div>
    </MainLayout>
  );
}
