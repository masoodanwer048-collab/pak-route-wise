import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Anchor,
  Ship,
  Truck,
  Plane,
  MapPin,
  Globe,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAKISTAN_PORTS } from '@/types/logistics';

const portCategories = [
  { id: 'sea', name: 'Sea Ports', icon: Anchor, color: 'bg-info/10 text-info' },
  { id: 'dry', name: 'Dry Ports', icon: Truck, color: 'bg-success/10 text-success' },
  { id: 'air', name: 'Airports', icon: Plane, color: 'bg-accent/10 text-accent' },
  { id: 'border', name: 'Border Points', icon: MapPin, color: 'bg-warning/10 text-warning' },
];

const internationalPorts = [
  { code: 'CNSHA', name: 'Shanghai Port', country: 'China', region: 'Asia' },
  { code: 'SGSIN', name: 'Singapore Port', country: 'Singapore', region: 'Asia' },
  { code: 'AEJEA', name: 'Jebel Ali Port', country: 'UAE', region: 'Middle East' },
  { code: 'NLRTM', name: 'Rotterdam Port', country: 'Netherlands', region: 'Europe' },
  { code: 'USNYC', name: 'New York Port', country: 'USA', region: 'Americas' },
  { code: 'GBFXT', name: 'Felixstowe Port', country: 'UK', region: 'Europe' },
  { code: 'HKHKG', name: 'Hong Kong Port', country: 'Hong Kong', region: 'Asia' },
  { code: 'KRPUS', name: 'Busan Port', country: 'South Korea', region: 'Asia' },
];

export default function PortDirectory() {
  return (
    <MainLayout 
      title="Port Directory" 
      subtitle="Pakistan and International Ports Reference"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search port by name or code..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Pakistan Ports */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Pakistan Ports</h2>
              <p className="text-sm text-muted-foreground">All major ports, terminals & border crossings</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {portCategories.map((category) => {
              const ports = PAKISTAN_PORTS[category.id as keyof typeof PAKISTAN_PORTS];
              const CategoryIcon = category.icon;

              return (
                <div key={category.id} className="rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', category.color)}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{ports.length} locations</p>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {ports.map((port) => (
                      <div key={port.code} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div>
                          <p className="font-medium">{port.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="code-text">{port.code}</span>
                            <span className="text-xs text-muted-foreground">{port.city}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* International Ports */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Ship className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">International Ports</h2>
              <p className="text-sm text-muted-foreground">Major global shipping hubs</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {internationalPorts.map((port) => (
              <div key={port.code} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{port.name}</p>
                    <p className="text-sm text-muted-foreground">{port.country}</p>
                  </div>
                  <span className="status-badge bg-muted text-muted-foreground">{port.region}</span>
                </div>
                <div className="mt-3">
                  <span className="code-text">{port.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
