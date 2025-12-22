import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, FileSpreadsheet, FileJson, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { InspectionCase } from '@/types/examination';
import { generatePDF, generateExcel, generateCSV, generateJSON } from '@/lib/reportGenerator';

interface ExportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inspectionCase: InspectionCase;
}

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export function ExportModal({ open, onOpenChange, inspectionCase }: ExportModalProps) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
    const [options, setOptions] = useState({
        includeLogo: true,
        includeEvidence: true,
        includeFindings: true,
        includeProgress: true,
    });
    const [isExporting, setIsExporting] = useState(false);

    const formats = [
        { id: 'pdf', label: 'PDF Report', icon: FileText, description: 'Professional formatted report' },
        { id: 'excel', label: 'Excel Spreadsheet', icon: FileSpreadsheet, description: '.xlsx format' },
        { id: 'csv', label: 'CSV File', icon: FileSpreadsheet, description: 'Comma-separated values' },
        { id: 'json', label: 'JSON Data', icon: FileJson, description: 'Raw data format' },
    ];

    const handleExport = async () => {
        setIsExporting(true);

        try {
            switch (selectedFormat) {
                case 'pdf':
                    await generatePDF(inspectionCase, options);
                    toast.success('PDF report generated successfully');
                    break;
                case 'excel':
                    await generateExcel(inspectionCase, options);
                    toast.success('Excel file generated successfully');
                    break;
                case 'csv':
                    await generateCSV(inspectionCase, options);
                    toast.success('CSV file generated successfully');
                    break;
                case 'json':
                    await generateJSON(inspectionCase, options);
                    toast.success('JSON file generated successfully');
                    break;
            }

            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to generate export');
            console.error('Export error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Export Inspection Report</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Case: {inspectionCase.case_number} | {inspectionCase.container_number}
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Format Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Export Format</Label>
                        <div className="grid gap-3">
                            {formats.map((format) => {
                                const Icon = format.icon;
                                return (
                                    <button
                                        key={format.id}
                                        type="button"
                                        onClick={() => setSelectedFormat(format.id as ExportFormat)}
                                        className={`
                      flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-all
                      ${selectedFormat === format.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                            }
                    `}
                                    >
                                        <div className={`
                      p-2 rounded-lg
                      ${selectedFormat === format.id ? 'bg-primary/10' : 'bg-muted'}
                    `}>
                                            <Icon className={`h-5 w-5 ${selectedFormat === format.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{format.label}</p>
                                            <p className="text-sm text-muted-foreground">{format.description}</p>
                                        </div>
                                        {selectedFormat === format.id && (
                                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Export Options (only for PDF and Excel) */}
                    {(selectedFormat === 'pdf' || selectedFormat === 'excel') && (
                        <div className="space-y-3">
                            <Label className="text-base font-medium">Include in Export</Label>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="logo"
                                        checked={options.includeLogo}
                                        onCheckedChange={(checked) =>
                                            setOptions({ ...options, includeLogo: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="logo" className="cursor-pointer">
                                        Company logo and header
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="evidence"
                                        checked={options.includeEvidence}
                                        onCheckedChange={(checked) =>
                                            setOptions({ ...options, includeEvidence: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="evidence" className="cursor-pointer">
                                        Evidence file list ({inspectionCase.evidence_count} files)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="findings"
                                        checked={options.includeFindings}
                                        onCheckedChange={(checked) =>
                                            setOptions({ ...options, includeFindings: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="findings" className="cursor-pointer">
                                        Inspection findings and notes
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="progress"
                                        checked={options.includeProgress}
                                        onCheckedChange={(checked) =>
                                            setOptions({ ...options, includeProgress: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="progress" className="cursor-pointer">
                                        Progress tracker and status history
                                    </Label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={isExporting}>
                        {isExporting ? (
                            <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4 mr-2" />
                                Export {selectedFormat.toUpperCase()}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
