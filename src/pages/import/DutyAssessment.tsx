import { useState } from 'react';
import ExportActions from '@/components/common/ExportActions';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    Filter,
    Eye,
    Copy,
    Calculator,
    Gavel,
    DollarSign,
    FileCheck,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImports, ImportShipment } from '@/hooks/useImports';
import { ImportViewDialog } from '@/components/import/ImportViewDialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0,
    }).format(value);
};

export default function DutyAssessment() {
    const isMobile = useIsMobile();
    const {
        imports,
        searchQuery,
        setSearchQuery,
        updateStatus,
        updateImport
    } = useImports();

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [assessDialogOpen, setAssessDialogOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState<ImportShipment | null>(null);

    // Assessment Form State
    const [assessValues, setAssessValues] = useState({
        exchangeRate: 278.50,
        customsDutyRate: 15,
        salesTaxRate: 18,
        regulatoryDutyRate: 0,
        additionalCustomsDutyRate: 0,
        withholdingTaxRate: 5.5,
    });

    // Filter to show only duty-related shipments
    const dutyImports = imports.filter(imp =>
        ['gd_filed', 'assessed'].includes(imp.status)
    );

    const handleView = (imp: ImportShipment, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedImport(imp);
        setViewDialogOpen(true);
    };

    const handleAssess = (imp: ImportShipment) => {
        setSelectedImport(imp);
        setAssessValues({
            exchangeRate: imp.exchangeRate || 278.50,
            customsDutyRate: 15, // Default mock rates
            salesTaxRate: 18,
            regulatoryDutyRate: 0,
            additionalCustomsDutyRate: 0,
            withholdingTaxRate: 5.5,
        });
        setAssessDialogOpen(true);
    };

    const calculateDuty = (imp: ImportShipment) => {
        const valuePKR = imp.invoiceValue * assessValues.exchangeRate;
        const cd = valuePKR * (assessValues.customsDutyRate / 100);
        const acd = valuePKR * (assessValues.additionalCustomsDutyRate / 100);
        const rd = valuePKR * (assessValues.regulatoryDutyRate / 100);
        const stBase = valuePKR + cd + acd + rd;
        const st = stBase * (assessValues.salesTaxRate / 100);
        const whtBase = valuePKR + cd + acd + rd + st;
        const wht = whtBase * (assessValues.withholdingTaxRate / 100);

        return {
            valuePKR,
            cd,
            acd,
            rd,
            st,
            wht,
            total: cd + acd + rd + st + wht
        };
    };

    const submitAssessment = () => {
        if (!selectedImport) return;

        // In a real app, we would save these specific calculated values
        // For now, we update the status and trigger a mock update via the hook
        updateStatus(selectedImport.id, 'assessed');
        setAssessDialogOpen(false);
        toast.success(`Duty assessed for ${selectedImport.gdNumber}`);
    };

    const handleCopyRef = (ref: string) => {
        navigator.clipboard.writeText(ref);
        toast.success('Reference copied to clipboard');
    };

    const pendingAssessmentCount = dutyImports.filter(i => i.status === 'gd_filed').length;
    const assessedCount = dutyImports.filter(i => i.status === 'assessed').length;

    return (
        <MainLayout
            title="Duty Assessment"
            subtitle="Calculate and finalize customs duties and taxes"
        >
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search GD, BL, Importer..."
                                className="pl-9 w-full sm:w-72"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <ExportActions
                        data={dutyImports}
                        fileName="duty_assessment_report"
                        columnMapping={{
                            gdNumber: "GD Number",
                            blNumber: "BL No",
                            importerName: "Importer",
                            hsCode: "HS Code",
                            status: "Status",
                            totalDutyTax: "Assessed Duty"
                        }}
                    />
                </div>

                {/* Stats */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    <div className="stat-card border border-border">
                        <div className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-warning" />
                            <p className="text-sm text-muted-foreground">Pending Assessment</p>
                        </div>
                        <p className="text-3xl font-bold mt-2 text-warning">{pendingAssessmentCount}</p>
                    </div>
                    <div className="stat-card border border-border">
                        <div className="flex items-center gap-2">
                            <Gavel className="h-5 w-5 text-primary" />
                            <p className="text-sm text-muted-foreground">Assessed</p>
                        </div>
                        <p className="text-3xl font-bold mt-2 text-primary">{assessedCount}</p>
                    </div>
                </div>

                {/* List View */}
                {isMobile ? (
                    <div className="space-y-4">
                        {dutyImports.map((imp) => (
                            <div
                                key={imp.id}
                                className="rounded-xl border border-border bg-card p-4 space-y-3"
                                onClick={() => handleView(imp)}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-mono font-medium">{imp.gdNumber}</p>
                                        <p className="text-xs text-muted-foreground">{imp.status === 'gd_filed' ? 'Filed on:' : 'Assessed on:'} {format(new Date(imp.gdDate || imp.createdAt), 'dd MMM yyyy')}</p>
                                    </div>
                                    <Badge className={cn(
                                        imp.status === 'gd_filed' && 'bg-warning/10 text-warning',
                                        imp.status === 'assessed' && 'bg-primary/10 text-primary',
                                    )}>
                                        {imp.status === 'gd_filed' ? 'Pending Assessment' : 'Assessed'}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm font-medium">{imp.importerName}</p>
                                    <p className="text-xs text-muted-foreground">{imp.goodsDescription}</p>
                                </div>

                                <div className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded">
                                    <span className="text-muted-foreground">HS Code:</span>
                                    <span className="font-mono">{imp.hsCode}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Declared Value:</span>
                                    <span className="font-mono font-medium">${imp.invoiceValue.toLocaleString()}</span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {imp.status === 'gd_filed' && (
                                        <Button
                                            variant="accent"
                                            size="sm"
                                            className="flex-1"
                                            onClick={(e) => { e.stopPropagation(); handleAssess(imp); }}
                                        >
                                            <Calculator className="h-4 w-4 mr-1" />
                                            Assess Duty
                                        </Button>
                                    )}
                                    {imp.status === 'assessed' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={(e) => handleView(imp, e)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View Details
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleCopyRef(imp.gdNumber || ''); }}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>GD Number</th>
                                        <th>Importer</th>
                                        <th>HS Code</th>
                                        <th>Goods Desc</th>
                                        <th>Inv. Value (USD)</th>
                                        <th>Exchange Rate</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dutyImports.map((imp) => (
                                        <tr key={imp.id}>
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-medium">{imp.gdNumber}</span>
                                                    <span className="text-xs text-muted-foreground">{format(new Date(imp.gdDate || imp.createdAt), 'dd MMM')}</span>
                                                </div>
                                            </td>
                                            <td className="text-sm text-ellipsis overflow-hidden max-w-[150px] whitespace-nowrap">{imp.importerName}</td>
                                            <td className="font-mono text-sm">{imp.hsCode}</td>
                                            <td className="text-sm text-ellipsis overflow-hidden max-w-[200px] whitespace-nowrap">{imp.goodsDescription}</td>
                                            <td className="font-mono text-right">${imp.invoiceValue.toLocaleString()}</td>
                                            <td className="font-mono text-right">{imp.exchangeRate.toFixed(2)}</td>
                                            <td>
                                                <Badge className={cn(
                                                    imp.status === 'gd_filed' && 'bg-warning/10 text-warning',
                                                    imp.status === 'assessed' && 'bg-primary/10 text-primary',
                                                )}>
                                                    {imp.status === 'gd_filed' ? 'Pending' : 'Assessed'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-end gap-2">
                                                    {imp.status === 'gd_filed' && (
                                                        <Button
                                                            variant="accent"
                                                            size="sm"
                                                            onClick={() => handleAssess(imp)}
                                                        >
                                                            Assess
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleView(imp, e)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {dutyImports.length === 0 && (
                    <div className="text-center py-12">
                        <Gavel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">No shipments for assessment</h3>
                        <p className="text-sm text-muted-foreground">
                            All filed declarations have been assessed or none are pending.
                        </p>
                    </div>
                )}
            </div>

            {/* Assessment Dialog */}
            <Dialog open={assessDialogOpen} onOpenChange={setAssessDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Duty Assessment Calculation</DialogTitle>
                        <DialogDescription>Review and modify rates for {selectedImport?.gdNumber}</DialogDescription>
                    </DialogHeader>

                    {selectedImport && (() => {
                        const calcs = calculateDuty(selectedImport);
                        return (
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Declaration Info</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm space-y-2">
                                            <div className="flex justify-between"><span>Value (USD):</span> <span className="font-mono font-bold">${selectedImport.invoiceValue.toLocaleString()}</span></div>
                                            <div className="flex justify-between items-center">
                                                <span>Ex. Rate:</span>
                                                <Input
                                                    type="number"
                                                    className="w-20 h-7 text-right"
                                                    value={assessValues.exchangeRate}
                                                    onChange={e => setAssessValues({ ...assessValues, exchangeRate: parseFloat(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div className="border-t pt-2 flex justify-between"><span>Value (PKR):</span> <span className="font-mono">{formatCurrency(calcs.valuePKR)}</span></div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Applicable Rates (%)</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span>Customs Duty:</span>
                                                <Input type="number" className="w-16 h-7 text-right" value={assessValues.customsDutyRate} onChange={e => setAssessValues({ ...assessValues, customsDutyRate: parseFloat(e.target.value) || 0 })} />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Sales Tax:</span>
                                                <Input type="number" className="w-16 h-7 text-right" value={assessValues.salesTaxRate} onChange={e => setAssessValues({ ...assessValues, salesTaxRate: parseFloat(e.target.value) || 0 })} />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Reg. Duty:</span>
                                                <Input type="number" className="w-16 h-7 text-right" value={assessValues.regulatoryDutyRate} onChange={e => setAssessValues({ ...assessValues, regulatoryDutyRate: parseFloat(e.target.value) || 0 })} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="bg-muted/20">
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Customs Duty Amount:</span>
                                            <span className="font-mono">{formatCurrency(calcs.cd)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Regulatory Duty:</span>
                                            <span className="font-mono">{formatCurrency(calcs.rd)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Sales Tax:</span>
                                            <span className="font-mono">{formatCurrency(calcs.st)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Withholding Tax:</span>
                                            <span className="font-mono">{formatCurrency(calcs.wht)}</span>
                                        </div>
                                        <div className="border-t border-dashed border-gray-400 pt-2 mt-2 flex justify-between font-bold text-lg">
                                            <span>Total Payable:</span>
                                            <span className="text-primary">{formatCurrency(calcs.total)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })()}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssessDialogOpen(false)}>Cancel</Button>
                        <Button onClick={submitAssessment} className="bg-primary hover:bg-primary/90">
                            <FileCheck className="mr-2 h-4 w-4" /> Confirm & Finalize
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ImportViewDialog
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                importData={selectedImport}
                onUpdateStatus={updateStatus}
            />
        </MainLayout>
    );
}
