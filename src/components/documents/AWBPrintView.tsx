import { ShippingDocument } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { X, Printer, FileText, FileSpreadsheet, File } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AWBPrintViewProps {
    document: ShippingDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AWBPrintView({ document, open, onOpenChange }: AWBPrintViewProps) {
    if (!open || !document) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleExportWord = () => {
        const content = window.document.getElementById('awb-content')?.innerHTML;
        if (!content) return;

        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Air Waybill</title><style>body{font-family: Arial, sans-serif;} table{width: 100%; border-collapse: collapse;} td, th{border: 1px solid #000; padding: 4px;}</style></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;

        const blob = new Blob(['\ufeff', sourceHTML], {
            type: 'application/msword'
        });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `AWB-${document.documentNumber}.doc`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const data = [
            ["Air Waybill"],
            [""],
            ["AWB Number", document.documentNumber],
            ["Date", document.issueDate],
            [""],
            ["Shipper Information"],
            ["Name", document.shipper],
            ["Address", document.shipperAddress || ""],
            ["Contact", document.shipperContact || ""],
            [""],
            ["Consignee Information"],
            ["Name", document.consignee],
            ["Address", document.consigneeAddress || ""],
            ["Contact", document.consigneeContact || ""],
            [""],
            ["Flight Details"],
            ["Carrier", document.carrier],
            ["Flight No", document.voyageFlightNo],
            ["Airport of Departure", document.origin],
            ["Airport of Destination", document.destination],
            [""],
            ["Shipment Details"],
            ["Pieces", "Gross Weight", "Chargeable Weight", "Rate", "Total", "Nature of Goods"],
            [document.packages, document.weight, document.weight, "As Agreed", "As Agreed", document.description]
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "AWB");
        XLSX.writeFile(wb, `AWB-${document.documentNumber}.xlsx`);
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

                {/* AWB Layout */}
                <div id="awb-content" className="w-[210mm] bg-white text-black font-sans p-8 shadow-lg print:shadow-none print:p-0 mx-auto border border-gray-200">

                    {/* Header */}
                    <div className="flex items-center gap-6 mb-6">
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

                    <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
                        <div className="text-sm">
                            <span className="font-bold">Air Waybill No:</span>
                            <span className="ml-2 font-mono text-xl">{document.documentNumber}</span>
                        </div>
                        <h1 className="text-2xl font-bold uppercase">Air Waybill</h1>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-2 gap-0 border border-black">
                        {/* Box 1: Shipper */}
                        <div className="border-r border-b border-black p-2 min-h-[120px]">
                            <p className="text-xs font-bold uppercase mb-1">Shipper's Name and Address</p>
                            <p className="font-bold">{document.shipper}</p>
                            <p className="text-sm whitespace-pre-line">{document.shipperAddress}</p>
                            <p className="text-sm mt-1">{document.shipperContact}</p>
                        </div>

                        {/* Box 2: Consignee */}
                        <div className="border-b border-black p-2 min-h-[120px]">
                            <p className="text-xs font-bold uppercase mb-1">Consignee's Name and Address</p>
                            <p className="font-bold">{document.consignee}</p>
                            <p className="text-sm whitespace-pre-line">{document.consigneeAddress}</p>
                            <p className="text-sm mt-1">{document.consigneeContact}</p>
                        </div>

                        {/* Box 3: Carrier Agent */}
                        <div className="border-black border-r border-b p-2">
                            <p className="text-xs font-bold uppercase mb-1">Issuing Carrier's Agent Name and City</p>
                            <p className="font-bold">Kohesar Logistics</p>
                            <p className="text-sm">Karachi, Pakistan</p>
                        </div>

                        {/* Box 4: Account Info */}
                        <div className="border-black border-b p-2">
                            <p className="text-xs font-bold uppercase mb-1">Accounting Information</p>
                            <p className="text-sm">{document.freightTerms === 'prepaid' ? 'FREIGHT PREPAID' : 'FREIGHT COLLECT'}</p>
                        </div>

                        {/* Box 5: Route */}
                        <div className="col-span-2 border-b border-black grid grid-cols-4">
                            <div className="border-r border-black p-2">
                                <p className="text-xs font-bold uppercase">Airport of Departure</p>
                                <p className="font-bold">{document.origin}</p>
                            </div>
                            <div className="border-r border-black p-2">
                                <p className="text-xs font-bold uppercase">To</p>
                                <p className="font-bold">{document.destination}</p>
                            </div>
                            <div className="border-r border-black p-2">
                                <p className="text-xs font-bold uppercase">By First Carrier</p>
                                <p className="font-bold">{document.carrier}</p>
                            </div>
                            <div className="p-2">
                                <p className="text-xs font-bold uppercase">Flight/Date</p>
                                <p className="font-bold">{document.voyageFlightNo} / {document.etd}</p>
                            </div>
                        </div>

                        {/* Box 6: Shipment Details - Full Width */}
                        <div className="col-span-2 min-h-[300px]">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black">
                                        <th className="border-r border-black p-1 w-16">Pieces RCP</th>
                                        <th className="border-r border-black p-1 w-24">Gross Weight</th>
                                        <th className="border-r border-black p-1 w-16">Kg/Lb</th>
                                        <th className="border-r border-black p-1 w-24">Chargeable Weight</th>
                                        <th className="border-r border-black p-1 w-24">Rate / Charge</th>
                                        <th className="border-r border-black p-1 w-24">Total</th>
                                        <th className="p-1 text-left pl-2">Nature and Quantity of Goods (incl. Dimensions or Volume)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="align-top">
                                        <td className="border-r border-black p-2 text-center">{document.packages}</td>
                                        <td className="border-r border-black p-2 text-center">{document.weight}</td>
                                        <td className="border-r border-black p-2 text-center">K</td>
                                        <td className="border-r border-black p-2 text-center">{document.weight}</td>
                                        <td className="border-r border-black p-2 text-center">AS AGREED</td>
                                        <td className="border-r border-black p-2 text-center">AS AGREED</td>
                                        <td className="p-2">
                                            <p className="font-bold uppercase mb-2">{document.description}</p>
                                            {document.dimensions && (
                                                <p className="text-xs">
                                                    Dims: {document.dimensions.length}x{document.dimensions.width}x{document.dimensions.height} {document.dimensions.unit}<br />
                                                    Vol: {document.volume}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Grid */}
                        <div className="col-span-2 border-t border-black grid grid-cols-2">
                            <div className="border-r border-black p-2 min-h-[100px] flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase">Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage by air according to the applicable Dangerous Goods Regulations.</p>
                                </div>
                                <div className="border-t border-dotted border-black mt-4 pt-1">
                                    <p className="text-xs text-center">Signature of Shipper or his Agent</p>
                                </div>
                            </div>
                            <div className="p-2 min-h-[100px] flex flex-col justify-between">
                                <div className="text-right">
                                    <p className="text-xs">{document.issueDate} at {document.origin}</p>
                                </div>
                                <div className="border-t border-dotted border-black mt-4 pt-1">
                                    <p className="text-xs text-center">Signature of Issuing Carrier or its Agent</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="mt-4 text-center text-xs text-gray-500">
                        <p>Original 3 (For Shipper)</p>
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
