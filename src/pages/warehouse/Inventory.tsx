import React, { useState } from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Package, AlertTriangle, Box } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExportActions from "@/components/common/ExportActions";

interface StockItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    location: string;
    status: "In Stock" | "Low Stock" | "Out of Stock";
}

const initialStock: StockItem[] = [
    { id: "1", sku: "SKU-1001", name: "Cotton Bales", category: "Raw Material", quantity: 500, unit: "Bales", location: "Bin A-01", status: "In Stock" },
    { id: "2", sku: "SKU-2002", name: "Spare Parts Kit", category: "Machinery", quantity: 5, unit: "Boxes", location: "Rack C-05", status: "Low Stock" },
    { id: "3", sku: "SKU-3003", name: "Textile Dyes", category: "Chemicals", quantity: 0, unit: "Drums", location: "Zone D", status: "Out of Stock" },
];

const Inventory = () => {
    const [stock, setStock] = useState<StockItem[]>(initialStock);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const qty = parseInt(formData.get("quantity") as string) || 0;
        let status: StockItem["status"] = "In Stock";
        if (qty === 0) status = "Out of Stock";
        else if (qty < 10) status = "Low Stock";

        const newItem: StockItem = {
            id: Math.random().toString(),
            sku: formData.get("sku") as string,
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            quantity: qty,
            unit: formData.get("unit") as string,
            location: formData.get("location") as string,
            status: status
        };

        setStock([newItem, ...stock]);
        setIsAddOpen(false);
        toast({
            title: "Item Added",
            description: `${newItem.name} (Qty: ${newItem.quantity}) added to inventory.`
        });
    };

    const filteredStock = stock.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout title="Inventory Management" subtitle="Track stock levels, locations, and asset movements.">
            <div className="space-y-6 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <ExportActions
                            data={filteredStock}
                            fileName="inventory_stock"
                            columnMapping={{
                                sku: "SKU / Code",
                                quantity: "Qty",
                                location: "Bin/Loc"
                            }}
                        />
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Add Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Stock Item</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddItem} className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="sku">SKU / Code</Label>
                                            <Input id="sku" name="sku" placeholder="e.g. SKU-555" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select name="category" required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Raw Material">Raw Material</SelectItem>
                                                    <SelectItem value="Finished Goods">Finished Goods</SelectItem>
                                                    <SelectItem value="Machinery">Machinery</SelectItem>
                                                    <SelectItem value="Chemicals">Chemicals</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Item Name</Label>
                                        <Input id="name" name="name" placeholder="Product Description" required />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input id="quantity" name="quantity" type="number" placeholder="0" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="unit">Unit</Label>
                                            <Input id="unit" name="unit" placeholder="e.g. pcs, kg" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="location">Bin/Loc</Label>
                                            <Input id="location" name="location" placeholder="e.g. A-01" required />
                                        </div>
                                    </div>
                                    <Button type="submit">Add to Inventory</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stock.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stock.filter(i => i.status === "Low Stock").length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                            <Box className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stock.filter(i => i.status === "Out of Stock").length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Current Stock</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search SKU or Name..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStock.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono">{item.sku}</TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell>{item.quantity} {item.unit}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                item.status === "In Stock" ? "default" :
                                                    item.status === "Low Stock" ? "secondary" : "destructive"
                                            } className={item.status === "In Stock" ? "bg-green-600" : ""}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Adjust</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div >
        </MainLayout>
    );
};

export default Inventory;
