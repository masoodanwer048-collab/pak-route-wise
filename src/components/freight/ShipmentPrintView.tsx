
import { FreightShipment } from '@/hooks/useFreightShipments';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';

interface ShipmentPrintViewProps {
    shipment: FreightShipment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShipmentPrintView({ shipment, open, onOpenChange }: ShipmentPrintViewProps) {
    if (!open || !shipment) return null;

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
                <div className="w-[210mm] bg-white p-8 shadow-lg ring-1 ring-black/5 mx-auto print:shadow-none print:ring-0 print:w-full print:max-w-none print:p-0 print:m-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12 border-b-2 border-black pb-6">
                        <div className="w-1/4">
                            <img
                                src="/kohesar_logo.png"
                                alt="Kohesar Logistics"
                                className="h-24 w-auto object-contain"
                            />
                        </div>
                        <div className="flex-1 text-center">
                            <h2 className="text-3xl font-bold text-black tracking-tight mb-1">SHIPMENT DETAILS</h2>
                        </div>
                        <div className="w-1/4 text-right">
                            <p className="text-base text-gray-600 font-mono tracking-wider">{shipment.reference}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{new Date().toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Main Info Grid */}
                    <div className="space-y-8">
                        {/* Route Section */}
                        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50 print:bg-transparent print:border-black">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2 print:border-black">Route Information</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Origin</p>
                                    <p className="text-lg font-semibold text-black">{shipment.origin}</p>
                                </div>
                                <div className="px-8 text-gray-400 print:text-black">➝</div>
                                <div className="flex-1 text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destination</p>
                                    <p className="text-lg font-semibold text-black">{shipment.destination}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Status & Schedule */}
                                <div className="border border-gray-200 rounded-lg p-6 print:border-black">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2 print:border-black">Status & Schedule</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[100px_1fr] items-center">
                                            <span className="text-sm text-gray-600 font-medium">Status</span>
                                            <span className="text-sm font-bold uppercase tracking-wider">{shipment.status.replace('_', ' ')}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] items-center">
                                            <span className="text-sm text-gray-600 font-medium">ETA</span>
                                            <span className="text-sm font-mono">{shipment.eta}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cargo Details */}
                                <div className="border border-gray-200 rounded-lg p-6 print:border-black">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2 print:border-black">Cargo Details</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[100px_1fr] items-center">
                                            <span className="text-sm text-gray-600 font-medium">Weight</span>
                                            <span className="text-sm font-mono">{shipment.weight}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] items-center">
                                            <span className="text-sm text-gray-600 font-medium">Units</span>
                                            <span className="text-sm font-mono">{shipment.containers} {shipment.containers === 1 ? 'Unit' : 'Units'}</span>
                                        </div>
                                        {shipment.volume && (
                                            <div className="grid grid-cols-[100px_1fr] items-center">
                                                <span className="text-sm text-gray-600 font-medium">Volume</span>
                                                <span className="text-sm font-mono">{shipment.volume}</span>
                                            </div>
                                        )}
                                        {shipment.packages && (
                                            <div className="grid grid-cols-[100px_1fr] items-center">
                                                <span className="text-sm text-gray-600 font-medium">Packages</span>
                                                <span className="text-sm font-mono">{shipment.packages}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Carrier Details */}
                                <div className="border border-gray-200 rounded-lg p-6 h-full print:border-black">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2 print:border-black">Carrier Information</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[100px_1fr] items-baseline">
                                            <span className="text-sm text-gray-600 font-medium">Carrier</span>
                                            <span className="text-base font-semibold">{shipment.carrier}</span>
                                        </div>
                                        <div className="grid grid-cols-[100px_1fr] items-baseline">
                                            <span className="text-sm text-gray-600 font-medium">
                                                {shipment.mode === 'air' ? 'Flight No' :
                                                    shipment.mode === 'sea' ? 'Vessel' :
                                                        shipment.mode === 'rail' ? 'Train No' :
                                                            'Vehicle'}
                                            </span>
                                            <span className="text-base font-mono bg-gray-100 px-2 py-0.5 rounded print:bg-transparent print:border print:border-gray-300 print:px-0 print:border-none print:py-0">{shipment.vehicle}</span>
                                        </div>
                                        {shipment.driver && shipment.mode !== 'air' && shipment.mode !== 'sea' && (
                                            <div className="grid grid-cols-[100px_1fr] items-baseline">
                                                <span className="text-sm text-gray-600 font-medium">Driver</span>
                                                <span className="text-base">{shipment.driver}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer & Signatures */}
                    <div className="mt-auto pt-12">

                        {/* Signature Block */}
                        <div className="grid grid-cols-2 gap-20 mb-12 page-break-inside-avoid">
                            <div className="pt-8">
                                <div className="border-b border-black mb-2"></div>
                                <p className="text-xs font-bold text-black uppercase tracking-wider">Logistics Officer</p>
                                <p className="text-[10px] text-gray-500">Name & Stamp</p>
                            </div>
                            <div className="pt-8">
                                <div className="border-b border-black mb-2"></div>
                                <p className="text-xs font-bold text-black uppercase tracking-wider">Authorized Signature</p>
                                <p className="text-[10px] text-gray-500">For Kohesar Logistics (Pvt) Ltd</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 flex flex-col items-center justify-center text-center gap-2">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">System Generated Report</p>
                            <p className="text-xs font-bold text-black uppercase tracking-wider">Keep The Lord On The Road</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
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
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
        </div>
    );
}
