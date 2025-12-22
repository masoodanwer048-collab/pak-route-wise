import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateExaminationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateExaminationDialog({ open, onOpenChange }: CreateExaminationDialogProps) {
    const [formData, setFormData] = useState({
        gd_number: '',
        exam_type: 'full',
        exam_reason: '',
        priority: 'normal',
        terminal_location: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: API call to create examination
        toast.success(`Examination created for GD ${formData.gd_number}`);

        // Reset and close
        setFormData({
            gd_number: '',
            exam_type: 'full',
            exam_reason: '',
            priority: 'normal',
            terminal_location: '',
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Inspection</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* GD Number */}
                        <div className="space-y-2">
                            <Label htmlFor="gd_number">GD Number *</Label>
                            <Input
                                id="gd_number"
                                placeholder="GD-123456"
                                value={formData.gd_number}
                                onChange={(e) => setFormData({ ...formData, gd_number: e.target.value })}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                The Goods Declaration number to inspect
                            </p>
                        </div>

                        {/* Exam Type */}
                        <div className="space-y-2">
                            <Label htmlFor="exam_type">Examination Type *</Label>
                            <Select
                                value={formData.exam_type}
                                onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                            >
                                <SelectTrigger id="exam_type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full">Full Physical Inspection</SelectItem>
                                    <SelectItem value="partial">Partial Inspection</SelectItem>
                                    <SelectItem value="document">Document Review</SelectItem>
                                    <SelectItem value="scan">X-Ray Scan</SelectItem>
                                    <SelectItem value="sampling">Sampling Only</SelectItem>
                                    <SelectItem value="seal_check">Seal Verification</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority *</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Terminal Location */}
                        <div className="space-y-2">
                            <Label htmlFor="terminal_location">Terminal Location</Label>
                            <Select
                                value={formData.terminal_location}
                                onValueChange={(value) => setFormData({ ...formData, terminal_location: value })}
                            >
                                <SelectTrigger id="terminal_location">
                                    <SelectValue placeholder="Select terminal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KICT">KICT - Karachi International Container Terminal</SelectItem>
                                    <SelectItem value="PICT">PICT - Pakistan International Container Terminal</SelectItem>
                                    <SelectItem value="QICT">QICT - Qasim International Container Terminal</SelectItem>
                                    <SelectItem value="SAPT">SAPT - South Asia Pakistan Terminal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Exam Reason */}
                        <div className="space-y-2">
                            <Label htmlFor="exam_reason">Reason for Examination *</Label>
                            <Textarea
                                id="exam_reason"
                                placeholder="e.g., Random Selection, Risk Assessment, HS Verification, Valuation Check..."
                                value={formData.exam_reason}
                                onChange={(e) => setFormData({ ...formData, exam_reason: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="accent">
                            Create Inspection
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
