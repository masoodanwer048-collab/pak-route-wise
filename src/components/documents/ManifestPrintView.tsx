import { ShippingDocument } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { X, Printer, FileText, FileSpreadsheet, File } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ManifestPrintViewProps {
    document: ShippingDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ManifestPrintView({ document, open, onOpenChange }: ManifestPrintViewProps) {
    if (!open || !document) return null;

    // Calculate totals
    const grandTotalValue = document.manifestItems?.reduce((sum, item) => sum + item.value, 0) || 0;
    const totalQuantity = document.manifestItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalWeight = document.manifestItems?.reduce((sum, item) => sum + item.weight, 0) || 0;

    const handlePrint = () => {
        window.print();
    };

    const handleExportWord = () => {
        const content = window.document.getElementById('manifest-content')?.innerHTML;
        if (!content) return;

        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Shipping Manifest</title><style>body{font-family: Arial, sans-serif;} table{width: 100%; border-collapse: collapse;} td, th{border: 1px solid #ddd; padding: 8px;}</style></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;

        const blob = new Blob(['\ufeff', sourceHTML], {
            type: 'application/msword'
        });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `manifest-${document.documentNumber}.doc`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const data = [
            ["Shipping Manifest"],
            [""],
            ["Manifest Number", document.documentNumber],
            ["Date", document.issueDate],
            [""],
            ["Shipper Information"],
            ["Name", document.shipper],
            ["Email", document.shipperContact || ""],
            ["Address", document.shipperAddress || ""],
            ["Phone", document.shipperContact || ""],
            [""],
            ["Recipient Information"],
            ["Name", document.recipient || ""],
            ["Email", document.recipientEmail || ""],
            ["Address", document.recipientAddress || ""],
            ["Phone", document.recipientPhone || ""],
            [""],
            ["Shipping Details"],
            ["Description", "Quantity", "Weight", "Dimensions", "Value"],
            ...(document.manifestItems?.map(item => [
                item.description,
                item.quantity,
                item.weight,
                item.dimensions,
                item.value
            ]) || []),
            ["Totals", totalQuantity, totalWeight, "", grandTotalValue]
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Manifest");
        XLSX.writeFile(wb, `manifest-${document.documentNumber}.xlsx`);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm print:bg-white print:backdrop-blur-none overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 print:p-0 print:block">
                {/* Print Controls */}
                <div className="fixed top-4 right-4 flex gap-2 print:hidden z-50">
                    <Button onClick={handlePrint} variant="outline" className="gap-2 bg-white hover:bg-gray-100">
                        <File className="h-4 w-4" />
                        Export PDF
                    </Button>
                    <Button onClick={handleExportWord} variant="outline" className="gap-2 bg-white hover:bg-gray-100">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Export Word
                    </Button>
                    <Button onClick={handleExportExcel} variant="outline" className="gap-2 bg-white hover:bg-gray-100">
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        Export Excel
                    </Button>
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/20">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Manifest Layout */}
                <div id="manifest-content" className="w-[210mm] bg-white text-black font-sans p-8 shadow-lg print:shadow-none print:p-0 mx-auto border border-gray-200">

                    {/* Header */}
                    <div className="flex items-center gap-6 mb-8">
                        <img src="/kohesar_logo_print.png" alt="Kohesar Logistics" className="h-24 object-contain" />
                        <div className="flex flex-col justify-center space-y-1">
                            <p className="font-bold text-2xl uppercase tracking-wide text-gray-800">Kohesar Logistics</p>
                            <div className="text-sm text-gray-600">
                                <p>contact@kohesarlogistics.com</p>
                                <p>123 Logistics Way, Karachi, Pakistan</p>
                                <p>+92 21 1234 5678</p>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Shipping Manifest</h1>
                        <hr className="border-t-2 border-black w-24 mx-auto" />
                    </div>

                    {/* Info Sections */}
                    <div className="grid grid-cols-2 gap-12 mb-8">
                        {/* Shipper */}
                        <div>
                            <h3 className="font-bold text-lg mb-2 border-b border-gray-300 pb-1">Shipper Information</h3>
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600 w-1/3">Name</td><td className="py-2 font-semibold">{document.shipper}</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600">Email</td><td className="py-2">{document.shipperContact || "N/A"}</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600">Address</td><td className="py-2">{document.shipperAddress || "N/A"}</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600">Phone</td><td className="py-2">{document.shipperContact || "N/A"}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Recipient */}
                        <div>
                            <h3 className="font-bold text-lg mb-2 border-b border-gray-300 pb-1">Recipient Information</h3>
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600 w-1/3">Name</td><td className="py-2 font-semibold">{document.recipient || 'N/A'}</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600">Email</td><td className="py-2">{document.recipientEmail || 'N/A'}</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600">Address</td><td className="py-2">{document.recipientAddress || 'N/A'}</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 font-medium text-gray-600">Phone</td><td className="py-2">{document.recipientPhone || 'N/A'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4 border-b border-gray-300 pb-1">Shipping Details</h3>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="border border-gray-200 p-2 font-bold">Item Description</th>
                                    <th className="border border-gray-200 p-2 font-bold w-24 text-center">Quantity</th>
                                    <th className="border border-gray-200 p-2 font-bold w-24 text-center">Weight</th>
                                    <th className="border border-gray-200 p-2 font-bold w-32 text-center">Dimensions</th>
                                    <th className="border border-gray-200 p-2 font-bold w-32 text-right">Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {document.manifestItems?.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="border border-gray-200 p-2">{item.description}</td>
                                        <td className="border border-gray-200 p-2 text-center">{item.quantity}</td>
                                        <td className="border border-gray-200 p-2 text-center">{item.weight} kg</td>
                                        <td className="border border-gray-200 p-2 text-center">{item.dimensions}</td>
                                        <td className="border border-gray-200 p-2 text-right">${item.value.toLocaleString()}</td>
                                    </tr>
                                )) || (
                                        <tr><td colSpan={5} className="p-4 text-center text-gray-500 italic">No specific items listed</td></tr>
                                    )}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50 font-bold">
                                    <td className="border border-gray-200 p-2 text-right">Totals</td>
                                    <td className="border border-gray-200 p-2 text-center">{totalQuantity}</td>
                                    <td className="border border-gray-200 p-2 text-center">{totalWeight} kg</td>
                                    <td className="border border-gray-200 p-2"></td>
                                    <td className="border border-gray-200 p-2 text-right">${grandTotalValue.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer / Meta */}
                    <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
                        <p>Generated on {new Date().toLocaleDateString()}</p>
                        <p>Manifest #: {document.documentNumber}</p>
                    </div>

                </div>
                {/* Print Styles */}
                <style>{`
                  @media print {
                    @page { size: A4 portrait; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body * { visibility: hidden; }
                    .print\\:block, .print\\:block * { visibility: visible; }
                    .print\\:hidden { display: none !important; }
                    .print\\:shadow-none { box-shadow: none; border: none !important; }
                  }
                `}</style>
            </div>
        </div>
    );
}
