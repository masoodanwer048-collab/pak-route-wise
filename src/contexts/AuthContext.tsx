
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, AuditLog, ModuleId, PermissionAction } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
    currentUser: User | null;
    users: User[];
    roles: Role[];
    logs: AuditLog[];
    login: (username: string, pass: string) => boolean;
    logout: () => void;
    hasPermission: (module: ModuleId, action: PermissionAction) => boolean;

    // Admin functions
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (id: string, data: Partial<User>) => void;
    deleteUser: (id: string) => void;

    addRole: (role: Omit<Role, 'id'>) => void;
    updateRole: (id: string, data: Partial<Role>) => void;
    deleteRole: (id: string) => void;

    logAction: (action: string, module: ModuleId | 'auth', details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Mock Data ---

const MOCK_ROLES: Role[] = [
    {
        id: 'role-admin',
        name: 'Administrator',
        description: 'Full system access',
        isSystem: true,
        permissions: {
            dashboard: ['view', 'export'],
            freight_sea: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            freight_air: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            freight_road: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            freight_rail: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            bl_management: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            customs_gd: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            import: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            export: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            cnf: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            transshipment: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            afghan_transit: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            warehousing: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            finance: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            reports: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            settings: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
        }
    },
    {
        id: 'role-manager',
        name: 'Manager',
        description: 'Operations, Approvals, Reports. No Settings.',
        isSystem: true,
        permissions: {
            dashboard: ['view', 'export'],
            freight_sea: ['view', 'create', 'edit', 'approve', 'export'],
            freight_air: ['view', 'create', 'edit', 'approve', 'export'],
            freight_road: ['view', 'create', 'edit', 'approve', 'export'],
            bl_management: ['view', 'create', 'edit', 'approve'],
            customs_gd: ['view', 'create', 'edit', 'approve'],
            import: ['view', 'create', 'edit', 'approve'],
            export: ['view', 'create', 'edit', 'approve'],
            reports: ['view', 'export'],
        } as any
    },
    {
        id: 'role-user',
        name: 'User',
        description: 'Limited access. View/Create only.',
        isSystem: true,
        permissions: {
            dashboard: ['view'],
            freight_sea: ['view', 'create'],
            freight_air: ['view', 'create'],
            freight_road: ['view', 'create'],
            bl_management: ['view'],
            customs_gd: ['view'],
            import: ['view'],
            export: ['view'],
        } as any
    }
];

const MOCK_USERS: User[] = [
    {
        id: 'u1',
        fullName: 'System Administrator',
        username: 'admin',
        email: 'admin@logistics.com',
        phone: '+92 300 0000001',
        roleId: 'role-admin',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Admin@123',
        department: 'IT',
        location: 'HQ',
        avatar: 'https://github.com/shadcn.png'
    },
    {
        id: 'u2',
        fullName: 'Operations Manager',
        username: 'manager',
        email: 'manager@logistics.com',
        phone: '+92 300 0000002',
        roleId: 'role-manager',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Manager@123',
        department: 'Operations',
        location: 'Karachi Port',
    },
    {
        id: 'u3',
        fullName: 'Standard User',
        username: 'user',
        email: 'user@logistics.com',
        phone: '+92 300 0000003',
        roleId: 'role-user',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'User@123',
        department: 'Data Entry',
        location: 'Lahore Office',
    }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Start with NO user logged in
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
    const [logs, setLogs] = useState<AuditLog[]>([]);

    const logAction = (action: string, module: ModuleId | 'auth', details: string) => {
        // Allow logging even if no user (for login attempts)
        const userId = currentUser ? currentUser.id : 'system';
        const userName = currentUser ? currentUser.username : 'System/Guest';

        const newLog: AuditLog = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            userName,
            action,
            module,
            details,
            timestamp: new Date()
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const login = (username: string, pass: string) => {
        const user = users.find(u => u.username === username);

        if (!user) {
            logAction('Login Failed', 'auth', `Unknown user: ${username}`);
            return false;
        }

        if (user.status !== 'active') {
            logAction('Login Blocked', 'auth', `Inactive account attempt: ${username}`);
            return false;
        }

        // Simple string comparison for mock. In real app, use bcrypt.compare
        // If the user was just created via UI without explicit password, fallback to 'password' or skip check logic if desired? 
        // For this demo, let's assume all created users get a default if we didn't set one, or stricter check.
        const validPass = user.password === pass;

        if (validPass) {
            setCurrentUser(user);
            logAction('Login Success', 'auth', `User ${username} logged in`);
            return true;
        } else {
            // In a real app we would increment failedLoginAttempts here
            logAction('Login Failed', 'auth', `Invalid password for: ${username}`);
            return false;
        }
    };

    const logout = () => {
        logAction('Logout', 'auth', 'User logged out');
        setCurrentUser(null);
    };

    const hasPermission = (module: ModuleId, action: PermissionAction): boolean => {
        if (!currentUser) return false;
        const role = roles.find(r => r.id === currentUser.roleId);
        if (!role) return false;

        // System admin has clear override? Alternatively just check permissions
        // Permissions might be undefined for some modules in the mock
        const modulePerms = role.permissions[module];
        if (!modulePerms) return false;

        return modulePerms.includes(action);
    };

    // --- CRUD Wrappers ---

    const addUser = (data: Omit<User, 'id'>) => {
        const newUser = { ...data, id: Math.random().toString(36).substr(2, 9) };
        setUsers([...users, newUser]);
        toast.success('User created successfully');
        logAction('Create', 'settings', `Created user ${data.username}`);
    };

    const updateUser = (id: string, data: Partial<User>) => {
        setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
        toast.success('User updated successfully');
        logAction('Edit', 'settings', `Updated user ${id}`);
    };

    const deleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted successfully');
        logAction('Delete', 'settings', `Deleted user ${id}`);
    };

    const addRole = (data: Omit<Role, 'id'>) => {
        const newRole = { ...data, id: Math.random().toString(36).substr(2, 9) };
        setRoles([...roles, newRole]);
        toast.success('Role created successfully');
        logAction('Create', 'settings', `Created role ${data.name}`);
    };

    const updateRole = (id: string, data: Partial<Role>) => {
        setRoles(roles.map(r => r.id === id ? { ...r, ...data } : r));
        toast.success('Role updated successfully');
        logAction('Edit', 'settings', `Updated role ${id}`);
    };

    const deleteRole = (id: string) => {
        setRoles(roles.filter(r => r.id !== id));
        toast.success('Role deleted successfully');
        logAction('Delete', 'settings', `Deleted role ${id}`);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            users,
            roles,
            logs,
            login,
            logout,
            hasPermission,
            addUser,
            updateUser,
            deleteUser,
            addRole,
            updateRole,
            deleteRole,
            logAction
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
