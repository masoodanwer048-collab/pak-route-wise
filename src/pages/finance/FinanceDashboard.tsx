import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, TrendingUp, Download, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const data = [
  { name: "Jan", revenue: 4000, expense: 2400 },
  { name: "Feb", revenue: 3000, expense: 1398 },
  { name: "Mar", revenue: 2000, expense: 9800 },
  { name: "Apr", revenue: 2780, expense: 3908 },
  { name: "May", revenue: 1890, expense: 4800 },
  { name: "Jun", revenue: 2390, expense: 3800 },
  { name: "Jul", revenue: 3490, expense: 4300 },
];

const cashFlowData = [
    { name: "Mon", inflow: 1200, outflow: 800 },
    { name: "Tue", inflow: 1500, outflow: 900 },
    { name: "Wed", inflow: 1000, outflow: 1200 },
    { name: "Thu", inflow: 2000, outflow: 500 },
    { name: "Fri", inflow: 1800, outflow: 1000 },
];

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-full bg-${color}-100`}>
          <Icon className={`h-4 w-4 text-${color}-600`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center mt-1">
        {trend === 'up' ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={trend === 'up' ? "text-green-500" : "text-red-500"}>
          {trendValue}
        </span>
        <span className="ml-1">from last month</span>
      </p>
    </CardContent>
  </Card>
);

export default function FinanceDashboard() {
  return (
    <MainLayout
      title="Finance Dashboard"
      subtitle="Overview of financial performance, cash flow, and expenses"
    >
      <div className="space-y-6">
        {/* Top Actions */}
        <div className="flex justify-between items-center">
            <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" /> This Month
                </Button>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>
            <div className="flex space-x-2">
                <Button className="bg-green-600 hover:bg-green-700">Record Income</Button>
                <Button variant="destructive">Record Expense</Button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Revenue" 
            value="PKR 4,231,000" 
            trend="up" 
            trendValue="+20.1%" 
            icon={DollarSign} 
            color="green"
          />
          <StatCard 
            title="Total Expenses" 
            value="PKR 1,204,500" 
            trend="down" 
            trendValue="-4.5%" 
            icon={CreditCard} 
            color="red"
          />
          <StatCard 
            title="Net Profit" 
            value="PKR 3,026,500" 
            trend="up" 
            trendValue="+12.2%" 
            icon={TrendingUp} 
            color="blue"
          />
          <StatCard 
            title="Cash on Hand" 
            value="PKR 842,000" 
            trend="up" 
            trendValue="+8.1%" 
            icon={Wallet} 
            color="purple"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly comparison for the current year</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Cash Flow</CardTitle>
              <CardDescription>Weekly inflow vs outflow</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inflow" fill="#10b981" name="Inflow" />
                    <Bar dataKey="outflow" fill="#ef4444" name="Outflow" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions & Accounts */}
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest financial activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { desc: "Payment from Global Traders", amount: "+ 150,000", date: "Today", type: "credit" },
                            { desc: "Office Rent - Jan", amount: "- 80,000", date: "Yesterday", type: "debit" },
                            { desc: "Fuel Expense - Truck K-1234", amount: "- 25,000", date: "Yesterday", type: "debit" },
                            { desc: "Advance from ABC Logistics", amount: "+ 50,000", date: "2 days ago", type: "credit" },
                        ].map((t, i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{t.desc}</p>
                                    <p className="text-xs text-muted-foreground">{t.date}</p>
                                </div>
                                <span className={`font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Balances</CardTitle>
                    <CardDescription>Current standing of bank & cash accounts</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        {[
                            { name: "Meezan Bank (Corporate)", balance: "3,240,000", type: "Bank" },
                            { name: "HBL (Operations)", balance: "1,105,000", type: "Bank" },
                            { name: "Cash in Hand (Petty Cash)", balance: "45,000", type: "Cash" },
                            { name: "JazzCash / EasyPaisa", balance: "12,500", type: "Wallet" },
                        ].map((acc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-full border">
                                        {acc.type === 'Bank' ? <CreditCard className="h-4 w-4 text-blue-600" /> : <Wallet className="h-4 w-4 text-purple-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{acc.name}</p>
                                        <p className="text-xs text-muted-foreground">{acc.type}</p>
                                    </div>
                                </div>
                                <span className="font-bold">PKR {acc.balance}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
