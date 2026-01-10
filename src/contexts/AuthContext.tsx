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
        console.log('Attempting login with:', { email, pass }); // Debug Log
        // Clear any existing session data first
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_modules');
        localStorage.removeItem('demo_steps');

        try {
            // Call Supabase RPC
            // @ts-ignore
            const { data, error } = await supabase.rpc('demo_login', {
                p_email: email,
                p_password: pass
            });

            console.log('RPC Response:', { data, error }); // Debug Log

            if (error) {
                console.error('Login RPC error:', error);
                toast.error('Login failed: Server error');
                return false;
            }

            const response = data as AuthResponse;
            console.log('Parsed Auth Response:', response); // Debug Log

            if (response.success && response.user) {
                const { user: appUser, allowedModules: modules, allowedSteps: steps } = response;

                // 1. Persist to LocalStorage synchronously FIRST
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

                toast.success(`Welcome back, ${appUser.fullName}`);
                return true;
            } else {
                console.warn('Login Logic Failure:', response.message);
                toast.error(response.message || 'Login Failed');
                return false;
            }
        } catch (err: any) {
            console.error('Login exception:', err);
            toast.error(err.message || 'An unexpected error occurred during login');
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
