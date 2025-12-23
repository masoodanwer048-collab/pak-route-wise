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
    TrendingUp
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const courierShipments = [
    { id: 'PK-992182', customer: 'Imran Khan', date: '2025-12-23', status: 'In Transit', driver: 'Arshad Ali', method: 'Express' },
    { id: 'PK-992185', customer: 'Ahmed Hassan', date: '2025-12-24', status: 'Pending', driver: 'Not Assigned', method: 'Standard' },
    { id: 'PK-992188', customer: 'Zainab Bibi', date: '2025-12-24', status: 'Picked Up', driver: 'Khalid Mehmood', method: 'Same Day' },
    { id: 'PK-992175', customer: 'TechFlow Solutions', date: '2025-12-22', status: 'Completed', driver: 'Arshad Ali', method: 'Express' },
    { id: 'PK-992160', customer: 'Sanaullah', date: '2025-12-21', status: 'Completed', driver: 'Usman Tariq', method: 'Standard' },
];

export default function CourierManagement() {
    return (
        <MainLayout title="Courier Management" subtitle="Manage shipments, drivers, and operations">
            <div className="space-y-6 pb-12">
                {/* Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Shipments</p>
                                    <h3 className="text-2xl font-bold">1,284</h3>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-green-500">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                <span>+12.5% from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Drivers</p>
                                    <h3 className="text-2xl font-bold">42</h3>
                                </div>
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-muted-foreground">
                                <span className="text-blue-500 font-bold">38</span> drivers currently on duty
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending Pickups</p>
                                    <h3 className="text-2xl font-bold">18</h3>
                                </div>
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Clock className="h-5 w-5 text-orange-500" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-muted-foreground">
                                <span className="text-orange-500 font-bold">5</span> high priority requests
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Average Delivery</p>
                                    <h3 className="text-2xl font-bold">1.8 Days</h3>
                                </div>
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Truck className="h-5 w-5 text-purple-500" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-green-500 font-medium">
                                Goal: 2.0 Days or less
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Shipment Records</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search tracking ID..." className="pl-9 w-[200px] lg:w-[300px]" />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                <Button className="gap-1">
                                    <Plus className="h-4 w-4" /> New Job
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tracking ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courierShipments.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30">
                                        <TableCell className="font-mono font-bold text-xs">{item.id}</TableCell>
                                        <TableCell className="font-medium">{item.customer}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{item.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {item.method}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                item.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' :
                                                    item.status === 'In Transit' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200' :
                                                        item.status === 'Pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200' :
                                                            'bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200'
                                            }>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.driver === 'Not Assigned' ? (
                                                <span className="text-red-500 font-medium italic">Unassigned</span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3 opacity-40" />
                                                    {item.driver}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="gap-2">
                                                        <ArrowUpRight className="h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-blue-500">
                                                        <Users className="h-4 w-4" /> Assign Driver
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Truck className="h-4 w-4" /> Update Status
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
