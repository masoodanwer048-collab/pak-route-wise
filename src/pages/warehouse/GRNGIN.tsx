import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, ArrowDownLeft, ArrowUpRight, ClipboardList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Note {
    id: string;
    refNumber: string;
    type: "GRN" | "GIN";
    date: string;
    party: string;
    itemsCount: number;
    status: "Processed" | "Pending" | "Draft";
}

const initialNotes: Note[] = [
    { id: "1", refNumber: "GRN-2023-001", type: "GRN", date: "2023-11-25", party: "Supplier A", itemsCount: 15, status: "Processed" },
    { id: "2", refNumber: "GIN-2023-045", type: "GIN", date: "2023-11-26", party: "Production Line 1", itemsCount: 4, status: "Pending" },
    { id: "3", refNumber: "GRN-2023-002", type: "GRN", date: "2023-11-26", party: "Supplier B", itemsCount: 10, status: "Draft" },
];

const GRNGIN = () => {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { toast } = useToast();

    const handleCreateNote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const type = formData.get("type") as "GRN" | "GIN";

        const newNote: Note = {
            id: Math.random().toString(),
            refNumber: `${type}-${Math.floor(Math.random() * 10000)}`,
            type: type,
            date: new Date().toISOString().split('T')[0],
            party: formData.get("party") as string,
            itemsCount: 0, // In a real app, items would be added via a sub-form
            status: "Draft"
        };

        setNotes([newNote, ...notes]);
        setIsCreateOpen(false);
        toast({
            title: `${type} Created`,
            description: `Reference ${newNote.refNumber} generated successfully.`
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">GRN / GIN</h1>
                    <p className="text-muted-foreground">Manage Goods Received Notes and Goods Issue Notes.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" /> Create Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New GRN / GIN</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateNote} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Transaction Type</Label>
                                <Select name="type" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GRN">GRN (Inbound)</SelectItem>
                                        <SelectItem value="GIN">GIN (Outbound)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="party">Party Name (Supplier / Department)</Label>
                                <Input id="party" name="party" placeholder="e.g. Acme Corp OR Assembly Line" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ref">External Reference (PO/Req No)</Label>
                                <Input id="ref" name="ref" placeholder="Optional" />
                            </div>
                            <Button type="submit">Create Draft</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inbound (GRN) Today</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notes.filter(n => n.type === "GRN" && n.date === new Date().toISOString().split('T')[0]).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outbound (GIN) Today</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notes.filter(n => n.type === "GIN" && n.date === new Date().toISOString().split('T')[0]).length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Transactions</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search reference..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="grn">GRN With Inbound</TabsTrigger>
                            <TabsTrigger value="gin">GIN With Outbound</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Party</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {notes.map((note) => (
                                        <TableRow key={note.id}>
                                            <TableCell className="font-mono">{note.refNumber}</TableCell>
                                            <TableCell>
                                                <Badge variant={note.type === "GRN" ? "outline" : "secondary"} className={note.type === "GRN" ? "text-green-600 border-green-600" : "text-blue-600 bg-blue-100"}>
                                                    {note.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{note.date}</TableCell>
                                            <TableCell>{note.party}</TableCell>
                                            <TableCell>{note.itemsCount}</TableCell>
                                            <TableCell>
                                                <Badge variant={note.status === "Processed" ? "default" : "secondary"}>{note.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                        <TabsContent value="grn" className="mt-4">
                            <div className="text-sm text-muted-foreground p-4 text-center">GRN Filter applied to the list above...</div>
                            {/* In a real app, we'd reuse the table with filtered data */}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default GRNGIN;
