import { Truck, Ship, Plane, Train, MapPin, Package, Clock, AlertTriangle } from 'lucide-react';
import { TransportMode } from '@/types/logistics';

interface FreightStatsProps {
  mode: TransportMode;
  stats: {
    total: number;
    inTransit: number;
    pending: number;
    delivered: number;
    customsHold: number;
    delayed: number;
  };
}

const modeConfig: Record<TransportMode, { icon: typeof Truck; label: string; activeLabel: string }> = {
  road: { icon: Truck, label: 'Active Trucks', activeLabel: 'Trucks' },
  sea: { icon: Ship, label: 'Active Vessels', activeLabel: 'Vessels' },
  air: { icon: Plane, label: 'Active Flights', activeLabel: 'Flights' },
  rail: { icon: Train, label: 'Active Trains', activeLabel: 'Trains' },
};

export function FreightStats({ mode, stats }: FreightStatsProps) {
  const config = modeConfig[mode];
  const ModeIcon = config.icon;

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <div className="stat-card border border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <ModeIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">{config.label}</p>
          </div>
        </div>
      </div>

      <div className="stat-card border border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.inTransit}</p>
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
            <p className="text-2xl font-bold">{stats.delivered}</p>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </div>
        </div>
      </div>

      <div className="stat-card border border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.customsHold + stats.delayed}</p>
            <p className="text-sm text-muted-foreground">Needs Attention</p>
          </div>
        </div>
      </div>
    </div>
  );
}
