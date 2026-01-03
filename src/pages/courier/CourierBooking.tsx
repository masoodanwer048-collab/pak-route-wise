import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Package, Truck, Clock, DollarSign, MapPin, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type DeliveryMethod = 'standard' | 'express' | 'same-day';

interface CourierFormData {
    pickup: string;
    delivery: string;
    pickupTime: string;
    packageType: string;
    weight: string;
    dimensions: string;
    method: DeliveryMethod;
}

export default function CourierBooking() {
    const [isBooking, setIsBooking] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showEstimate, setShowEstimate] = useState(false);

    const [formData, setFormData] = useState<CourierFormData>({
        pickup: '',
        delivery: '',
        pickupTime: '',
        packageType: 'parcel',
        weight: '',
        dimensions: '',
        method: 'standard'
    });

    const rates = useMemo(() => {
        const weight = parseFloat(formData.weight) || 0;
        const base = formData.method === 'same-day' ? 1200 : formData.method === 'express' ? 850 : 500;
        const weightCharge = weight * 150;
        const fuel = (base + weightCharge) * 0.1;

        return {
            base,
            weightCharge,
            fuel,
            total: Math.round(base + weightCharge + fuel)
        };
    }, [formData.weight, formData.method]);

    const handleInputChange = (field: keyof CourierFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setShowEstimate(false); // Reset estimate when data changes
    };

    const handleCalculateRate = () => {
        if (!formData.pickup || !formData.delivery || !formData.weight) {
            toast.error("Please fill in location and weight details");
            return;
        }

        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            setShowEstimate(true);
            toast.success("Rate calculated successfully");
        }, 600);
    };

    const handleConfirmBooking = () => {
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            toast.success(`Booking Confirmed! Tracking ID: PK-${Math.floor(Math.random() * 900000 + 100000)}`);
            setShowEstimate(false);
            setFormData({
                pickup: '',
                delivery: '',
                pickupTime: '',
                packageType: 'parcel',
                weight: '',
                dimensions: '',
                method: 'standard'
            });
        }, 1500);
    };

    return (
        <MainLayout title="Book Courier" subtitle="Schedule a new courier pickup and delivery">
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Route Details */}
                        <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Route Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Pickup Location</Label>
                                        <Input
                                            placeholder="Enter pickup address"
                                            className="bg-muted/30 focus-visible:ring-primary"
                                            value={formData.pickup}
                                            onChange={(e) => handleInputChange('pickup', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Delivery Location</Label>
                                        <Input
                                            placeholder="Enter delivery address"
                                            className="bg-muted/30 focus-visible:ring-primary"
                                            value={formData.delivery}
                                            onChange={(e) => handleInputChange('delivery', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 max-w-sm">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Preferred Pickup Time</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="datetime-local"
                                            className="pl-10 bg-muted/30"
                                            value={formData.pickupTime}
                                            onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Package Info */}
                        <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="h-5 w-5 text-blue-500" />
                                    Package Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Package Type</Label>
                                        <Select
                                            value={formData.packageType}
                                            onValueChange={(val) => handleInputChange('packageType', val)}
                                        >
                                            <SelectTrigger className="bg-muted/30">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="document">Document</SelectItem>
                                                <SelectItem value="parcel">Parcel</SelectItem>
                                                <SelectItem value="fragile">Fragile</SelectItem>
                                                <SelectItem value="temp">Temperature Sensitive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.0"
                                            className="bg-muted/30"
                                            value={formData.weight}
                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Dimensions</Label>
                                        <Input
                                            placeholder="L x W x H"
                                            className="bg-muted/30"
                                            value={formData.dimensions}
                                            onChange={(e) => handleInputChange('dimensions', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Method */}
                        <Card className="overflow-hidden border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-green-500" />
                                    Delivery Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'same-day', label: 'Same Day', icon: Clock, desc: 'Fastest delivery', color: 'text-orange-500' },
                                        { id: 'express', label: 'Express', icon: Truck, desc: '1-2 business days', color: 'text-blue-500' },
                                        { id: 'standard', label: 'Standard', icon: Package, desc: '3-5 business days', color: 'text-green-500' },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => handleInputChange('method', m.id as DeliveryMethod)}
                                            className={cn(
                                                "flex flex-col items-center p-5 border-2 rounded-2xl transition-all text-center gap-2 group relative overflow-hidden",
                                                formData.method === m.id
                                                    ? "border-primary bg-primary/5 shadow-inner"
                                                    : "border-muted bg-card hover:border-primary/40 hover:bg-muted/50"
                                            )}
                                        >
                                            <m.icon className={cn("h-8 w-8 mb-1 transition-transform group-hover:scale-110", m.color)} />
                                            <span className="font-bold">{m.label}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{m.desc}</span>
                                            {formData.method === m.id && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircle2 className="h-4 w-4 text-primary fill-primary/10" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Summary / Estimate */}
                        <Card className="sticky top-6 shadow-lg border-2 border-primary/20">
                            <CardHeader className="bg-primary/5 border-b">
                                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                    <DollarSign className="h-5 w-5" />
                                    Price Estimate
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {showEstimate ? (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>Base Fare ({formData.method})</span>
                                                <span className="font-mono">PKR {rates.base}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>Weight Charge ({formData.weight}kg)</span>
                                                <span className="font-mono">PKR {rates.weightCharge}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>Fuel Surcharge (10%)</span>
                                                <span className="font-mono">PKR {rates.fuel}</span>
                                            </div>
                                            <div className="pt-3 border-t-2 border-dashed flex justify-between items-center">
                                                <span className="font-bold text-lg">Total Amount</span>
                                                <span className="text-2xl font-black text-primary font-mono">PKR {rates.total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20"
                                            disabled={isBooking}
                                            onClick={handleConfirmBooking}
                                        >
                                            {isBooking ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Confirm Booking'
                                            )}
                                        </Button>

                                        <p className="text-[10px] text-center text-muted-foreground">
                                            By confirming, you agree to our terms of service and shipment conditions.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-5 py-10">
                                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50 group-hover:scale-110 transition-transform">
                                            <DollarSign className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground px-4">
                                            Fill in the pickup, delivery, and package weight to calculate the accurate shipping cost.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full border-primary/30 hover:bg-primary/5 h-12"
                                            onClick={handleCalculateRate}
                                            disabled={isCalculating}
                                        >
                                            {isCalculating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Calculating...
                                                </>
                                            ) : (
                                                'Calculate Rate'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order History Preview */}
                        <Card className="bg-muted/20">
                            <CardHeader className="py-3">
                                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Recent Bookings</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3 pb-4">
                                <div className="p-3 bg-card border rounded-xl flex justify-between items-center hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">PK-182901</span>
                                        <span className="text-[10px] text-muted-foreground">to Lahore</span>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-primary">PKR 1,450</span>
                                </div>
                                <div className="p-3 bg-card border rounded-xl flex justify-between items-center hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">PK-182875</span>
                                        <span className="text-[10px] text-muted-foreground">to Islamabad</span>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-primary">PKR 2,100</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
