import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Package, Truck, Clock, DollarSign, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CourierBooking() {
    const [step, setStep] = useState(1);
    const [estimate, setEstimate] = useState<number | null>(null);

    const handleCalculateRate = () => {
        // Mock calculation
        setEstimate(1250);
        toast.success("Rate calculated successfully");
    };

    return (
        <MainLayout title="Book Courier" subtitle="Schedule a new courier pickup and delivery">
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Route Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Pickup Location</Label>
                                        <Input placeholder="Enter pickup address" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Delivery Location</Label>
                                        <Input placeholder="Enter delivery address" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Preferred Pickup Time</Label>
                                    <Input type="datetime-local" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Package Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Package Type</Label>
                                        <Select>
                                            <SelectTrigger>
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
                                        <Label>Weight (kg)</Label>
                                        <Input type="number" placeholder="0.0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dimensions</Label>
                                        <Input placeholder="L x W x H" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-primary" />
                                    Delivery Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button className="flex flex-col items-center p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center gap-2">
                                        <Clock className="h-6 w-6 text-orange-500" />
                                        <span className="font-bold">Same Day</span>
                                        <span className="text-xs text-muted-foreground">Fastest delivery</span>
                                    </button>
                                    <button className="flex flex-col items-center p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center gap-2">
                                        <Truck className="h-6 w-6 text-blue-500" />
                                        <span className="font-bold">Express</span>
                                        <span className="text-xs text-muted-foreground">1-2 business days</span>
                                    </button>
                                    <button className="flex flex-col items-center p-4 border rounded-xl border-primary bg-primary/5 transition-all text-center gap-2">
                                        <Package className="h-6 w-6 text-green-500" />
                                        <span className="font-bold">Standard</span>
                                        <span className="text-xs text-muted-foreground">3-5 business days</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Price Estimate</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {estimate ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-2xl font-bold text-primary">
                                            <span>Total:</span>
                                            <span>PKR {estimate.toLocaleString()}</span>
                                        </div>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span>Base Fare:</span>
                                                <span>PKR 850</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Weight Charge:</span>
                                                <span>PKR 300</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Fuel Surcharge:</span>
                                                <span>PKR 100</span>
                                            </div>
                                        </div>
                                        <Button className="w-full h-12 text-lg" onClick={() => toast.success("Courier booked successfully!")}>
                                            Confirm Booking
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4 py-8">
                                        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                                        <p className="text-sm text-muted-foreground">Enter package details to see estimate</p>
                                        <Button variant="outline" className="w-full" onClick={handleCalculateRate}>
                                            Calculate Rate
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Recent Bookings</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3">
                                <div className="p-2 bg-muted/50 rounded-lg flex justify-between items-center">
                                    <span>#C99281</span>
                                    <span className="font-mono text-xs">PKR 1,450</span>
                                </div>
                                <div className="p-2 bg-muted/50 rounded-lg flex justify-between items-center">
                                    <span>#C99275</span>
                                    <span className="font-mono text-xs">PKR 2,100</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
