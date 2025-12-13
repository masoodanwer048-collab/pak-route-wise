import React, { useState } from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Anchor, ArrowRight, CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VesselCall {
    id: string;
    vesselName: string;
    voyageNo: string;
    terminal: string;
    eta: string;
    etd: string;
    status: "Expected" | "Bertherd" | "Departed";
}

const initialSchedule: VesselCall[] = [
    { id: "1", vesselName: "COSCO SHIPPING", voyageNo: "114W", terminal: "SAPT", eta: "2023-11-28 04:00 AM", etd: "2023-11-29 10:00 PM", status: "Expected" },
    { id: "2", vesselName: "APL FLORIDA", voyageNo: "009E", terminal: "QICT", eta: "2023-11-26 12:00 PM", etd: "2023-11-27 06:00 AM", status: "Bertherd" },
    { id: "3", vesselName: "EVER GIVEN", voyageNo: "221W", terminal: "KPT", eta: "2023-11-24 09:00 AM", etd: "2023-11-25 03:00 PM", status: "Departed" },
];

const VesselSchedule = () => {
    const [schedule, setSchedule] = useState<VesselCall[]>(initialSchedule);
    const [filterTerminal, setFilterTerminal] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSchedule = schedule.filter(call => {
        const matchesTerm = call.vesselName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPort = filterTerminal === "All" || call.terminal === filterTerminal;
        return matchesTerm && matchesPort;
    });

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Vessel Schedule</h1>
                    <p className="text-muted-foreground">Upcoming port calls and vessel departures.</p>
                </div>
                <div className="flex gap-2">
                    <Select value={filterTerminal} onValueChange={setFilterTerminal}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Terminal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Terminals</SelectItem>
                            <SelectItem value="KPT">KPT (Karachi Port)</SelectItem>
                            <SelectItem value="SAPT">SAPT (South Asia)</SelectItem>
                            <SelectItem value="QICT">QICT (Qasim)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Arrivals & Departures</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search vessel..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <ExportActions
                                data={filteredSchedule}
                                fileName="vessel_schedule"
                                columnMapping={{
                                    vesselName: "Vessel Name",
                                    voyageNo: "Voyage",
                                    terminal: "Terminal",
                                    eta: "ETA",
                                    etd: "ETD",
                                    status: "Status"
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vessel Name</TableHead>
                                <TableHead>Voyage</TableHead>
                                <TableHead>Terminal</TableHead>
                                <TableHead>ETA (Arrival)</TableHead>
                                <TableHead>ETD (Departure)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSchedule.map((call) => (
                                <TableRow key={call.id}>
                                    <TableCell className="font-bold flex items-center gap-2">
                                        <Anchor className="h-4 w-4 text-blue-500" />
                                        {call.vesselName}
                                    </TableCell>
                                    <TableCell className="font-mono">{call.voyageNo}</TableCell>
                                    <TableCell>{call.terminal}</TableCell>
                                    <TableCell>{call.eta}</TableCell>
                                    <TableCell>{call.etd}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            call.status === "Expected" ? "outline" :
                                                call.status === "Bertherd" ? "default" : "secondary"
                                        } className={call.status === "Bertherd" ? "bg-green-600 hover:bg-green-700" : ""}>
                                            {call.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-blue-50 dark:bg-slate-900 border-blue-200">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Next 24 Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">5</div>
                        <p className="text-sm text-blue-600">Vessels expected to berth</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Anchor className="h-5 w-5 text-gray-600" />
                        <CardTitle className="text-lg">At Berth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-sm text-gray-500">Currently loading/discharging</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VesselSchedule;
