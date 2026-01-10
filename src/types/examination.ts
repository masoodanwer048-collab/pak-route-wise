export type InspectionStatus =
    | 'requested'
    | 'approved'
    | 'scheduled'
    | 'in_progress'
    | 'findings_submitted'
    | 'cleared'
    | 'held'
    | 're_exam_requested'
    | 'closed';

export type ExamType =
    | 'full'
    | 'partial'
    | 'document'
    | 'scan'
    | 'sampling'
    | 'seal_check';

export type Priority = 'normal' | 'urgent' | 'critical';

export type EvidenceCategory =
    | 'seal'
    | 'cargo'
    | 'container'
    | 'labels'
    | 'damage'
    | 'documents';

export interface InspectionCase {
    case_id: string;
    case_number: string; // EXM-2025-045
    gd_id: string;
    gd_number: string;

    // Container info (readonly from GD)
    bl_number: string;
    container_number: string;
    importer_name: string;

    // Inspection details
    exam_type: ExamType;
    exam_reason: string;
    priority: Priority;
    status: InspectionStatus;

    // Assignment
    assigned_inspector?: string;
    terminal_location?: string;
    inspection_bay?: string;
    scheduled_date?: string;
    scheduled_time?: string;

    // Progress
    progress_pct: number; // 0-100
    current_task: string;

    // Timestamps
    created_at: string;
    created_by: string;
    started_at?: string;
    completed_at?: string;
    elapsed_time_mins?: number;

    // Evidence
    evidence_count: number;

    // Findings
    findings_summary?: string;
    compliance_status?: 'cleared' | 'held' | 'pending';
    hold_reason?: string;
}

export interface EvidenceItem {
    evidence_id: string;
    case_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size_mb: number;
    category: EvidenceCategory;
    caption?: string;
    uploaded_by: string;
    uploaded_at: string;
    gps_location?: { lat: number; lng: number };
}

export interface ChecklistItem {
    item_id: string;
    case_id: string;
    task_name: string;
    sequence: number;
    status: 'pending' | 'in_progress' | 'complete';
    result_value?: any;
    notes?: string;
    started_at?: string;
    completed_at?: string;
}

export interface DiscrepancyItem {
    discrepancy_id: string;
    case_id: string;
    discrepancy_type: 'shortage' | 'excess' | 'damage' | 'hs_mismatch' | 'value_concern' | 'other';
    item_description: string;
    declared_value: string;
    found_value: string;
    variance: string;
    severity: 'low' | 'medium' | 'high';
    recommended_action: string;
    remarks?: string;
}

export interface AuditLogEntry {
    log_id: string;
    case_id: string;
    action: string;
    performed_by: string;
    timestamp: string;
    details?: string;
}
