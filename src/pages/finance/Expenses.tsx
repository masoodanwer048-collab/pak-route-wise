import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, FileText, Download, Trash2, Edit, Paperclip, Printer, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

// Mock Data
const expenses = [
  { id: 1, expenseNo: "EXP-001", type: "Internal", category: "Rent", payee: "Office Tower A", amount: 150000, date: "2024-03-01", status: "Paid", paymentMethod: "Bank Transfer" },
  { id: 2, expenseNo: "EXP-002", type: "External", category: "Fuel", payee: "Shell Pump 44", amount: 25000, date: "2024-03-02", status: "Approved", paymentMethod: "Cash" },
  { id: 3, expenseNo: "EXP-003", type: "External", category: "Maintenance", payee: "Truck Workshop", amount: 12000, date: "2024-03-03", status: "Pending", paymentMethod: "Credit" },
  { id: 4, expenseNo: "EXP-004", type: "Internal", category: "Utilities", payee: "K-Electric", amount: 45000, date: "2024-03-05", status: "Pending", paymentMethod: "Bank Transfer" },
  { id: 5, expenseNo: "EXP-005", type: "Internal", category: "Salary", payee: "Staff Payroll", amount: 850000, date: "2024-03-01", status: "Paid", paymentMethod: "Bank Transfer" },
];

