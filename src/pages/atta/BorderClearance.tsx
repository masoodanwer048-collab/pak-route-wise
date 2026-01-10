import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BorderEntry {
    id: string;
    tokenNumber: string;
    vehicleNo: string;
    gate: "Torkham" | "Chaman" | "Ghulam Khan";
    driver: string;
    arrivalTime: string;
    status: "Waiting Inspection" | "Cleared" | "Flagged";
}

const initialEntries: BorderEntry[] = [
    { id: "1", tokenNumber: "BK-8891", vehicleNo: "KAB-1234", gate: "Torkham", driver: "Rahim Gul", arrivalTime: "08:30 AM", status: "Waiting Inspection" },
    { id: "2", tokenNumber: "BK-8892", vehicleNo: "KBL-7788", gate: "Chaman", driver: "Dawood Khan", arrivalTime: "09:15 AM", status: "Cleared" },
    { id: "3", tokenNumber: "BK-8893", vehicleNo: "AFG-5541", gate: "Torkham", driver: "Aziz Ullah", arrivalTime: "10:00 AM", status: "Flagged" },
];

const BorderClearance = () => {
    const [entries, setEntries] = useState<BorderEntry[]>(initialEntries);
    const { toast } = useToast();

    const handleAction = (id: string, action: "Clear" | "Flag") => {
        setEntries(entries.map(e => {
            if (e.id === id) {
                return { ...e, status: action === "Clear" ? "Cleared" : "Flagged" };
            }
            return e;
        }));

        toast({
            title: action === "Clear" ? "Vehicle Cleared" : "Vehicle Flagged",
            description: `Vehicle ID ${id} has been ${action === "Clear" ? "cleared for exit" : "flagged for inspection"}.`,
            variant: action === "Clear" ? "default" : "destructive"
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Border Clearance</h1>
                <p className="text-muted-foreground">Monitor and process vehicles at border crossings.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Waiting Inspection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{entries.filter(e => e.status === "Waiting Inspection").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Cleared Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{entries.filter(e => e.status === "Cleared").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Flagged Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{entries.filter(e => e.status === "Flagged").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Queue Management</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search vehicle..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Token</TableHead>
                                <TableHead>Vehicle No</TableHead>
                                <TableHead>Gate</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Arrival</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell className="font-mono">{entry.tokenNumber}</TableCell>
                                    <TableCell>{entry.vehicleNo}</TableCell>
                                    <TableCell>{entry.gate}</TableCell>
                                    <TableCell>{entry.driver}</TableCell>
                                    <TableCell>{entry.arrivalTime}</TableCell>
                                    <TableCell>
                                        <Badge variant={entry.status === "Cleared" ? "outline" : entry.status === "Flagged" ? "destructive" : "secondary"}
                                            className={entry.status === "Cleared" ? "bg-green-100 text-green-800 border-green-200" : ""}
                                        >
                                            {entry.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {entry.status === "Waiting Inspection" && (
                                            <>
                                                <Button size="sm" variant="default" onClick={() => handleAction(entry.id, "Clear")} className="bg-green-600 hover:bg-green-700">
                                                    <ShieldCheck className="h-4 w-4 mr-1" /> Clear
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleAction(entry.id, "Flag")}>
                                                    <AlertTriangle className="h-4 w-4 mr-1" /> Flag
                                                </Button>
                                            </>
                                        )}
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

export default BorderClearance;
