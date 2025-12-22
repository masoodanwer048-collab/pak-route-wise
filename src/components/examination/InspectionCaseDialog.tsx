import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    User,
    MapPin,
    FileText,
    Upload,
    Eye,
    Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { InspectionCase } from '@/types/examination';
import { mockEvidenceItems, mockChecklistItems } from '@/data/mockExaminations';

interface InspectionCaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inspectionCase: InspectionCase | null;
}

const statusConfig = {
    requested: { color: 'bg-muted text-muted-foreground', icon: FileText, label: 'Requested' },
    approved: { color: 'bg-info/10 text-info', icon: CheckCircle, label: 'Approved' },
    scheduled: { color: 'bg-warning/10 text-warning', icon: Calendar, label: 'Scheduled' },
    in_progress: { color: 'bg-primary/10 text-primary', icon: Clock, label: 'In Progress' },
    findings_submitted: { color: 'bg-accent/10 text-accent', icon: FileText, label: 'Findings Submitted' },
    cleared: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Cleared' },
    held: { color: 'bg-destructive/10 text-destructive', icon: AlertCircle, label: 'Held' },
    re_exam_requested: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Re-Exam' },
    closed: { color: 'bg-muted text-muted-foreground', icon: CheckCircle, label: 'Closed' },
};

export function InspectionCaseDialog({
    open,
    onOpenChange,
    inspectionCase,
}: InspectionCaseDialogProps) {
    if (!inspectionCase) return null;

    const status = statusConfig[inspectionCase.status as keyof typeof statusConfig];
    const StatusIcon = status.icon;

    // Filter evidence and checklist for this case
    const caseEvidence = mockEvidenceItems.filter((e) => e.case_id === inspectionCase.case_id);
    const caseChecklist = mockChecklistItems.filter((c) => c.case_id === inspectionCase.case_id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-mono">{inspectionCase.case_number}</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                GD: {inspectionCase.gd_number} | Container: {inspectionCase.container_number}
                            </p>
                        </div>
                        <Badge className={cn('capitalize', status.color)}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {status.label}
                        </Badge>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-4">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="checklist">Checklist</TabsTrigger>
                        <TabsTrigger value="evidence">Evidence ({caseEvidence.length})</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 border rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Importer</p>
                                <p className="font-medium">{inspectionCase.importer_name}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    <User className="h-3 w-3" />
                                    Assigned To
                                </div>
                                <p className="font-medium">{inspectionCase.assigned_inspector || 'Not Assigned'}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    <MapPin className="h-3 w-3" />
                                    Location
                                </div>
                                <p className="font-medium">
                                    {inspectionCase.terminal_location || 'TBD'}
                                    {inspectionCase.inspection_bay && `, ${inspectionCase.inspection_bay}`}
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    <Calendar className="h-3 w-3" />
                                    Scheduled
                                </div>
                                {inspectionCase.scheduled_date ? (
                                    <p className="font-medium text-sm">
                                        {format(new Date(inspectionCase.scheduled_date), 'dd MMM yyyy')}
                                        {inspectionCase.scheduled_time && (
                                            <span className="text-muted-foreground ml-1">{inspectionCase.scheduled_time}</span>
                                        )}
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground">Not scheduled</p>
                                )}
                            </div>
                        </div>

                        {/* Progress */}
                        {inspectionCase.status === 'in_progress' && (
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium">Inspection Progress</p>
                                    <span className="text-sm text-muted-foreground">{inspectionCase.progress_pct}%</span>
                                </div>
                                <Progress value={inspectionCase.progress_pct} className="mb-2" />
                                <p className="text-sm text-muted-foreground">Current Task: {inspectionCase.current_task}</p>
                            </div>
                        )}

                        {/* Findings */}
                        {inspectionCase.findings_summary && (
                            <div className="p-4 border rounded-lg">
                                <p className="font-medium mb-2">Findings Summary</p>
                                <p className="text-sm">{inspectionCase.findings_summary}</p>
                            </div>
                        )}

                        {/* Hold Reason */}
                        {inspectionCase.status === 'held' && inspectionCase.hold_reason && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="font-medium text-destructive mb-2">Hold Reason</p>
                                <p className="text-sm text-destructive">{inspectionCase.hold_reason}</p>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Created</p>
                                <p className="text-sm font-medium">
                                    {format(new Date(inspectionCase.created_at), 'dd MMM yyyy, HH:mm')}
                                </p>
                                <p className="text-xs text-muted-foreground">by {inspectionCase.created_by}</p>
                            </div>
                            {inspectionCase.started_at && (
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Started</p>
                                    <p className="text-sm font-medium">
                                        {format(new Date(inspectionCase.started_at), 'dd MMM yyyy, HH:mm')}
                                    </p>
                                    {inspectionCase.elapsed_time_mins && (
                                        <p className="text-xs text-muted-foreground">Duration: {inspectionCase.elapsed_time_mins} mins</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Checklist Tab */}
                    <TabsContent value="checklist" className="space-y-3">
                        {caseChecklist.length > 0 ? (
                            caseChecklist.map((item) => (
                                <div
                                    key={item.item_id}
                                    className={cn(
                                        'p-4 border rounded-lg',
                                        item.status === 'complete' && 'bg-success/5 border-success/20',
                                        item.status === 'in_progress' && 'bg-primary/5 border-primary/20'
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">#{item.sequence}</span>
                                                <h4 className="font-medium">{item.task_name}</h4>
                                                {item.status === 'complete' && <CheckCircle className="h-4 w-4 text-success" />}
                                                {item.status === 'in_progress' && <Clock className="h-4 w-4 text-primary animate-pulse" />}
                                            </div>
                                            {item.result_value && (
                                                <p className="text-sm text-muted-foreground mt-1">Result: {item.result_value}</p>
                                            )}
                                            {item.notes && <p className="text-sm mt-1">{item.notes}</p>}
                                        </div>
                                        <Badge
                                            variant={item.status === 'complete' ? 'default' : 'secondary'}
                                            className="capitalize"
                                        >
                                            {item.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No checklist items yet</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Evidence Tab */}
                    <TabsContent value="evidence" className="space-y-4">
                        {caseEvidence.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {caseEvidence.map((evidence) => (
                                    <div key={evidence.evidence_id} className="border rounded-lg overflow-hidden">
                                        <div className="aspect-video bg-muted flex items-center justify-center">
                                            <FileText className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                        <div className="p-3">
                                            <p className="font-medium text-sm truncate">{evidence.file_name}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {evidence.category}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">{evidence.file_size_mb} MB</span>
                                            </div>
                                            {evidence.caption && (
                                                <p className="text-xs text-muted-foreground mt-2">{evidence.caption}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {format(new Date(evidence.uploaded_at), 'dd MMM, HH:mm')} by {evidence.uploaded_by}
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm" variant="outline" className="flex-1">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                                <Button size="sm" variant="outline" className="flex-1">
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No evidence uploaded yet</p>
                                <Button className="mt-4" variant="outline">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Evidence
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    {/* Timeline Tab */}
                    <TabsContent value="timeline" className="space-y-3">
                        <div className="space-y-4">
                            {inspectionCase.completed_at && (
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full p-2 bg-success/10">
                                            <CheckCircle className="h-4 w-4 text-success" />
                                        </div>
                                        <div className="h-full w-px bg-border mt-2" />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="font-medium">Inspection Completed</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(inspectionCase.completed_at), 'dd MMM yyyy, HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {inspectionCase.started_at && (
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full p-2 bg-primary/10">
                                            <Clock className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="h-full w-px bg-border mt-2" />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="font-medium">Inspection Started</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(inspectionCase.started_at), 'dd MMM yyyy, HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="rounded-full p-2 bg-info/10">
                                        <FileText className="h-4 w-4 text-info" />
                                    </div>
                                </div>
                                <div className="flex-1 pb-4">
                                    <p className="font-medium">Case Created</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(inspectionCase.created_at), 'dd MMM yyyy, HH:mm')} by{' '}
                                        {inspectionCase.created_by}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Actions Tab */}
                    <TabsContent value="actions" className="space-y-3">
                        <div className="grid gap-3">
                            <Button className="justify-start" variant="outline">
                                <FileText className="h-4 w-4 mr-2" />
                                Generate Inspection Report (PDF)
                            </Button>
                            <Button className="justify-start" variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Additional Evidence
                            </Button>
                            {inspectionCase.status === 'in_progress' && (
                                <>
                                    <Button className="justify-start" variant="default">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Submit Findings & Clear
                                    </Button>
                                    <Button className="justify-start" variant="destructive">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Hold Shipment
                                    </Button>
                                </>
                            )}
                            {inspectionCase.status === 'held' && (
                                <Button className="justify-start" variant="default">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Release from Hold
                                </Button>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
