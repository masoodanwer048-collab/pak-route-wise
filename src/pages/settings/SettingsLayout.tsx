
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import AuditLogs from './AuditLogs';
import { Users, Shield, FileClock } from 'lucide-react';

export default function SettingsLayout() {
    return (
        <MainLayout title="Administration" subtitle="System settings, user management, and security controls.">
            <div className="space-y-6 animate-slide-up">

                <Tabs defaultValue="users" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Users className="h-4 w-4" /> Users
                        </TabsTrigger>
                        <TabsTrigger value="roles" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Roles & Permissions
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="flex items-center gap-2">
                            <FileClock className="h-4 w-4" /> Audit Logs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <UserManagement />
                    </TabsContent>

                    <TabsContent value="roles" className="space-y-4">
                        <RoleManagement />
                    </TabsContent>

                    <TabsContent value="logs" className="space-y-4">
                        <AuditLogs />
                    </TabsContent>
                </Tabs>

            </div>
        </MainLayout>
    );
}
