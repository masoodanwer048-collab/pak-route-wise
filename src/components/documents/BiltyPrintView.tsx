import { ShippingDocument } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { X, Printer, FileText, FileSpreadsheet, File } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BiltyPrintViewProps {
    document: ShippingDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BiltyPrintView({ document, open, onOpenChange }: BiltyPrintViewProps) {
    if (!open || !document) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleExportWord = () => {
        const content = window.document.getElementById('bilty-content')?.innerHTML;
        if (!content) return;

        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Bilty Pass</title><style>body{font-family: Arial, sans-serif;}</style></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;

        const blob = new Blob(['\ufeff', sourceHTML], {
            type: 'application/msword'
        });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `bilty-${document.documentNumber}.doc`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const data = [
            ["Bilty Pass / بِلٹی پاس"],
            [""],
            ["Bilty Number / بِلٹی نمبر", document.documentNumber],
            ["Date of Issue / جاری ہونے کی تاریخ", document.issueDate],
            ["Consignor / بھیجنے والے کا نام", document.shipper],
            ["Consignee / وصول کنندہ کا نام", document.consignee],
            ["Goods Description / سامان کی تفصیل", document.description],
            ["Quantity / مقدار", document.packages.toString()],
            ["Weight / وزن", document.weight],
            ["Vehicle Number / گاڑی کا نمبر", document.vesselFlightTruck],
            ["Driver Name / ڈرائیور کا نام", document.voyageFlightNo],
            ["Dispatch Date / روانگی کی تاریخ", document.etd || 'N/A'],
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bilty Pass");
        XLSX.writeFile(wb, `bilty-${document.documentNumber}.xlsx`);
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

                {/* Bilty Pass Layout */}
                <div id="bilty-content" className="w-[210mm] bg-white text-black font-sans p-8 shadow-lg print:shadow-none print:p-0 mx-auto border-2 border-black">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10 border-b-2 border-black pb-4">
                        <img src="/kohesar_logo_print.png" alt="Kohesar Logistics" className="h-32 object-contain mb-2" />
                        <div className="border-2 border-black px-8 py-2 rounded-md bg-gray-50">
                            <h2 className="text-2xl font-bold uppercase text-center flex flex-col sm:flex-row gap-2">
                                <span>Bilty Pass</span>
                                <span className="hidden sm:inline">|</span>
                                <span>بِلٹی پاس</span>
                            </h2>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="space-y-6 px-4">

                        {/* Row 1 */}
                        <div className="flex justify-between gap-8">
                            <div className="w-1/2">
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Bilty Number:</span>
                                    <span className="font-bold text-lg font-urdu dir-rtl block text-right sm:text-left">بِلٹی نمبر:</span>
                                </div>
                                <div className="text-xl font-mono border-b-2 border-dotted border-black pt-1 min-h-[32px]">{document.documentNumber}</div>
                            </div>
                            <div className="w-1/2">
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Date of Issue:</span>
                                    <span className="font-bold text-lg font-urdu dir-rtl block text-right sm:text-left">جاری ہونے کی تاریخ:</span>
                                </div>
                                <div className="text-xl font-mono border-b-2 border-dotted border-black pt-1 min-h-[32px]">{new Date(document.issueDate).toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <div>
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Consignor (Sender):</span>
                                    <span className="font-bold text-lg font-urdu block">بھیجنے والے کا نام:</span>
                                </div>
                                <div className="border-b-2 border-dotted border-black pt-1 min-h-[40px] text-lg">{document.shipper}</div>
                            </div>
                            <div>
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Consignee (Receiver):</span>
                                    <span className="font-bold text-lg font-urdu block">وصول کنندہ کا نام:</span>
                                </div>
                                <div className="border-b-2 border-dotted border-black pt-1 min-h-[40px] text-lg">{document.consignee}</div>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="mt-6">
                            <div className="mb-1">
                                <span className="font-bold text-lg block">Goods Description:</span>
                                <span className="font-bold text-lg font-urdu block">سامان کی تفصیل:</span>
                            </div>
                            <div className="border-2 border-black p-4 min-h-[100px] text-lg rounded-sm bg-gray-50/30">
                                {document.description}
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="flex justify-between gap-8 mt-6">
                            <div className="w-1/2">
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Quantity:</span>
                                    <span className="font-bold text-lg font-urdu block">مقدار:</span>
                                </div>
                                <div className="text-xl font-mono border-b-2 border-dotted border-black pt-1">{document.packages}</div>
                            </div>
                            <div className="w-1/2">
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Weight:</span>
                                    <span className="font-bold text-lg font-urdu block">وزن:</span>
                                </div>
                                <div className="text-xl font-mono border-b-2 border-dotted border-black pt-1">{document.weight}</div>
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <div>
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Vehicle Number:</span>
                                    <span className="font-bold text-lg font-urdu block">گاڑی کا نمبر:</span>
                                </div>
                                <div className="border-b-2 border-dotted border-black pt-1 text-xl font-mono">{document.vesselFlightTruck}</div>
                            </div>
                            <div>
                                <div className="mb-1">
                                    <span className="font-bold text-lg block">Driver's Name:</span>
                                    <span className="font-bold text-lg font-urdu block">ڈرائیور کا نام:</span>
                                </div>
                                <div className="border-b-2 border-dotted border-black pt-1 text-xl">{document.voyageFlightNo}</div>
                            </div>
                        </div>

                        {/* Row 6 */}
                        <div className="mt-6">
                            <div className="mb-1">
                                <span className="font-bold text-lg block">Dispatch Date:</span>
                                <span className="font-bold text-lg font-urdu block">روانگی کی تاریخ:</span>
                            </div>
                            <div className="text-xl font-mono border-b-2 border-dotted border-black pt-1 inline-block min-w-[250px]">{document.etd ? new Date(document.etd).toLocaleDateString() : 'N/A'}</div>
                        </div>

                        {/* Row 7: Authorization */}
                        <div className="mt-12 border-t-2 border-black pt-6 grid grid-cols-2 gap-12">
                            <div>
                                <div className="mb-4">
                                    <span className="font-bold text-lg block">Gate Pass Authorization:</span>
                                    <span className="font-bold text-lg font-urdu block">گیٹ پاس اتھارائزیشن:</span>
                                </div>
                                <div className="h-24 border-2 border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 italic rounded-md">
                                    Authorized Stamp
                                </div>
                            </div>
                            <div className="text-center mt-auto">
                                <div className="border-b-2 border-black mb-2 w-full mx-auto"></div>
                                <div>
                                    <span className="font-bold text-lg block">Authorized By (Signature)</span>
                                    <span className="font-bold text-lg font-urdu block">اتھارائزڈ بی (دستخط)</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-12 text-center text-sm text-gray-500">
                            <p>This is a computer-generated document and acts as a valid gate pass.</p>
                            <p className="font-urdu mt-1">یہ ایک کمپیوٹر سے تیار کردہ دستاویز ہے اور ایک درست گیٹ پاس کے طور پر کام کرتی ہے۔</p>
                        </div>

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
                  .font-urdu { font-family: 'Noto Nastaliq Urdu', 'Arial', sans-serif; }
                `}</style>
            </div>
        </div>
    );
}
