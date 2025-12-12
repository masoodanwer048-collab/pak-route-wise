import { 
  FileCheck, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Package,
  Ship
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'gd_filed' | 'shipment_arrived' | 'alert' | 'cleared' | 'pending' | 'dispatched' | 'container';
  title: string;
  description: string;
  time: string;
}

const activityIcons = {
  gd_filed: { icon: FileCheck, color: 'text-info bg-info/10' },
  shipment_arrived: { icon: Ship, color: 'text-success bg-success/10' },
  alert: { icon: AlertTriangle, color: 'text-warning bg-warning/10' },
  cleared: { icon: CheckCircle, color: 'text-success bg-success/10' },
  pending: { icon: Clock, color: 'text-pending bg-pending/10' },
  dispatched: { icon: Truck, color: 'text-accent bg-accent/10' },
  container: { icon: Package, color: 'text-primary bg-primary/10' },
};

const activities: Activity[] = [
  {
    id: '1',
    type: 'gd_filed',
    title: 'GD Filed Successfully',
    description: 'GD-2024-0045678 for BL MAEU123456789',
    time: '5 mins ago',
  },
  {
    id: '2',
    type: 'alert',
    title: 'Customs Hold Alert',
    description: 'Container MSCU7654321 requires examination',
    time: '15 mins ago',
  },
  {
    id: '3',
    type: 'cleared',
    title: 'Shipment Cleared',
    description: 'SHP-2024-001230 released from customs',
    time: '1 hour ago',
  },
  {
    id: '4',
    type: 'dispatched',
    title: 'Transit Started',
    description: 'Afghan Transit - Truck AB-1234 departed Karachi',
    time: '2 hours ago',
  },
  {
    id: '5',
    type: 'shipment_arrived',
    title: 'Vessel Arrived',
    description: 'MV Ever Fortune docked at PICT Karachi',
    time: '3 hours ago',
  },
  {
    id: '6',
    type: 'container',
    title: 'Container Delivered',
    description: 'TCLU9876543 delivered to Lahore Dry Port',
    time: '4 hours ago',
  },
];

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon: Icon, color } = activityIcons[activity.type];
          return (
            <div key={activity.id} className="flex gap-3">
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
