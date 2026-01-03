import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, FileCheck, FileX } from "lucide-react";

interface POD {
    id: string;
    orderId: string;
    customer: string;
    deliveryDate: string;
    status: "Pending Upload" | "Verifying" | "Verified" | "Rejected";
    fileName?: string;
}

const initialPODs: POD[] = [
    { id: "1", orderId: "ORD-9001", customer: "Metro Cash & Carry", deliveryDate: "2023-11-20", status: "Verified", fileName: "pod_9001.pdf" },
    { id: "2", orderId: "ORD-9002", customer: "Carrefour", deliveryDate: "2023-11-21", status: "Pending Upload" },
    { id: "3", orderId: "ORD-9003", customer: "Al-Fatah Stores", deliveryDate: "2023-11-21", status: "Rejected", fileName: "pod_9003_blurry.jpg" },
];

const PODManagement = () => {
    const [pods, setPods] = useState<POD[]>(initialPODs);
    const [uploadId, setUploadId] = useState<string | null>(null);
    const { toast } = useToast();

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fileInput = (e.currentTarget.elements.namedItem("file") as HTMLInputElement);
        if (fileInput.files && fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            setPods(pods.map(p => p.id === uploadId ? { ...p, status: "Verifying", fileName } : p));
            setUploadId(null);
            toast({
                title: "POD Uploaded",
                description: "Proof of Delivery uploaded and sent for verification."
            });
        }
    };

    const handleVerify = (id: string, isApproved: boolean) => {
        setPods(pods.map(p => p.id === id ? { ...p, status: isApproved ? "Verified" : "Rejected" } : p));
        toast({
            title: isApproved ? "POD Verified" : "POD Rejected",
            variant: isApproved ? "default" : "destructive",
            description: isApproved ? "Delivery confirmed." : "Re-upload requested."
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">POD Management</h1>
                <p className="text-muted-foreground">Manage and verify Proof of Delivery documents.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Upload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pods.filter(p => p.status === "Pending Upload").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">To Verify</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pods.filter(p => p.status === "Verifying").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Verified This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{pods.filter(p => p.status === "Verified").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Delivery Records</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search order..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Delivery Date</TableHead>
                                <TableHead>Document</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pods.map((pod) => (
                                <TableRow key={pod.id}>
                                    <TableCell className="font-medium">{pod.orderId}</TableCell>
                                    <TableCell>{pod.customer}</TableCell>
                                    <TableCell>{pod.deliveryDate}</TableCell>
                                    <TableCell>
                                        {pod.fileName ? (
                                            <span className="flex items-center gap-1 text-sm text-blue-600 underline cursor-pointer">
                                                <FileCheck className="h-3 w-3" /> {pod.fileName}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm italic">No file</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            pod.status === "Verified" ? "default" :
                                                pod.status === "Rejected" ? "destructive" :
                                                    pod.status === "Verifying" ? "secondary" : "outline"
                                        } className={pod.status === "Verified" ? "bg-green-600" : ""}>
                                            {pod.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {pod.status === "Pending Upload" && (
                                            <Dialog open={uploadId === pod.id} onOpenChange={(open) => setUploadId(open ? pod.id : null)}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" onClick={() => setUploadId(pod.id)}>
                                                        <Upload className="h-4 w-4 mr-2" /> Upload
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Upload POD for {pod.orderId}</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleUpload} className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="file">Select Document (Image/PDF)</Label>
                                                            <Input id="file" name="file" type="file" required />
                                                        </div>
                                                        <Button type="submit">Upload</Button>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                        {pod.status === "Verifying" && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleVerify(pod.id, true)} title="Approve">
                                                    <FileCheck className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleVerify(pod.id, false)} title="Reject">
                                                    <FileX className="h-4 w-4" />
                                                </Button>
                                            </div>
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

export default PODManagement;
