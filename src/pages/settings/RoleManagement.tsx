
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Role, AVAILABLE_MODULES, AVAILABLE_ACTIONS, ModuleId, PermissionAction } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoleManagement() {
    const { roles, addRole, updateRole, deleteRole } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Partial<Role>>({ permissions: {} });

    const handleCreate = () => {
        setEditingRole({ permissions: {} });
        setIsDialogOpen(true);
    };

    const handleEdit = (role: Role) => {
        // Deep copy permissions to avoid mutating state directly
        setEditingRole(JSON.parse(JSON.stringify(role)));
        setIsDialogOpen(true);
    };

    const handleClone = (role: Role) => {
        const newRole = JSON.parse(JSON.stringify(role));
        delete newRole.id;
        newRole.name = `${newRole.name} (Copy)`;
        setEditingRole(newRole);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this role?')) {
            deleteRole(id);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate
        if (!editingRole.name) return;

        // Sanitize permissions (remove empty arrays or ensure structure)
        // Here we assume editingRole.permissions is properly updated by handlePermissionChange

        if (editingRole.id) {
            updateRole(editingRole.id, editingRole as Role);
        } else {
            addRole(editingRole as Omit<Role, 'id'>);
        }
        setIsDialogOpen(false);
    };

    const handlePermissionChange = (module: ModuleId, action: PermissionAction, checked: boolean) => {
        setEditingRole((prev) => {
            const currentPerms = prev.permissions?.[module] || [];
            let newPerms: PermissionAction[];

            if (checked) {
                newPerms = [...currentPerms, action];
            } else {
                newPerms = currentPerms.filter(a => a !== action);
            }

            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [module]: newPerms
                }
            };
        });
    };

    const handleSelectAllForModule = (module: ModuleId, checked: boolean) => {
        setEditingRole((prev) => {
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [module]: checked ? AVAILABLE_ACTIONS.map(a => a.id) : []
                }
            };
        });
    };


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
                    <p className="text-muted-foreground">Define roles and assign fine-grained permissions.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Create Role
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <Card key={role.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{role.name}</CardTitle>
                                {role.isSystem && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">System</span>}
                            </div>
                            <CardDescription>{role.description || 'No description provided.'}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-0 flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleClone(role)}>
                                <Copy className="h-3 w-3 mr-1" /> Clone
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                                <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            {!role.isSystem && (
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(role.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{editingRole.id ? 'Edit Role' : 'Create Role'}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 px-2 flex-shrink-0">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role Name</Label>
                                <Input
                                    value={editingRole.name || ''}
                                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                                    placeholder="e.g. Finance Manager"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={editingRole.description || ''}
                                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                                    placeholder="Role responsibilities..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden border rounded-md">
                        <ScrollArea className="h-full">
                            <Table>
                                <TableHeader className="sticky top-0 bg-secondary z-10">
                                    <TableRow>
                                        <TableHead className="w-[200px]">Module</TableHead>
                                        <TableHead className="w-[50px]">All</TableHead>
                                        {AVAILABLE_ACTIONS.map(action => (
                                            <TableHead key={action.id} className="text-center w-[80px]">{action.label}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {AVAILABLE_MODULES.map(module => {
                                        const modulePerms = editingRole.permissions?.[module.id] || [];
                                        const allSelected = modulePerms.length === AVAILABLE_ACTIONS.length;

                                        return (
                                            <TableRow key={module.id}>
                                                <TableCell className="font-medium">{module.label}</TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={allSelected}
                                                        onCheckedChange={(c) => handleSelectAllForModule(module.id, c as boolean)}
                                                    />
                                                </TableCell>
                                                {AVAILABLE_ACTIONS.map(action => (
                                                    <TableCell key={action.id} className="text-center">
                                                        <Checkbox
                                                            checked={modulePerms.includes(action.id)}
                                                            onCheckedChange={(c) => handlePermissionChange(module.id, action.id, c as boolean)}
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>

                    <div className="flex justify-end pt-4 flex-shrink-0">
                        <Button onClick={handleSave}>Save Permissions</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
