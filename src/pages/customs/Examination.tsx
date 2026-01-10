import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    Filter,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Calendar,
    MapPin,
    User,
    Eye,
    Upload,
    MoreVertical,
    Download,
    FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockInspectionCases } from '@/data/mockExaminations';
import type { InspectionCase, InspectionStatus, Priority } from '@/types/examination';
import { InspectionCaseDialog } from '@/components/examination/InspectionCaseDialog';
import { CreateExaminationDialog } from '@/components/examination/CreateExaminationDialog';
import { AddEvidenceDialog } from '@/components/examination/AddEvidenceDialog';

const statusConfig = {
    requested: { color: 'bg-muted text-muted-foreground', icon: FileText, label: 'Requested' },
    approved: { color: 'bg-info/10 text-info', icon: CheckCircle, label: 'Approved' },
    scheduled: { color: 'bg-warning/10 text-warning', icon: Calendar, label: 'Scheduled' },
    in_progress: { color: 'bg-primary/10 text-primary', icon: Clock, label: 'In Progress' },
    findings_submitted: { color: 'bg-accent/10 text-accent', icon: FileText, label: 'Findings Submitted' },
    cleared: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Cleared' },
    held: { color: 'bg-destructive/10 text-destructive', icon: AlertCircle, label: 'Held' },
    re_exam_requested: { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Re-Exam' },
    closed: { color: 'bg-muted text-muted-foreground', icon: XCircle, label: 'Closed' },
};

const priorityConfig = {
    normal: 'bg-muted text-muted-foreground',
    urgent: 'bg-warning/10 text-warning',
    critical: 'bg-destructive/10 text-destructive',
};

export default function Examination() {
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [selectedCase, setSelectedCase] = useState<InspectionCase | null>(null);
    const [caseDialogOpen, setCaseDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);

    // Filter cases
    const filteredCases = mockInspectionCases.filter((inspectionCase) => {
        const matchesSearch =
            inspectionCase.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inspectionCase.gd_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inspectionCase.container_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inspectionCase.importer_name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || inspectionCase.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || inspectionCase.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Calculate stats
    const stats = {
        urgent: mockInspectionCases.filter((c) => c.priority === 'urgent' && ['scheduled', 'in_progress'].includes(c.status)).length,
        today: mockInspectionCases.filter((c) => c.scheduled_date === format(new Date(), 'yyyy-MM-dd')).length,
        scheduled: mockInspectionCases.filter((c) => c.status === 'scheduled').length,
        in_progress: mockInspectionCases.filter((c) => c.status === 'in_progress').length,
        held: mockInspectionCases.filter((c) => c.status === 'held').length,
        cleared: mockInspectionCases.filter((c) => c.status === 'cleared').length,
    };

    const handleViewCase = (inspectionCase: InspectionCase) => {
        setSelectedCase(inspectionCase);
        setCaseDialogOpen(true);
    };

    const handleUpdateStatus = (inspectionCase: InspectionCase) => {
        console.log('Update status:', inspectionCase.case_number);
        // TODO: Open status update dialog
    };

    const handleAddEvidence = (inspectionCase: InspectionCase) => {
        setSelectedCase(inspectionCase);
        setEvidenceDialogOpen(true);
    };

    return (
        <MainLayout
            title="Examination"
            subtitle="Inspection workflow management for customs clearance"
        >
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search Case, GD, Container..."
                                className="pl-9 w-full sm:w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="findings_submitted">Findings Submitted</SelectItem>
                                <SelectItem value="cleared">Cleared</SelectItem>
                                <SelectItem value="held">Held</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-full sm:w-32">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.print()}>
                            <FileText className="h-4 w-4 mr-2 text-red-600" />
                            Export PDF
                        </Button>
                        <Button variant="outline" onClick={() => console.log('Export Excel')}>
                            <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                            Export Excel
                        </Button>
                        <Button variant="accent" onClick={() => setCreateDialogOpen(true)}>
                            <Search className="h-4 w-4 mr-2" />
                            New Inspection
                        </Button>
                    </div>
                </div>

                {/* Quick Filter Cards (Stats) */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <button className="stat-card border-2 border-destructive/20 hover:border-destructive/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <p className="text-sm text-muted-foreground">Urgent</p>
                        </div>
                        <p className="text-2xl font-bold mt-1 text-destructive">{stats.urgent}</p>
                    </button>
                    <button className="stat-card border-2 border-primary/20 hover:border-primary/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <p className="text-sm text-muted-foreground">Today</p>
                        </div>
                        <p className="text-2xl font-bold mt-1 text-primary">{stats.today}</p>
                    </button>
                    <button className="stat-card border border-border">
                        <p className="text-sm text-muted-foreground">Scheduled</p>
                        <p className="text-2xl font-bold mt-1 text-warning">{stats.scheduled}</p>
                    </button>
                    <button className="stat-card border border-border">
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold mt-1 text-accent">{stats.in_progress}</p>
                    </button>
                    <button className="stat-card border border-border">
                        <p className="text-sm text-muted-foreground">Held</p>
                        <p className="text-2xl font-bold mt-1 text-destructive">{stats.held}</p>
                    </button>
                    <button className="stat-card border border-border">
                        <p className="text-sm text-muted-foreground">Cleared</p>
                        <p className="text-2xl font-bold mt-1 text-success">{stats.cleared}</p>
                    </button>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredCases.length} of {mockInspectionCases.length} inspection cases
                    </p>
                </div>

                {/* Inspection Queue - Cards Layout */}
                <div className="space-y-4">
                    {filteredCases.map((inspectionCase) => {
                        const status = statusConfig[inspectionCase.status as keyof typeof statusConfig];
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={inspectionCase.case_id}
                                className="rounded-xl border-2 border-border bg-card hover:border-primary/40 transition-all duration-200"
                            >
                                {/* Header */}
                                <div className="p-4 border-b border-border bg-muted/30">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="font-mono font-bold text-lg">{inspectionCase.case_number}</h3>
                                                <Badge className={cn('capitalize', status.color)}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {status.label}
                                                </Badge>
                                                {inspectionCase.priority !== 'normal' && (
                                                    <Badge className={cn('capitalize', priorityConfig[inspectionCase.priority])}>
                                                        {inspectionCase.priority}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                GD: <span className="font-mono">{inspectionCase.gd_number}</span>{' '}
                                                | Container: <span className="font-mono">{inspectionCase.container_number}</span>
                                            </p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewCase(inspectionCase)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(inspectionCase)}>
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Update Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAddEvidence(inspectionCase)}>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Add Evidence
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Importer */}
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Importer</p>
                                            <p className="font-medium">{inspectionCase.importer_name}</p>
                                        </div>

                                        {/* Assigned To */}
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                Assigned To
                                            </p>
                                            <p className="font-medium">{inspectionCase.assigned_inspector || 'Not Assigned'}</p>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                Location
                                            </p>
                                            <p className="font-medium">
                                                {inspectionCase.terminal_location || 'TBD'}
                                                {inspectionCase.inspection_bay && `, ${inspectionCase.inspection_bay}`}
                                            </p>
                                        </div>

                                        {/* Scheduled */}
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Scheduled
                                            </p>
                                            {inspectionCase.scheduled_date ? (
                                                <p className="font-medium">
                                                    {format(new Date(inspectionCase.scheduled_date), 'dd MMM yyyy')}{' '}
                                                    {inspectionCase.scheduled_time && (
                                                        <span className="text-muted-foreground">{inspectionCase.scheduled_time}</span>
                                                    )}
                                                </p>
                                            ) : (
                                                <p className="text-muted-foreground">Not scheduled</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {inspectionCase.status === 'in_progress' && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                <span>Progress: {inspectionCase.current_task}</span>
                                                <span>{inspectionCase.progress_pct}%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-300"
                                                    style={{ width: `${inspectionCase.progress_pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Findings Summary (if available) */}
                                    {inspectionCase.findings_summary && (
                                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Findings</p>
                                            <p className="text-sm">{inspectionCase.findings_summary}</p>
                                        </div>
                                    )}

                                    {/* Hold Reason (if held) */}
                                    {inspectionCase.status === 'held' && inspectionCase.hold_reason && (
                                        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                            <p className="text-xs text-destructive mb-1 font-medium">Hold Reason</p>
                                            <p className="text-sm text-destructive">{inspectionCase.hold_reason}</p>
                                        </div>
                                    )}

                                    {/* Evidence Count */}
                                    {inspectionCase.evidence_count > 0 && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Upload className="h-4 w-4" />
                                            {inspectionCase.evidence_count} evidence file{inspectionCase.evidence_count > 1 ? 's' : ''} uploaded
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                                        <p className="text-xs text-muted-foreground">
                                            Created {format(new Date(inspectionCase.created_at), 'dd MMM, HH:mm')} by {inspectionCase.created_by}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewCase(inspectionCase)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Case
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredCases.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">No inspection cases found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Inspection cases will appear here when created from GD Filing'}
                        </p>
                    </div>
                )}
            </div>

            <InspectionCaseDialog
                open={caseDialogOpen}
                onOpenChange={setCaseDialogOpen}
                inspectionCase={selectedCase}
            />

            <CreateExaminationDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />

            <AddEvidenceDialog
                open={evidenceDialogOpen}
                onOpenChange={setEvidenceDialogOpen}
                caseNumber={selectedCase?.case_number || ''}
            />
        </MainLayout>
    );
}
