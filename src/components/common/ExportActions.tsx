import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { format } from 'date-fns';

interface ExportActionsProps {
    data: any[]; // The data to export
    fileName?: string; // Base filename for the export
    columnMapping?: Record<string, string>; // Map data keys to human readable headers { "gdNumber": "GD Number" }
    excludeColumns?: string[]; // Keys to exclude
    onPrint?: () => void; // Override default print behavior
}

export const ExportActions: React.FC<ExportActionsProps> = ({
    data,
    fileName = "export",
    columnMapping,
    excludeColumns = [],
    onPrint
}) => {
    const handleExportExcel = () => {
        if (!data || data.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Process data for export
        const processedData = data.map(item => {
            const newItem: any = {};
            Object.keys(item).forEach(key => {
                if (excludeColumns.includes(key)) return;

                // Use mapping if available, otherwise capitalize key
                const header = columnMapping?.[key] || key.charAt(0).toUpperCase() + key.slice(1);

                // Handle primitive values mostly, maybe flatten objects if needed but for now simple
                let value = item[key];

                // Simple object flattening for 1 level nested objects commonly found (like importer.name)
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // If it has a 'name' property, use that (common pattern)
                    if ('name' in value) value = value.name;
                    else if ('label' in value) value = value.label;
                    // else value = JSON.stringify(value); // Avoid raw JSON in excel if possible
                }

                newItem[header] = value;
            });
            return newItem;
        });

        const worksheet = XLSX.utils.json_to_sheet(processedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Auto-width (basic)
        if (processedData.length > 0) {
            const keys = Object.keys(processedData[0]);
            const wscols = keys.map(k => ({ wch: Math.max(k.length + 5, 20) }));
            worksheet["!cols"] = wscols;
        }

        XLSX.writeFile(workbook, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        toast.success("Excel export generated");
    };

    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    return (
        <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint}>
                <FileText className="h-4 w-4 mr-2 text-red-600" />
                PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                Excel
            </Button>
        </div>
    );
};

export default ExportActions;
