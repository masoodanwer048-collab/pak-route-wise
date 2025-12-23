import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Ship,
    ClipboardCheck,
    Truck,
    Box,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    DollarSign,
    Package,
    MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';


const stages = [
    {
        id: 'agent',
        title: 'Shipping Agent',
        icon: Ship,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        path: '/documents/bl',
        tasks: [
            { name: 'Input Invoice & Packing List', status: 'completed' },
            { name: 'Consignor & Consignee Details', status: 'completed' },
            { name: 'Vessel & Voyage Details', status: 'completed' },
            { name: 'Output Bill of Lading', status: 'completed' },
            { name: 'Output Delivery Order', status: 'completed' }
        ]
    },
    {
        id: 'clearing',
        title: 'Clearing Agent (C&F)',
        icon: ClipboardCheck,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        path: '/customs/gd',
        tasks: [
            { name: 'Record B/L Details', status: 'in-progress' },
            { name: 'File Goods Declaration (GD)', status: 'pending' },
            { name: 'Tax Assessment (CD, RD, IT, ST)', status: 'pending' },
            { name: 'GD Out of Charge', status: 'pending' }
        ]
    },
    {
        id: 'bonded',
        title: 'Transport / Bonded Carrier',
        icon: Truck,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        path: '/atta/bonded-carriers',
        tasks: [
            { name: 'Produce Carrier Manifest', status: 'pending' },
            { name: 'Make Excise Payment (NBP)', status: 'pending' },
            { name: 'Arrangements of Loading', status: 'pending' },
            { name: 'Transport to Border / DryPort', status: 'pending' }
        ]
    },
    {
        id: 'terminal',
        title: 'Terminal & Dispatch',
        icon: Package,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        path: '/local/dispatch',
        tasks: [
            { name: 'Generate Gate Pass', status: 'pending' },
            { name: 'Final Arrangements of Loading', status: 'pending' },
            { name: 'Transport to Destination', status: 'pending' }
        ]
    }
];

export default function OperationsWorkflow() {
    const navigate = useNavigate();
    return (
        <MainLayout
            title="Operations Workflow"
            subtitle="Visualizing the end-to-end shipping process"
        >
            <div className="space-y-8 pb-10">
                {/* Workflow Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stages.map((stage, index) => (
                        <div key={stage.id} className="relative">
                            {/* Connector Line */}
                            {index < stages.length - 1 && (
                                <div className="hidden lg:block absolute top-12 -right-3 w-6 h-[2px] bg-border z-0" />
                            )}

                            <Card className="relative z-10 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={cn("p-2 rounded-lg", stage.bgColor)}>
                                            <stage.icon className={cn("h-5 w-5", stage.color)} />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                            Stage {index + 1}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">{stage.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {stage.tasks.map((task, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm">
                                                {task.status === 'completed' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                ) : task.status === 'in-progress' ? (
                                                    <Clock className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded-full border-2 border-muted mt-0.5 shrink-0" />
                                                )}
                                                <span className={cn(
                                                    task.status === 'pending' ? "text-muted-foreground" : "text-foreground font-medium"
                                                )}>
                                                    {task.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-2 group"
                                        onClick={() => stage.path && navigate(stage.path)}
                                    >
                                        View Details
                                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Detailed Process Diagram (Optional/Placeholder for more complex viz) */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        Detailed Process Flow
                    </h3>

                    <div className="flex flex-col gap-12 relative">
                        {/* Simple Vertical flow for mobile, Horizontal for Desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4">
                            {/* Stage 1 */}
                            <div className="md:col-span-1 flex flex-col items-center text-center gap-2">
                                <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                                <p className="text-xs font-medium">B/L Issuance</p>
                            </div>

                            <div className="hidden md:flex md:col-span-1 justify-center">
                                <ArrowRight className="text-muted-foreground" />
                            </div>

                            {/* Stage 2 */}
                            <div className="md:col-span-1 flex flex-col items-center text-center gap-2">
                                <div className="h-12 w-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2</div>
                                <p className="text-xs font-medium">GD Filing</p>
                            </div>

                            <div className="hidden md:flex md:col-span-1 justify-center">
                                <ArrowRight className="text-muted-foreground" />
                            </div>

                            {/* Stage 3 */}
                            <div className="md:col-span-1 flex flex-col items-center text-center gap-2">
                                <div className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">3</div>
                                <p className="text-xs font-medium">Manifest & Loading</p>
                            </div>

                            <div className="hidden md:flex md:col-span-1 justify-center">
                                <ArrowRight className="text-muted-foreground" />
                            </div>

                            {/* Stage 4 */}
                            <div className="md:col-span-1 flex flex-col items-center text-center gap-2">
                                <div className="h-12 w-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">4</div>
                                <p className="text-xs font-medium">Gate Pass & Dispatch</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actionable Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Average Processing Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.4 Days</div>
                            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                <ArrowDownIcon className="h-3 w-3" /> 12% faster than last week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Customs Clearance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18 Shipments</div>
                            <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" /> 5 shipments overdue
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Successful Dispatches (Today)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                                <CheckCircle2 className="h-3 w-3" /> Target: 15
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}

function ArrowDownIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7 10 5 5 5-5" />
        </svg>
    )
}

function Layers(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
    )
}
