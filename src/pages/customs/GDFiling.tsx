import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  MoreHorizontal,
  Eye,
  Edit,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

const gdEntries = [
  {
    id: 'GD-2024-045678',
    type: 'Import',
    blNumber: 'MAEU123456789',
    importer: 'ABC Trading Co.',
    hsCode: '8471.30.00',
    description: 'Computer Hardware',
    value: 'PKR 4,250,000',
    duty: 'PKR 892,500',
    status: 'assessed',
    date: '2024-01-14',
  },
  {
    id: 'GD-2024-045679',
    type: 'Import',
    blNumber: 'MSCU987654321',
    importer: 'XYZ Industries',
    hsCode: '8443.32.00',
    description: 'Printing Machines',
    value: 'PKR 12,800,000',
    duty: 'PKR 2,688,000',
    status: 'submitted',
    date: '2024-01-14',
  },
  {
    id: 'GD-2024-045680',
    type: 'Export',
    blNumber: 'HLCU456789123',
    importer: 'Textile Exports Ltd',
    hsCode: '5208.21.00',
    description: 'Cotton Fabrics',
    value: 'PKR 8,500,000',
    duty: 'PKR 0',
    status: 'released',
    date: '2024-01-13',
  },
  {
    id: 'GD-2024-045681',
    type: 'Transit',
    blNumber: 'CMAU789123456',
    importer: 'Afghan Transit Ltd',
    hsCode: '8704.21.00',
    description: 'Vehicle Parts',
    value: 'PKR 6,200,000',
    duty: 'PKR 0 (Bond)',
    status: 'draft',
    date: '2024-01-14',
  },
];

const statusConfig = {
  draft: { color: 'bg-muted text-muted-foreground', icon: FileText },
  submitted: { color: 'bg-info/10 text-info', icon: Send },
  assessed: { color: 'bg-warning/10 text-warning', icon: Clock },
  paid: { color: 'bg-accent/10 text-accent', icon: DollarSign },
  released: { color: 'bg-success/10 text-success', icon: CheckCircle },
  hold: { color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

export default function GDFiling() {
  return (
    <MainLayout 
      title="GD Filing" 
      subtitle="Goods Declaration filing for import, export & transit"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search GD, BL, Importer..."
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
              New GD
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Draft</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-2xl font-bold mt-1 text-info">28</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Assessed</p>
            <p className="text-2xl font-bold mt-1 text-warning">15</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Pending Payment</p>
            <p className="text-2xl font-bold mt-1 text-accent">8</p>
          </div>
          <div className="stat-card border border-border">
            <p className="text-sm text-muted-foreground">Released Today</p>
            <p className="text-2xl font-bold mt-1 text-success">24</p>
          </div>
        </div>

        {/* GD Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>GD Number</th>
                  <th>Type</th>
                  <th>BL Number</th>
                  <th>Importer/Exporter</th>
                  <th>HS Code</th>
                  <th>Value</th>
                  <th>Duty/Taxes</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gdEntries.map((gd) => {
                  const StatusIcon = statusConfig[gd.status as keyof typeof statusConfig].icon;
                  return (
                    <tr key={gd.id}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono font-medium">{gd.id}</span>
                          <span className="text-xs text-muted-foreground">{gd.date}</span>
                        </div>
                      </td>
                      <td>
                        <span className={cn(
                          'status-badge',
                          gd.type === 'Import' && 'bg-info/10 text-info',
                          gd.type === 'Export' && 'bg-success/10 text-success',
                          gd.type === 'Transit' && 'bg-pending/10 text-pending',
                        )}>
                          {gd.type}
                        </span>
                      </td>
                      <td className="font-mono text-sm">{gd.blNumber}</td>
                      <td>{gd.importer}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm">{gd.hsCode}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">{gd.description}</span>
                        </div>
                      </td>
                      <td className="font-mono text-sm">{gd.value}</td>
                      <td className="font-mono text-sm font-medium">{gd.duty}</td>
                      <td>
                        <span className={cn('status-badge', statusConfig[gd.status as keyof typeof statusConfig].color)}>
                          <StatusIcon className="h-3 w-3" />
                          {gd.status}
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