export default function Expenses() {
  const [activeTab, setActiveTab] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
      type: "internal",
      category: "",
      payee: "",
      referenceNo: "",
      amount: "",
      date: "",
      description: "",
      vehicleId: "",
      tripId: ""
  });

  const handleEdit = (expense: any) => {
      setIsEditMode(true);
      setSelectedExpense(expense);
      setFormData({
          type: expense.type.toLowerCase(),
          category: expense.category.toLowerCase(),
          payee: expense.payee,
          referenceNo: expense.expenseNo,
          amount: expense.amount.toString(),
          date: expense.date,
          description: "Existing expense details...", // Mock description
          vehicleId: "",
          tripId: ""
      });
      setIsOpen(true);
  };

  const handleDelete = (id: number) => {
      if(confirm("Are you sure you want to delete this expense?")) {
          toast.success("Expense deleted successfully");
          // Add delete logic here
      }
  };

  const handleSave = () => {
      // Add validation logic here
      if (!formData.amount || !formData.payee) {
          toast.error("Please fill in required fields");
          return;
      }

      setIsOpen(false);
      if (isEditMode) {
          toast.success("Expense updated successfully");
      } else {
          toast.success("Expense submitted for approval");
      }
      
      // Reset form
      setFormData({
          type: "internal",
          category: "",
          payee: "",
          referenceNo: "",
          amount: "",
          date: "",
          description: "",
          vehicleId: "",
          tripId: ""
      });
      setIsEditMode(false);
      setSelectedExpense(null);
  };

  const handleAddNew = () => {
      setIsEditMode(false);
      setSelectedExpense(null);
      setFormData({
          type: "internal",
          category: "",
          payee: "",
          referenceNo: "",
          amount: "",
          date: "",
          description: "",
          vehicleId: "",
          tripId: ""
      });
      setIsOpen(true);
  };

  const filteredExpenses = expenses.filter(e => {
      const matchesTab = activeTab === "all" || e.type.toLowerCase() === activeTab;
      const matchesSearch = e.payee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.expenseNo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
  });

  const handleExportExcel = () => {
      const ws = XLSX.utils.json_to_sheet(filteredExpenses);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Expenses");
      XLSX.writeFile(wb, "Expenses_Report.xlsx");
      toast.success("Expenses exported to Excel");
  };

  const handlePrint = () => {
      window.print();
  };

  return (
    <MainLayout
      title="Expense Management"
      subtitle="Track internal office expenses and external operational costs"
    >
      <div className="space-y-6 animate-fade-in">
        
        {/* Print Header - Only visible when printing */}
        <div className="hidden print:flex flex-col items-center justify-center mb-8 border-b pb-4">
             <div className="flex items-center gap-4 mb-2">
                <img src="/kohesar_logo.png" alt="Kohsar Logistics" className="h-16 w-auto object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-black uppercase tracking-wide">KOHSAR LOGISTICS (PVT) LTD</h1>
                    <p className="text-sm text-gray-600">KEEP THE LORD ON THE ROAD</p>
                </div>
            </div>
            <h2 className="text-xl font-semibold mt-2 underline">EXPENSE REPORT</h2>
            <p className="text-sm text-gray-500 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 print:hidden">
            <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search expenses..." 
                        className="pl-8" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportExcel}>
                    <Download className="mr-2 h-4 w-4" /> Export Excel
                </Button>
                <Button variant="secondary" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
            </div>
        </div>

        {/* Tabs & Stats */}
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4 print:hidden">
                <TabsList>
                    <TabsTrigger value="all">All Expenses</TabsTrigger>
                    <TabsTrigger value="internal">Internal (Office)</TabsTrigger>
                    <TabsTrigger value="external">External (Ops)</TabsTrigger>
                </TabsList>
                <div className="text-sm font-medium text-muted-foreground">
                    Total: <span className="text-foreground font-bold">
                        PKR {filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                    </span>
                </div>
            </div>

            <Card className="print:shadow-none print:border-none">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ref #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Payee / Vendor</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right print:hidden">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredExpenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-mono text-xs">{expense.expenseNo}</TableCell>
                                <TableCell>{expense.date}</TableCell>
                                <TableCell className="font-medium">{expense.payee}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={expense.type === 'Internal' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}>
                                        {expense.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{expense.paymentMethod}</TableCell>
                                <TableCell className="text-right font-bold">PKR {expense.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge className={
                                        expense.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                        expense.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }>{expense.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right print:hidden">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" title="View Receipt"><Paperclip className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(expense)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" title="Delete" onClick={() => handleDelete(expense.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Tabs>

        {/* Add Expense Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                    <CardDescription>{isEditMode ? "Update existing expense details" : "Create a new internal or external expense record."}</CardDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Expense Type</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={(val) => setFormData({...formData, type: val})}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internal">Internal (Office)</SelectItem>
                                    <SelectItem value="external">External (Operations)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Category</Label>
                            <Select 
                                value={formData.category} 
                                onValueChange={(val) => setFormData({...formData, category: val})}
                            >
                                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rent">Rent</SelectItem>
                                    <SelectItem value="utilities">Utilities</SelectItem>
                                    <SelectItem value="fuel">Fuel</SelectItem>
                                    <SelectItem value="toll">Toll Tax</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="salary">Salary</SelectItem>
                                    <SelectItem value="customs">Customs Clearance</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Payee / Vendor</Label>
                            <Input 
                                placeholder="e.g. Shell Pump or Landlord" 
                                value={formData.payee}
                                onChange={(e) => setFormData({...formData, payee: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Reference No</Label>
                            <Input 
                                placeholder="Invoice / Bill #" 
                                value={formData.referenceNo}
                                onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Amount (PKR)</Label>
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input 
                                type="date" 
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Allocation Section */}
                    <div className="p-3 bg-muted/30 rounded-md border border-dashed">
                        <Label className="text-xs uppercase text-muted-foreground mb-2 block">Cost Allocation (Optional)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Select 
                                value={formData.vehicleId} 
                                onValueChange={(val) => setFormData({...formData, vehicleId: val})}
                            >
                                <SelectTrigger className="h-8"><SelectValue placeholder="Link to Vehicle" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="K-1234">Truck K-1234</SelectItem>
                                    <SelectItem value="L-5678">Truck L-5678</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select 
                                value={formData.tripId} 
                                onValueChange={(val) => setFormData({...formData, tripId: val})}
                            >
                                <SelectTrigger className="h-8"><SelectValue placeholder="Link to Trip" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TRIP-001">TRIP-001 (KHI-LHR)</SelectItem>
                                    <SelectItem value="TRIP-002">TRIP-002 (KHI-ISB)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input 
                            placeholder="Details about the expense..." 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Attach Receipt</Label>
                        <Input type="file" className="cursor-pointer" />
                    </div>
                </div>
                <DialogFooter className="flex justify-between items-center sm:justify-between">
                    {isEditMode ? (
                        <Button variant="destructive" onClick={() => { setIsOpen(false); handleDelete(selectedExpense.id); }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Expense
                        </Button>
                    ) : <div></div>}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                            {isEditMode ? "Update Expense" : "Save Expense"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
