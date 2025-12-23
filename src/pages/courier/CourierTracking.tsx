import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Package, Clock, CheckCircle2, Truck, FileCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const trackingSteps = [
    { status: 'Booked', date: '2025-12-23 10:30 AM', completed: true, icon: FileCheck },
    { status: 'Picked Up', date: '2025-12-23 02:15 PM', completed: true, icon: Package },
    { status: 'At Sort Facility', date: '2025-12-23 06:45 PM', completed: true, icon: Clock },
    { status: 'In Transit', date: '2025-12-24 08:00 AM', completed: true, icon: Truck },
    { status: 'Out for Delivery', date: '', completed: false, icon: MapPin },
    { status: 'Delivered', date: '', completed: false, icon: CheckCircle2 },
];

export default function CourierTracking() {
    const [trackingId, setTrackingId] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!trackingId) {
            toast.error("Please enter a tracking ID");
            return;
        }
        setIsSearching(true);
        setHasSearched(false);
        // Mimic API delay
        setTimeout(() => {
            setIsSearching(false);
            setHasSearched(true);
            toast.success("Shipment data retrieved");
        }, 1200);
    };

    return (
        <MainLayout title="Track Courier" subtitle="Real-time tracking for your shipments">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Enter Tracking ID (e.g. PK-12345678)"
                                    className="pl-10 h-12 text-lg border-primary/20 bg-background"
                                    value={trackingId}
                                    onChange={(e) => {
                                        setTrackingId(e.target.value);
                                        setHasSearched(false);
                                    }}
                                />
                            </div>
                            <Button type="submit" className="h-12 px-8 text-lg min-w-[160px]" disabled={isSearching}>
                                {isSearching ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Tracking...
                                    </>
                                ) : 'Track Now'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {isSearching && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-500">
                        <div className="relative h-20 w-20">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                            <Package className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <p className="text-muted-foreground font-medium animate-pulse">Locating your shipment...</p>
                    </div>
                )}

                {hasSearched && !isSearching && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Timeline */}
                        <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Delivery Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-0 pb-2 pl-2">
                                    {trackingSteps.map((step, index) => (
                                        <div key={index} className="flex gap-4 min-h-[70px]">
                                            <div className="flex flex-col items-center">
                                                <div className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 z-10 transition-colors duration-500",
                                                    step.completed ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-background border-muted text-muted-foreground"
                                                )}>
                                                    <step.icon className="h-4 w-4" />
                                                </div>
                                                {index !== trackingSteps.length - 1 && (
                                                    <div className={cn(
                                                        "w-0.5 grow mt-1 mb-1 transition-colors duration-500",
                                                        step.completed ? "bg-primary" : "bg-muted"
                                                    )} />
                                                )}
                                            </div>
                                            <div className="pb-8">
                                                <p className={cn(
                                                    "font-bold text-sm",
                                                    step.completed ? "text-foreground" : "text-muted-foreground"
                                                )}>{step.status}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{step.date || 'Pending'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipment Details & Map Placeholder */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">Shipment Details</CardTitle>
                                        <p className="text-xs text-muted-foreground font-mono">{trackingId}</p>
                                    </div>
                                    <Badge className="bg-blue-500 hover:bg-blue-600 px-3 py-1">
                                        In Transit
                                    </Badge>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                                    <div className="space-y-2 relative pl-6">
                                        <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10" />
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Shipper</p>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-base leading-tight">Karachi Central Hub</p>
                                            <p className="text-xs text-muted-foreground">Plot 123, Sector 5, Clifton</p>
                                            <p className="text-xs text-muted-foreground font-medium">Karachi, Sindh</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 relative pl-6 border-t sm:border-t-0 sm:pt-0 pt-6">
                                        <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Consignee</p>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-base leading-tight">Ahmed Express Solutions</p>
                                            <p className="text-xs text-muted-foreground">House 45, Gulberg III</p>
                                            <p className="text-xs text-muted-foreground font-medium">Lahore, Punjab</p>
                                        </div>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2 pt-6 border-t border-dashed">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Weight</p>
                                                <p className="text-sm font-black">2.4 kg</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Type</p>
                                                <p className="text-sm font-black">Parcel</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Mode</p>
                                                <Badge variant="outline" className="text-[10px] py-0 h-5 font-bold border-primary/50 text-primary">Standard</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Est. Arrival</p>
                                                <p className="text-sm font-black text-primary">Tomorrow</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map Placeholder */}
                            <Card className="overflow-hidden bg-muted/20 border-2 border-primary/5 group">
                                <div className="h-[280px] relative flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        <div className="relative">
                                            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                                            <MapPin className="h-12 w-12 text-primary relative z-10 drop-shadow-lg" />
                                        </div>
                                        <div className="bg-background/95 backdrop-blur px-4 py-2 rounded-full border shadow-xl flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-xs font-black tracking-tight uppercase">Live near Faisalabad</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <Button size="sm" variant="secondary" className="h-8 px-3 text-[10px] font-bold">View full map</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {!hasSearched && !isSearching && (
                    <div className="text-center py-24 group">
                        <div className="relative h-20 w-20 mx-auto mb-6">
                            <Package className="h-16 w-16 text-muted-foreground/30 absolute inset-0 m-auto group-hover:scale-110 group-hover:text-primary/40 transition-all duration-500" />
                            <Search className="h-8 w-8 text-muted-foreground/20 absolute -bottom-1 -right-1 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground/80">Search for your shipment</h3>
                        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto mt-2 italic">
                            Enter your unique tracking ID provided during booking to see live updates.
                        </p>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}
