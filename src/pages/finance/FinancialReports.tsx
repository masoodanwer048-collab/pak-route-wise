import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, PieChart } from "lucide-react";

const FinancialReports = () => {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Financial Reports</h1>
                    <p className="text-muted-foreground">Overview of earnings, expenses, and profitability.</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Export PDF
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-green-50 dark:bg-slate-900 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit (Monthly)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">$45,230</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-slate-900 border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700">$12,450</div>
                        <p className="text-xs text-muted-foreground">+4% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                        <PieChart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$8,300</div>
                        <p className="text-xs text-muted-foreground">15 invoices outstanding</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Monthly Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Transaction Count</TableHead>
                                <TableHead className="text-right">Total Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Freight Services</TableCell>
                                <TableCell><span className="text-green-600">Active</span></TableCell>
                                <TableCell>154</TableCell>
                                <TableCell className="text-right">$120,400</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Customs Duty</TableCell>
                                <TableCell><span className="text-yellow-600">Pending Review</span></TableCell>
                                <TableCell>45</TableCell>
                                <TableCell className="text-right">$55,200</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Warehousing Storage</TableCell>
                                <TableCell><span className="text-green-600">Active</span></TableCell>
                                <TableCell>89</TableCell>
                                <TableCell className="text-right">$24,150</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Demurrage Charges</TableCell>
                                <TableCell><span className="text-red-600">High</span></TableCell>
                                <TableCell>12</TableCell>
                                <TableCell className="text-right">$4,800</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default FinancialReports;
