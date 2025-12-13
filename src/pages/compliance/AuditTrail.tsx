import React from "react";
import ExportActions from "@/components/common/ExportActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, User, Clock, Monitor } from "lucide-react";

interface AuditLog {
    id: string;
    action: string;
    user: string;
    role: string;
    timestamp: string;
    target: string;
    status: "Success" | "Failed";
}

const auditLogs: AuditLog[] = [
    { id: "1", action: "User Login", user: "admin@logipak.com", role: "Administrator", timestamp: "2023-11-28 09:00:05", target: "System", status: "Success" },
    { id: "2", action: "Created Invoice", user: "accounts@logipak.com", role: "Finance Manager", timestamp: "2023-11-28 10:15:30", target: "INV-2023-088", status: "Success" },
    { id: "3", action: "Update HS Code", user: "declarant@logipak.com", role: "Customs Agent", timestamp: "2023-11-28 11:45:00", target: "GD-KHI-999", status: "Failed" },
    { id: "4", action: "Dispatch Vehicle", user: "ops@logipak.com", role: "Fleet Manager", timestamp: "2023-11-28 13:20:10", target: "LES-9990", status: "Success" },
    { id: "5", action: "Upload POD", user: "driver_ali", role: "Driver", timestamp: "2023-11-28 14:00:22", target: "Delivery-112", status: "Success" },
];

const AuditTrail = () => {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">System Audit Trail</h1>
                <p className="text-muted-foreground">Comprehensive log of all user activities and system events.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Actions (24h)</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <User className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
                        <Monitor className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">3</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Activity Log</CardTitle>
                    <ExportActions
                        data={auditLogs}
                        fileName="system_audit_trail"
                        columnMapping={{
                            timestamp: "Timestamp",
                            user: "User",
                            role: "Role",
                            action: "Action",
                            target: "Target",
                            status: "Status"
                        }}
                    />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User / Role</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target Entity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-xs flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        {log.timestamp}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{log.user}</span>
                                            <span className="text-xs text-muted-foreground">{log.role}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>{log.target}</TableCell>
                                    <TableCell>
                                        <Badge variant={log.status === "Success" ? "outline" : "destructive"} className={log.status === "Success" ? "text-green-600 border-green-600" : ""}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="secondary" className="cursor-pointer">Log ID: {log.id}</Badge>
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

export default AuditTrail;
