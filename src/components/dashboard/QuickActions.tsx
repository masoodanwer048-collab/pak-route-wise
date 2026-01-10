import {
  Plus,
  FileText,
  Calculator,
  Search,
  Truck,
  Ship,
  Package,
  ClipboardCheck,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const actions = [
  { icon: Plus, label: 'New Shipment', variant: 'accent' as const, path: '/freight/road' },
  { icon: FileText, label: 'File GD', variant: 'default' as const, path: '/customs/gd' },
  { icon: Layers, label: 'Shipment Workflow', variant: 'default' as const, path: '/operations/workflow' },
  { icon: Calculator, label: 'Duty Calculator', variant: 'default' as const, path: '/freight/calculator' },
  { icon: Search, label: 'Track Shipment', variant: 'default' as const, path: '/tracking/gps' },
  { icon: Package, label: 'Book Courier', variant: 'accent' as const, path: '/courier/booking' },
];

const quickLinks = [
  { icon: Ship, label: 'Sea Freight', count: 45 },
  { icon: Truck, label: 'Road Freight', count: 32 },
  { icon: Package, label: 'Pending Clearance', count: 18 },
  { icon: ClipboardCheck, label: 'GD in Progress', count: 12 },
];

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="justify-start h-auto py-3"
              onClick={() => navigate(action.path)}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Quick Access</h3>
        <div className="space-y-2">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <link.icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">{link.label}</span>
              </div>
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-muted px-2 text-xs font-medium">
                {link.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
