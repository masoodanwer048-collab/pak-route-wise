import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  FileText,
  Ship,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

const blDocuments = [
  {
    id: 'MAEU123456789',
    type: 'Original',
    vessel: 'MV Ever Fortune',
    voyage: 'V.2401E',
    shipper: 'Shanghai Trading Co.',
    consignee: 'ABC Trading Co.',
    pol: 'Shanghai, China',
    pod: 'Karachi Port',
    containers: ['MSCU1234567', 'MSCU1234568'],
    weight: '24,500 kg',
    cbm: '48.5',
    status: 'original',
    date: '2024-01-10',
  },
  {
    id: 'HLCU987654321',
    type: 'Telex',
    vessel: 'MV Maersk Seletar',
    voyage: 'V.2402W',
    shipper: 'Dubai Exports LLC',
    consignee: 'XYZ Industries',
    pol: 'Dubai, UAE',
    pod: 'Port Qasim',
    containers: ['HLCU9876543'],
    weight: '18,200 kg',
    cbm: '32.0',
    status: 'released',
    date: '2024-01-12',
  },
  {
    id: 'CMAU456789123',
    type: 'Seaway',
    vessel: 'MV CMA CGM Marco Polo',
    voyage: 'V.2403N',
    shipper: 'Singapore Logistics',
    consignee: 'Global Exports Pvt',
    pol: 'Singapore',
    pod: 'Karachi Port',
    containers: ['CMAU4567891', 'CMAU4567892', 'CMAU4567893'],
    weight: '45,600 kg',
    cbm: '96.0',
    status: 'pending',
    date: '2024-01-14',
  },
];

const statusColors = {
  original: 'bg-info/10 text-info',
  telex: 'bg-accent/10 text-accent',
  released: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  hold: 'bg-destructive/10 text-destructive',
};

export default function BillOfLading() {
  return (
    <MainLayout 
      title="Bill of Lading" 
      subtitle="Manage and track ocean shipping documents"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search BL number, vessel, consignee..."
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
              Create BL
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Total BLs</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Ship className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Released</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">25</p>
                <p className="text-sm text-muted-foreground">Telex Release</p>
              </div>
            </div>
          </div>
        </div>

        {/* BL Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blDocuments.map((bl) => (
            <div key={bl.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono font-semibold text-lg">{bl.id}</p>
                  <p className="text-sm text-muted-foreground">{bl.date}</p>
                </div>
                <span className={cn('status-badge', statusColors[bl.status as keyof typeof statusColors])}>
                  {bl.type}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{bl.vessel}</span>
                  <span className="text-muted-foreground">({bl.voyage})</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{bl.pol}</span>
                  <span>→</span>
                  <span>{bl.pod}</span>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Consignee</p>
                  <p className="font-medium">{bl.consignee}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Containers</p>
                    <p className="font-mono font-medium">{bl.containers.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-mono text-sm">{bl.weight}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CBM</p>
                    <p className="font-mono text-sm">{bl.cbm}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
