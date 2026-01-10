import { Anchor, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortStatus {
  name: string;
  code: string;
  vessels: number;
  containers: number;
  pendingClearance: number;
  status: 'operational' | 'congested' | 'delayed';
}

const ports: PortStatus[] = [
  {
    name: 'Karachi Port (PICT)',
    code: 'PKKAR',
    vessels: 12,
    containers: 4520,
    pendingClearance: 156,
    status: 'operational',
  },
  {
    name: 'Port Qasim (QICT)',
    code: 'PKQAS',
    vessels: 8,
    containers: 3280,
    pendingClearance: 89,
    status: 'operational',
  },
  {
    name: 'Gwadar Port',
    code: 'PKGWD',
    vessels: 3,
    containers: 820,
    pendingClearance: 24,
    status: 'operational',
  },
  {
    name: 'Lahore Dry Port',
    code: 'LAHORE_DP',
    vessels: 0,
    containers: 1450,
    pendingClearance: 67,
    status: 'congested',
  },
];

const statusColors = {
  operational: 'text-success',
  congested: 'text-warning',
  delayed: 'text-destructive',
};

export function PortsOverview() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Pakistan Ports Status</h3>
        <button className="flex items-center gap-1 text-sm text-accent hover:underline">
          View All Ports
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        {ports.map((port) => (
          <div key={port.code} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Anchor className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">{port.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{port.code}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold">{port.vessels}</p>
                <p className="text-xs text-muted-foreground">Vessels</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{port.containers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">TEUs</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{port.pendingClearance}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1">
              <span className={cn('h-2 w-2 rounded-full', {
                'bg-success': port.status === 'operational',
                'bg-warning': port.status === 'congested',
                'bg-destructive': port.status === 'delayed',
              })} />
              <span className={cn('text-xs font-medium capitalize', statusColors[port.status])}>
                {port.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
