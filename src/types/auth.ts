
export type UserStatus = 'active' | 'inactive' | 'locked';

export interface User {
    id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    roleId: string;
    status: UserStatus;
    lastLogin?: Date;
    failedLoginAttempts: number;
    requiresPasswordChange: boolean;
    department?: string;
    location?: string;
    avatar?: string;
    password?: string; // Optional for mock auth handling
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve' | 'lock';

export type ModuleId =
    | 'dashboard'
    | 'freight_sea'
    | 'freight_air'
    | 'freight_road'
    | 'freight_rail'
    | 'bl_management'
    | 'customs_gd'
    | 'import'
    | 'export'
    | 'cnf' // Clearing & Forwarding
    | 'transshipment'
    | 'afghan_transit'
    | 'warehousing'
    | 'finance'
    | 'reports'
    | 'settings'; // Admin

export interface Role {
    id: string;
    name: string;
    description: string;
    isSystem?: boolean; // Cannot be deleted
    permissions: Record<ModuleId, PermissionAction[]>;
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string; // Denormalized for display
    action: string;
    module: ModuleId | 'auth';
    details: string;
    timestamp: Date;
    ipAddress?: string;
}

export const AVAILABLE_MODULES: { id: ModuleId; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'freight_sea', label: 'Sea Freight' },
    { id: 'freight_air', label: 'Air Freight' },
    { id: 'freight_road', label: 'Road Freight' },
    { id: 'freight_rail', label: 'Rail Freight' },
    { id: 'bl_management', label: 'BL / Bilty Management' },
    { id: 'customs_gd', label: 'Goods Declaration (GD)' },
    { id: 'import', label: 'Import Management' },
    { id: 'export', label: 'Export Management' },
    { id: 'cnf', label: 'Clearing & Forwarding' },
    { id: 'transshipment', label: 'Transshipment (TSR)' },
    { id: 'afghan_transit', label: 'Afghan Transit' },
    { id: 'warehousing', label: 'Warehousing & Inventory' },
    { id: 'finance', label: 'Finance & Invoicing' },
    { id: 'reports', label: 'Reports & Analytics' },
    { id: 'settings', label: 'System Administration' },
];

export const AVAILABLE_ACTIONS: { id: PermissionAction; label: string }[] = [
    { id: 'view', label: 'View' },
    { id: 'create', label: 'Create' },
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete' },
    { id: 'export', label: 'Export' },
    { id: 'approve', label: 'Approve' },
    { id: 'lock', label: 'Lock/Unlock' },
];
