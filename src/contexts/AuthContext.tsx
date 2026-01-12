import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppUser, WorkflowStepPermission, AuthResponse } from '@/types/rbac';

interface AuthContextType {
    user: AppUser | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    hasModuleAccess: (moduleKey: string) => boolean;
    getStepPermissions: (stepKey: string) => WorkflowStepPermission | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- MOCK DATA FOR FALLBACK ---
const MOCK_ALL_MODULES = [
    'ops_workflow', 'documents', 'customs_gd', 'import', 'export', 'transshipment',
    'afghan_transit', 'local_logistics', 'maritime', 'air_cargo', 'courier',
    'warehousing', 'fleet', 'finance', 'hr', 'compliance', 'tracking', 'reports', 'settings'
];

const MOCK_MODULES_BY_ROLE: Record<string, string[]> = {
    // For Demo purposes, giving expanded access to all agents so they can see all modules
    'shipping_agent': MOCK_ALL_MODULES,
    'clearing_agent': MOCK_ALL_MODULES,
    'transport_agent': MOCK_ALL_MODULES,
    'terminal_manager': MOCK_ALL_MODULES,
    'admin': MOCK_ALL_MODULES
};

const MOCK_STEPS_CONFIG = [
    { key: 'input_invoice', stage: 1 }, { key: 'consignor_details', stage: 1 }, { key: 'vessel_details', stage: 1 }, { key: 'output_bl', stage: 1 }, { key: 'output_do', stage: 1 },
    { key: 'record_bl', stage: 2 }, { key: 'file_gd', stage: 2 }, { key: 'tax_assessment', stage: 2 }, { key: 'gd_out_charge', stage: 2 },
    { key: 'carrier_manifest', stage: 3 }, { key: 'excise_payment', stage: 3 }, { key: 'loading_arrangements', stage: 3 }, { key: 'transport_border', stage: 3 },
    { key: 'gate_pass', stage: 4 }, { key: 'final_loading', stage: 4 }, { key: 'transport_dest', stage: 4 }
];

const MOCK_USERS: Record<string, AppUser & { password: string }> = {
    'shipping@demo.com': { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', email: 'shipping@demo.com', fullName: 'Shipping Agent', role: 'shipping_agent', password: 'Demo@1234' },
    'clearing@demo.com': { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', email: 'clearing@demo.com', fullName: 'Clearing Agent', role: 'clearing_agent', password: 'Demo@1234' },
    'transport@demo.com': { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', email: 'transport@demo.com', fullName: 'Transport Admin', role: 'transport_agent', password: 'Demo@1234' },
    'terminal@demo.com': { id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', email: 'terminal@demo.com', fullName: 'Terminal Manager', role: 'terminal_manager', password: 'Demo@1234' },
    'admin@demo.com': { id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', email: 'admin@demo.com', fullName: 'System Administrator', role: 'admin', password: 'Admin@1234' }
};

const getMockAuth = (email: string, pass: string): AuthResponse => {
    const user = Object.values(MOCK_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) return { success: false, message: 'User not found (Mock)' };
    if (user.password !== pass) return { success: false, message: 'Invalid password (Mock)' };

    const role = user.role;
    const modules = MOCK_MODULES_BY_ROLE[role] || [];

    const steps: WorkflowStepPermission[] = MOCK_STEPS_CONFIG.map(step => {
        let access = { can_view: true, can_edit: false, can_complete: false };
        if (role === 'admin') {
            access = { can_view: true, can_edit: true, can_complete: true };
        } else if (role === 'shipping_agent' && step.stage === 1) {
            access = { can_view: true, can_edit: true, can_complete: true };
        } else if (role === 'clearing_agent' && step.stage === 2) {
            access = { can_view: true, can_edit: true, can_complete: true };
        } else if (role === 'transport_agent' && step.stage === 3) {
            access = { can_view: true, can_edit: true, can_complete: true };
        } else if (role === 'terminal_manager' && step.stage === 4) {
            access = { can_view: true, can_edit: true, can_complete: true };
        }
        return { step_key: step.key, ...access };
    });

    // Remove password from returned user object
    const { password, ...safeUser } = user;

    return {
        success: true,
        user: safeUser,
        allowedModules: modules,
        allowedSteps: steps
    };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [allowedModules, setAllowedModules] = useState<string[]>([]);
    const [allowedSteps, setAllowedSteps] = useState<WorkflowStepPermission[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Initial check - for demo, we might not persist session tightly, or we can rely on local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('demo_user');
        const storedModules = localStorage.getItem('demo_modules');
        const storedSteps = localStorage.getItem('demo_steps');

        if (storedUser && storedModules && storedSteps) {
            setUser(JSON.parse(storedUser));
            setAllowedModules(JSON.parse(storedModules));
            setAllowedSteps(JSON.parse(storedSteps));
        }
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        setIsLoading(true);
        console.log('Attempting login with:', { email }); // Debug Log

        // Clear any existing session data first
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_modules');
        localStorage.removeItem('demo_steps');

        let response: AuthResponse | null = null;
        let usedMock = false;

        try {
            // 1. Attempt Real Backend Login First
            // @ts-ignore
            const { data, error } = await supabase.rpc('demo_login', {
                p_email: email,
                p_password: pass
            });

            if (error) {
                console.warn('Login RPC error, attempting fallback:', error);
                throw error; // Trigger catch to try mock
            } else {
                response = data as AuthResponse;

                // If RPC succeeded but returned logical failure (e.g. User not found), try mock
                if (!response.success) {
                    console.warn('Backend rejected login (' + response.message + '), checking mock users...');
                    throw new Error(response.message); // Trigger catch to try mock
                }
            }

        } catch (err) {
            console.warn('Real login failed, checking for Demo/Mock fallback...', err);

            // 2. Fallback to Mock if Real Login fails
            if (MOCK_USERS[email.toLowerCase()]) {
                console.log('Found valid mock user, using fallback data.');
                response = getMockAuth(email, pass);
                usedMock = true;
            } else {
                // Not a mock user, and real login failed
                toast.error('Login Failed: ' + (err as any)?.message || 'Unknown error');
                setIsLoading(false);
                return false;
            }
        }

        try {
            console.log('Auth Response (Used Mock: ' + usedMock + '):', response);

            if (response && response.success && response.user) {
                const { user: appUser, allowedModules: modules, allowedSteps: steps } = response;

                // 3. Persist to LocalStorage synchronously FIRST
                try {
                    localStorage.setItem('demo_user', JSON.stringify(appUser));
                    localStorage.setItem('demo_modules', JSON.stringify(modules || []));
                    localStorage.setItem('demo_steps', JSON.stringify(steps || []));
                } catch (e) {
                    console.error("Failed to save to localStorage", e);
                }

                // 2. Update React State
                setUser(appUser);
                setAllowedModules(modules || []);
                setAllowedSteps(steps || []);

                toast.success(`Welcome back, ${appUser.fullName}` + (usedMock ? ' (Demo Mode)' : ''));
                return true;
            } else {
                const msg = response?.message || 'Login Failed';
                console.warn('Login Logic Failure:', msg);
                toast.error(msg);
                return false;
            }
        } catch (err: any) {
            console.error('Login processing error:', err);
            toast.error('An unexpected error occurred during login');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setAllowedModules([]);
        setAllowedSteps([]);
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_modules');
        localStorage.removeItem('demo_steps');
        toast.info('Logged out successfully');
    };

    const hasModuleAccess = (moduleKey: string): boolean => {
        // Admin always has access (or handle via module list)
        if (user?.role === 'admin') return true;
        return allowedModules.includes(moduleKey);
    };

    const getStepPermissions = (stepKey: string): WorkflowStepPermission | undefined => {
        if (user?.role === 'admin') {
            return { step_key: stepKey, can_view: true, can_edit: true, can_complete: true };
        }
        return allowedSteps.find(s => s.step_key === stepKey);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            hasModuleAccess,
            getStepPermissions
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
