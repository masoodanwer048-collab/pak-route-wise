import React, { useState } from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ship, Anchor, MapPin, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";

interface TrackEvent {
    status: string;
    location: string;
    timestamp: string;
    description: string;
}

interface Container {
    id: string;
    containerNo: string;
    blNumber: string;
    vessel: string;
    status: "At Sea" | "Arrived" | "Gated Out" | "Pending";
    events: TrackEvent[];
}

const initialContainers: Container[] = [
    {
        id: "1", containerNo: "MSCU-1234567", blNumber: "MSC-BL-998", vessel: "MSC AL GHEZA", status: "At Sea",
        events: [
            { status: "Departure", location: "Jebel Ali", timestamp: "2023-11-20 10:00 AM", description: "Vessel departed from port." },
            { status: "In Transit", location: "Arabian Sea", timestamp: "2023-11-23 08:30 PM", description: "En route to Karachi." }
        ]
    },
    {
        id: "2", containerNo: "MAEU-9876543", blNumber: "MAE-BL-112", vessel: "MAERSK KINLOSS", status: "Arrived",
        events: [
            { status: "Arrival", location: "KPT (East Wharf)", timestamp: "2023-11-25 06:00 AM", description: "Vessel berthed." },
            { status: "Discharge", location: "KPT Yard", timestamp: "2023-11-25 11:45 AM", description: "Container discharged to yard." }
        ]
    },
];

const ContainerTracking = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedContainer, setSearchedContainer] = useState<Container | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = initialContainers.find(c => c.containerNo.includes(searchTerm) || c.blNumber.includes(searchTerm));
        setSearchedContainer(found || null);
    };

    return (
        <MainLayout title="Container Tracking" subtitle="Real-time visibility of maritime cargo shipments.">
            <div className="space-y-6 animate-slide-up">

                {/* Search Section */}
                <Card className="shadow-md border-l-4 border-l-blue-600">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="grid w-full gap-2">
                                <Label htmlFor="search">Track Shipment</Label>
                                <Input
                                    id="search"
                                    placeholder="Enter Container or B/L Number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="text-lg"
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full md:w-auto">
                                <Search className="mr-2 h-5 w-5" /> Track
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Results Section */}
                {searchedContainer ? (
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Container Info */}
                        <Card className="md:col-span-1 shadow-md">
                            <CardHeader>
                                <CardTitle>Shipment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Container No:</span>
                                    <span className="font-bold">{searchedContainer.containerNo}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">B/L Number:</span>
                                    <span className="font-mono">{searchedContainer.blNumber}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Vessel:</span>
                                    <div>
                                        <Ship className="inline h-4 w-4 mr-1 text-blue-500" />
                                        {searchedContainer.vessel}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Status:</span>
                                    <Badge variant={searchedContainer.status === "Arrived" ? "default" : "secondary"}>
                                        {searchedContainer.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="md:col-span-2 shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Tracking History</CardTitle>
                                <ExportActions
                                    data={searchedContainer.events}
                                    fileName={`tracking_${searchedContainer.containerNo}`}
                                    columnMapping={{
                                        status: "Status",
                                        location: "Location",
                                        timestamp: "Timestamp",
                                        description: "Description"
                                    }}
                                />
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
                                    {searchedContainer.events.map((event, index) => (
                                        <div key={index} className="relative pl-6">
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 border-2 border-white"></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                <div>
                                                    <h4 className="text-md font-bold text-gray-900">{event.status}</h4>
                                                    <p className="text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {event.location}
                                                    </p>
                                                    <p className="text-sm mt-1">{event.description}</p>
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {event.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Ship className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Enter a tracking number above to see details.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ContainerTracking;
