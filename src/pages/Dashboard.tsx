import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ShipmentTable } from '@/components/dashboard/ShipmentTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PortsOverview } from '@/components/dashboard/PortsOverview';
import { ShipmentChart } from '@/components/dashboard/ShipmentChart';
import { 
  Ship, 
  Package, 
  Truck, 
  DollarSign,
  Clock,
  AlertTriangle,
  FileCheck,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Logistics Management System Overview"
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Shipments"
            value="156"
            icon={<Ship className="h-6 w-6" />}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Pending Clearance"
            value="42"
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Containers in Transit"
            value="328"
            icon={<Package className="h-6 w-6" />}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Revenue (PKR)"
            value="24.5M"
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 15.3, isPositive: true }}
            variant="success"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="GD Filed Today"
            value="18"
            icon={<FileCheck className="h-5 w-5" />}
          />
          <StatCard
            title="Cleared Today"
            value="24"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <StatCard
            title="Trucks Dispatched"
            value="35"
            icon={<Truck className="h-5 w-5" />}
          />
          <StatCard
            title="Alerts"
            value="7"
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="warning"
          />
        </div>

        {/* Ports Overview */}
        <PortsOverview />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <div className="lg:col-span-2">
            <ShipmentChart />
          </div>
          
          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Shipments Table & Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ShipmentTable />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
