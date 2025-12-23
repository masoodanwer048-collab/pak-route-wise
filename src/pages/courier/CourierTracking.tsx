import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Package, Clock, CheckCircle2, Truck, FileCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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

    const handleSearch = () => {
        setIsSearching(true);
        // Mimic API delay
        setTimeout(() => setIsSearching(false), 800);
    };

    return (
        <MainLayout title="Track Courier" subtitle="Real-time tracking for your shipments">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                {/* Search Bar */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Enter Tracking ID (e.g. PK-12345678)"
                                    className="pl-10 h-12 text-lg border-primary/20"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                />
                            </div>
                            <Button className="h-12 px-8 text-lg" onClick={handleSearch} disabled={isSearching}>
                                {isSearching ? 'Searching...' : 'Track Now'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {trackingId && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Timeline */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-lg">Delivery Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-0 pb-2">
                                    {trackingSteps.map((step, index) => (
                                        <div key={index} className="flex gap-4 min-h-[70px]">
                                            <div className="flex flex-col items-center">
                                                <div className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 z-10",
                                                    step.completed ? "bg-primary border-primary text-white" : "bg-background border-muted text-muted-foreground"
                                                )}>
                                                    <step.icon className="h-4 w-4" />
                                                </div>
                                                {index !== trackingSteps.length - 1 && (
                                                    <div className={cn(
                                                        "w-0.5 grow mt-1 mb-1",
                                                        step.completed ? "bg-primary" : "bg-muted"
                                                    )} />
                                                )}
                                            </div>
                                            <div className="pb-8">
                                                <p className={cn(
                                                    "font-bold text-sm",
                                                    step.completed ? "text-foreground" : "text-muted-foreground"
                                                )}>{step.status}</p>
                                                <p className="text-xs text-muted-foreground">{step.date || 'Pending'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipment Details & Map Placeholder */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Shipment Details</CardTitle>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                        In Transit
                                    </Badge>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">From</p>
                                        <p className="font-bold">Karachi, Sindh</p>
                                        <p className="text-sm text-muted-foreground">Plot 123, Block 5, Clifton</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">To</p>
                                        <p className="font-bold">Lahore, Punjab</p>
                                        <p className="text-sm text-muted-foreground">House 45, Street 2, DHA Ph 3</p>
                                    </div>
                                    <div className="col-span-2 pt-4 border-t border-dashed">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Type</p>
                                                <p className="text-sm font-bold">Standard Parcel</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Weight</p>
                                                <p className="text-sm font-bold">2.4 kg</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Est. Delivery</p>
                                                <p className="text-sm font-bold text-primary">Dec 25, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map Placeholder */}
                            <Card className="overflow-hidden bg-muted/30">
                                <div className="h-[250px] relative flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=31.5204,74.3587&zoom=10&size=600x300&sensor=false')] bg-cover grayscale" />
                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                        <MapPin className="h-10 w-10 text-primary animate-bounce" />
                                        <p className="text-sm font-medium">Currently near Faisalabad</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {!trackingId && (
                    <div className="text-center py-20 opacity-40">
                        <Package className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No tracking ID entered</h3>
                        <p className="text-sm">Enter your tracking number above to see shipment progress</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
