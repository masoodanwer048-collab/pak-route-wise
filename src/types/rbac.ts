export interface AppUser {
    id: string;
    email: string;
    fullName: string;
    role: string;
}

export interface PermissionSet {
    allowedModules: string[];
    allowedSteps: WorkflowStepPermission[];
}

export interface WorkflowStepPermission {
    step_key: string;
    can_view: boolean;
    can_edit: boolean;
    can_complete: boolean;
}

export interface AuthResponse {
    success: boolean;
    user?: AppUser;
    allowedModules?: string[];
    allowedSteps?: WorkflowStepPermission[];
    message?: string;
}
