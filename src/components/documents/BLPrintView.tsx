import { ShippingDocument } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';
import BLLegalNote from './BLLegalNote';

interface BLPrintViewProps {
    document: ShippingDocument | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BLPrintView({ document, open, onOpenChange }: BLPrintViewProps) {
    if (!open || !document) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:static print:p-0 print:block">

                {/* Print Controls - Hidden when printing */}
                <div className="absolute top-4 right-4 flex gap-2 print:hidden z-50">
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                </div>

                {/* Printable Content */}
                <div className="w-[210mm] bg-white p-10 shadow-lg ring-1 ring-black/5 mx-auto print:shadow-none print:ring-0 print:w-full print:max-w-none print:p-0 print:m-0 font-serif">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8 border-b-2 border-black pb-4">
                        <div className="w-1/3">
                            <img
                                src="/kohesar_logo.png"
                                alt="Kohesar Logistics"
                                className="h-20 w-auto object-contain mb-2"
                            />
                            <h1 className="text-xl font-bold uppercase tracking-wide">Kohesar Logistics</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">(Private Limited)</p>
                            <p className="text-[10px] italic mt-1 font-bold">"Keep The Lord On The Road"</p>
                        </div>

                        <div className="flex-1 text-center pt-8">
                            <h2 className="text-3xl font-bold text-black border-[3px] border-black inline-block px-4 py-1">BILL OF LADING</h2>
                        </div>

                        <div className="w-1/3 text-right pt-2">
                            <div className="border border-black p-2 inline-block min-w-[150px] text-center mb-2">
                                <p className="text-[10px] text-gray-500 uppercase">BL Reference No.</p>
                                <p className="text-lg font-bold font-mono">{document.documentNumber}</p>
                            </div>
                            <p className="text-[10px] text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Parties Section */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div className="border border-gray-300 p-3 min-h-[100px]">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Shipper</p>
                                <p className="text-sm font-semibold">{document.shipper}</p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {/* Mock address since it's not in the type yet */}
                                    Industrial Estate, Plot 45-B<br />
                                    Karachi, Pakistan
                                </p>
                            </div>
                            <div className="border border-gray-300 p-3 min-h-[100px]">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Consignee</p>
                                <p className="text-sm font-semibold">{document.consignee}</p>
                                <p className="text-xs text-gray-600 mt-1">
                                    To Order of Bank / {document.destination}
                                </p>
                            </div>
                            <div className="border border-gray-300 p-3 min-h-[100px]">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Notify Party</p>
                                {document.notifyParties?.map((party, i) => (
                                    <p key={i} className="text-sm">{party}</p>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Transport Details Grid within Right Column */}
                            <div className="grid grid-cols-2 gap-4 border border-gray-300 p-3">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Vessel</p>
                                    <p className="text-sm font-bold">{document.vesselFlightTruck}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Voyage No.</p>
                                    <p className="text-sm">{document.voyageFlightNo}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border border-gray-300 p-3">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Place of Receipt</p>
                                    <p className="text-sm">{document.origin || document.pol}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Port of Loading</p>
                                    <p className="text-sm">{document.pol || document.origin}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border border-gray-300 p-3">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Port of Discharge</p>
                                    <p className="text-sm">{document.pod || document.destination}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Place of Delivery</p>
                                    <p className="text-sm">{document.destination || document.pod}</p>
                                </div>
                            </div>

                            <div className="border border-gray-300 p-3">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Freight Terms</p>
                                <p className="text-sm font-bold uppercase">{document.freightTerms}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cargo Particulars Table */}
                    <div className="mb-8">
                        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] border-y-2 border-black mb-2">
                            <div className="p-2 text-[10px] font-bold uppercase">Marks & Numbers</div>
                            <div className="p-2 text-[10px] font-bold uppercase border-l border-gray-300">Description of Packages & Goods</div>
                            <div className="p-2 text-[10px] font-bold uppercase border-l border-gray-300 text-right">Gross Weight</div>
                            <div className="p-2 text-[10px] font-bold uppercase border-l border-gray-300 text-right">Measurement</div>
                        </div>

                        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] min-h-[200px]">
                            <div className="p-2 text-xs font-mono whitespace-pre-line">
                                {document.containers?.join('\n')}
                                {document.marksAndNumbers && '\n' + document.marksAndNumbers}
                            </div>
                            <div className="p-2 text-xs border-l border-gray-300">
                                <p className="font-bold mb-2">
                                    {document.containers?.length || 0} Containers
                                    {document.cargoType === 'FCL' ? ' FCL/FCL' : ' LCL'}
                                    <br />
                                    SAID TO CONTAIN:
                                </p>
                                <p className="whitespace-pre-wrap">{document.description}</p>
                                {document.hsCode && <p className="mt-2 text-[10px]">HS Code: {document.hsCode}</p>}
                            </div>
                            <div className="p-2 text-xs border-l border-gray-300 text-right">{document.weight}</div>
                            <div className="p-2 text-xs border-l border-gray-300 text-right">{document.volume}</div>
                        </div>
                    </div>

                    {/* Footer / Declarations */}
                    <div className="mt-auto">
                        <BLLegalNote />
                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="text-[10px] text-justify text-gray-500 space-y-2">
                                <div className="mt-8 pt-8 border-t border-gray-300 w-3/4">
                                    <p className="font-bold uppercase">Logistics Officer</p>
                                    <p>Name & Stamp</p>
                                </div>
                            </div>

                            <div className="text-center relative">
                                <p className="text-[10px] font-bold uppercase mb-16 text-right">For Kohesar Logistics (Private Limited)</p>
                                <div className="absolute bottom-0 right-0 w-3/4 text-center border-t border-black pt-2">
                                    <p className="text-xs font-bold uppercase">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0mm; 
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:static {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
           .print\\:hidden {
            display: none !important;
           }
        }
      `}</style>
        </div>
    );
}
