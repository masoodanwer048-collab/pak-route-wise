import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Map, Plus, Navigation } from "lucide-react";

interface Route {
    id: string;
    routeName: string;
    origin: string;
    destination: string;
    totalDistance: string;
    estimatedTime: string;
    stops: number;
    status: "Active" | "Draft" | "Archived";
}

const initialRoutes: Route[] = [
    { id: "1", routeName: "LHR-ISL Express", origin: "Lahore", destination: "Islamabad", totalDistance: "380 km", estimatedTime: "4h 30m", stops: 1, status: "Active" },
    { id: "2", routeName: "City Distribution A", origin: "Warehouse 1", destination: "Sector G-11", totalDistance: "45 km", estimatedTime: "1h 15m", stops: 5, status: "Active" },
    { id: "3", routeName: "KHI-HYD Supply", origin: "Karachi Port", destination: "Hyderabad", totalDistance: "160 km", estimatedTime: "2h 45m", stops: 0, status: "Draft" },
];

const RoutePlanning = () => {
    const [routes, setRoutes] = useState<Route[]>(initialRoutes);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { toast } = useToast();

    const handleCreateRoute = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newRoute: Route = {
            id: Math.random().toString(),
            routeName: formData.get("routeName") as string,
            origin: formData.get("origin") as string,
            destination: formData.get("destination") as string,
            totalDistance: formData.get("distance") as string,
            estimatedTime: formData.get("time") as string,
            stops: parseInt(formData.get("stops") as string) || 0,
            status: "Draft"
        };
        setRoutes([newRoute, ...routes]);
        setIsCreateOpen(false);
        toast({
            title: "Route Drafted",
            description: `${newRoute.routeName} has been saved as a draft.`
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Route Planning</h1>
                    <p className="text-muted-foreground">Optimize delivery routes and manage logistics pathways.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> New Route
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Plan New Route</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateRoute} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="routeName">Route Name</Label>
                                <Input id="routeName" name="routeName" placeholder="e.g. Morning Distribution" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="origin">Origin</Label>
                                    <Input id="origin" name="origin" placeholder="Start Point" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="destination">Destination</Label>
                                    <Input id="destination" name="destination" placeholder="End Point" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="distance">Est. Distance</Label>
                                    <Input id="distance" name="distance" placeholder="e.g. 50 km" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="time">Est. Time</Label>
                                    <Input id="time" name="time" placeholder="e.g. 1h 30m" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stops">Stops</Label>
                                    <Input id="stops" name="stops" type="number" placeholder="0" required />
                                </div>
                            </div>
                            <Button type="submit">Save Draft</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{routes.filter(r => r.status === "Active").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <Map className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{routes.filter(r => r.status === "Draft").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Route Library</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search routes..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Route Name</TableHead>
                                <TableHead>Origin</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Distance</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Stops</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell className="font-medium">{route.routeName}</TableCell>
                                    <TableCell>{route.origin}</TableCell>
                                    <TableCell>{route.destination}</TableCell>
                                    <TableCell>{route.totalDistance}</TableCell>
                                    <TableCell>{route.estimatedTime}</TableCell>
                                    <TableCell>{route.stops}</TableCell>
                                    <TableCell>
                                        <Badge variant={route.status === "Active" ? "default" : "secondary"}>{route.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoutePlanning;
