import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, ShieldCheck, ShieldAlert, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SealRecord {
    id: string;
    container: string;
    sealNumber: string;
    status: "Verified" | "Tampered" | "Pending";
    location: string;
    scannedAt: string;
}

const initialSeals: SealRecord[] = [
    { id: "1", container: "CNTR-5501", sealNumber: "SL-998877", status: "Verified", location: "Gate 1", scannedAt: "10:30 AM" },
    { id: "2", container: "CNTR-5502", sealNumber: "SL-998878", status: "Verified", location: "Gate 1", scannedAt: "11:15 AM" },
    { id: "3", container: "CNTR-5503", sealNumber: "SL-998879", status: "Tampered", location: "Inspection Bay", scannedAt: "11:45 AM" },
];

const SealVerification = () => {
    const [seals, setSeals] = useState<SealRecord[]>(initialSeals);
    const [scanInput, setScanInput] = useState("");
    const { toast } = useToast();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate verification logic
        const isTampered = Math.random() > 0.9;
        const newRecord: SealRecord = {
            id: Math.random().toString(),
            container: "Unknown", // In a real app, this would come from the scan or lookup
            sealNumber: scanInput,
            status: isTampered ? "Tampered" : "Verified",
            location: "Current Terminal",
            scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setSeals([newRecord, ...seals]);
        setScanInput("");

        if (isTampered) {
            toast({
                variant: "destructive",
                title: "Alert: Seal Tampered",
                description: `Seal ${newRecord.sealNumber} shows signs of tampering.`,
            });
        } else {
            toast({
                title: "Seal Verified",
                description: `Seal ${newRecord.sealNumber} is intact and valid.`,
            });
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Seal Verification</h1>
                <p className="text-muted-foreground">Verify container seals integrity at gates and transfer points.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 shadow-md border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle>Quick Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sealInput">Scan Seal / Enter Number</Label>
                                <Input
                                    id="sealInput"
                                    placeholder="Scan barcode or type..."
                                    value={scanInput}
                                    onChange={(e) => setScanInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <Check className="mr-2 h-4 w-4" /> Verify Now
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Scans</CardTitle>
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Seal Number</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {seals.map((seal) => (
                                    <TableRow key={seal.id}>
                                        <TableCell className="font-mono">{seal.sealNumber}</TableCell>
                                        <TableCell>
                                            <Badge variant={seal.status === "Verified" ? "default" : seal.status === "Tampered" ? "destructive" : "secondary"}
                                                className={seal.status === "Verified" ? "bg-green-600 hover:bg-green-700" : ""}
                                            >
                                                {seal.status === "Tampered" && <ShieldAlert className="mr-1 h-3 w-3" />}
                                                {seal.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{seal.scannedAt}</TableCell>
                                        <TableCell>{seal.location}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SealVerification;
