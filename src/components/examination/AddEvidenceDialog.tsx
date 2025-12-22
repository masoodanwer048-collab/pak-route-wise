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
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AddEvidenceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    caseNumber: string;
}

export function AddEvidenceDialog({ open, onOpenChange, caseNumber }: AddEvidenceDialogProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [category, setCategory] = useState('cargo');
    const [caption, setCaption] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            toast.error('Please select at least one file');
            return;
        }

        // TODO: API call to upload evidence
        toast.success(`${selectedFiles.length} file(s) uploaded to ${caseNumber}`);

        // Reset and close
        setSelectedFiles([]);
        setCategory('cargo');
        setCaption('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Upload Evidence</DialogTitle>
                    <p className="text-sm text-muted-foreground">Case: {caseNumber}</p>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* File Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="files">Select Files *</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="files"
                                    type="file"
                                    multiple
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upload photos (JPG, PNG) or documents (PDF)
                            </p>
                        </div>

                        {/* Selected Files List */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2">
                                <Label>Selected Files ({selectedFiles.length})</Label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm truncate">{file.name}</span>
                                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 flex-shrink-0"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Evidence Category *</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="seal">Container Seal</SelectItem>
                                    <SelectItem value="cargo">Cargo/Goods</SelectItem>
                                    <SelectItem value="container">Container Condition</SelectItem>
                                    <SelectItem value="labels">Labels/Markings</SelectItem>
                                    <SelectItem value="damage">Damage</SelectItem>
                                    <SelectItem value="documents">Supporting Documents</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Caption */}
                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption/Description</Label>
                            <Textarea
                                id="caption"
                                placeholder="Describe what this evidence shows..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" disabled={selectedFiles.length === 0}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
