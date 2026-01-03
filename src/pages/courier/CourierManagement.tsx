import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Truck,
    Users,
    Package,
    Clock,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const initialShipments = [
    { id: 'PK-992182', customer: 'Imran Khan', date: '2025-12-23', status: 'In Transit', driver: 'Arshad Ali', method: 'Express', priority: 'High' },
    { id: 'PK-992185', customer: 'Ahmed Hassan', date: '2025-12-24', status: 'Pending', driver: 'Not Assigned', method: 'Standard', priority: 'Medium' },
    { id: 'PK-992188', customer: 'Zainab Bibi', date: '2025-12-24', status: 'Picked Up', driver: 'Khalid Mehmood', method: 'Same Day', priority: 'Critical' },
    { id: 'PK-992175', customer: 'TechFlow Solutions', date: '2025-12-22', status: 'Completed', driver: 'Arshad Ali', method: 'Express', priority: 'Medium' },
    { id: 'PK-992160', customer: 'Sanaullah', date: '2025-12-21', status: 'Completed', driver: 'Usman Tariq', method: 'Standard', priority: 'Low' },
];

export default function CourierManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [shipments, setShipments] = useState(initialShipments);

    const filteredShipments = useMemo(() => {
        return shipments.filter(s => {
            const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.driver.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, shipments]);

    const handleUpdateStatus = (id: string, newStatus: string) => {
        setShipments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        toast.success(`Shipment ${id} updated to ${newStatus}`);
    };

    const handleDelete = (id: string) => {
        setShipments(prev => prev.filter(s => s.id !== id));
        toast.error(`Shipment ${id} removed from system`);
    };

    return (
        <MainLayout title="Courier Management" subtitle="Manage shipments, drivers, and operations">
            <div className="space-y-6 pb-20">
                {/* Analytics Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Shipments', val: '1,284', icon: Package, color: 'text-primary', bg: 'bg-primary/10', trend: '+12.5%', trendIcon: TrendingUp },
                        { label: 'Active Drivers', val: '42', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', sub: '38 on duty' },
                        { label: 'Pending Pickups', val: '18', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', sub: '5 high priority' },
                        { label: 'Avg Delivery', val: '1.8 Days', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: 'Goal: < 2.0', trendIcon: ShieldCheck },
                    ].map((stat, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow group overflow-hidden">
                            <CardContent className="pt-6 relative">
                                <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-125 transition-transform">
                                    <stat.icon className="h-24 w-24" />
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-2xl font-black mt-1">{stat.val}</h3>
                                    </div>
                                    <div className={`p-2.5 ${stat.bg} rounded-xl shadow-sm`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    {stat.trend ? (
                                        <div className="flex items-center text-[10px] font-bold text-green-500 bg-green-500/5 px-2 py-0.5 rounded-full ring-1 ring-green-500/20">
                                            {stat.trendIcon && <stat.trendIcon className="h-3 w-3 mr-1" />}
                                            <span>{stat.trend}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-muted-foreground">{stat.sub}</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <Card className="border-2 border-muted hover:border-primary/20 transition-colors bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Shipment Console
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">Monitor and control all active courier movements</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="ID, Customer or Driver..."
                                        className="pl-9 w-full sm:w-[250px] bg-background border-muted-foreground/20 focus-visible:ring-primary h-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[130px] h-10 bg-background">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-3.5 w-3.5" />
                                            <SelectValue placeholder="Status" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Status</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Picked Up">Picked Up</SelectItem>
                                        <SelectItem value="In Transit">In Transit</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="gap-2 font-bold px-6 shadow-lg shadow-primary/20 h-10" onClick={() => toast.info("New Job wizard coming soon!")}>
                                    <Plus className="h-4 w-4" /> New Job
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto overflow-y-hidden">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[120px] font-bold">Ref ID</TableHead>
                                        <TableHead className="font-bold">Customer</TableHead>
                                        <TableHead className="font-bold">Date</TableHead>
                                        <TableHead className="font-bold">Service</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold">Assignee</TableHead>
                                        <TableHead className="font-bold text-right pr-6">Ops</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredShipments.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                                            <TableCell className="font-mono font-black text-[11px] text-primary group-hover:underline underline-offset-4 cursor-pointer">{item.id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight">{item.customer}</span>
                                                    <div className="flex items-center gap-1">
                                                        {item.priority === 'Critical' ? (
                                                            <div className="flex items-center gap-1 text-[9px] text-red-500 font-black animate-pulse uppercase">
                                                                <AlertCircle className="h-2.5 w-2.5" />
                                                                {item.priority} Priority
                                                            </div>
                                                        ) : (
                                                            <span className="text-[9px] text-muted-foreground font-bold uppercase">{item.priority} Priority</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-[11px] font-medium">{item.date}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] bg-background font-black border-muted-foreground/30 px-2 py-0 border-2">
                                                    {item.method}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 border-2 shadow-sm rounded-md",
                                                    item.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        item.status === 'In Transit' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            item.status === 'Pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                                'bg-purple-100 text-purple-700 border-purple-200'
                                                )}>
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full mr-1.5",
                                                        item.status === 'Completed' ? 'bg-green-500' :
                                                            item.status === 'In Transit' ? 'bg-blue-500' :
                                                                item.status === 'Pending' ? 'bg-orange-500' :
                                                                    'bg-purple-500'
                                                    )} />
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {item.driver === 'Not Assigned' ? (
                                                    <Button variant="ghost" className="h-7 text-[10px] font-black text-red-500 hover:text-red-600 hover:bg-red-50 px-2 border border-red-200 border-dashed rounded-md gap-1">
                                                        <Users className="h-3 w-3" /> ASSIGN
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-muted/30 w-fit pr-3 rounded-full border">
                                                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20 uppercase">
                                                            {item.driver.charAt(0)}
                                                        </div>
                                                        <span className="font-bold tracking-tight text-[11px]">{item.driver}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted-foreground/10 rounded-xl">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 font-bold">
                                                        <DropdownMenuItem className="gap-2 py-2.5 cursor-pointer">
                                                            <ArrowUpRight className="h-4 w-4" /> View Console
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 py-2.5 cursor-pointer text-blue-500" onClick={() => toast.info("Driver selection enabled")}>
                                                            <Users className="h-4 w-4" /> Pick Agent
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-muted my-1" />
                                                        <DropdownMenuItem className="gap-2 py-2.5 cursor-pointer" onClick={() => handleUpdateStatus(item.id, 'In Transit')}>
                                                            <Truck className="h-4 w-4" /> Mark as Transit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 py-2.5 cursor-pointer text-green-600" onClick={() => handleUpdateStatus(item.id, 'Completed')}>
                                                            <ShieldCheck className="h-4 w-4" /> Set Completed
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-muted my-1" />
                                                        <DropdownMenuItem className="gap-2 py-2.5 cursor-pointer text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                                            <AlertCircle className="h-4 w-4" /> Delete Record
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filteredShipments.length === 0 && (
                                <div className="py-20 text-center space-y-3">
                                    <Search className="h-10 w-10 mx-auto text-muted-foreground opacity-20" />
                                    <p className="text-sm text-muted-foreground font-medium italic">No results found for "{searchQuery}"</p>
                                    <Button variant="link" onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}>Clear filters</Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
