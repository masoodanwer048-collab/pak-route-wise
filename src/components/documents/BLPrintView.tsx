import { ShippingDocument } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm print:bg-white print:backdrop-blur-none overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 print:p-0 print:block">
                {/* Print Controls */}
                <div className="fixed top-4 right-4 flex gap-2 print:hidden z-50">
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                </div>

                {/* Main BL Form - Based on image layout */}
                <div className="w-[210mm] bg-white text-black font-sans text-xs p-8 shadow-lg print:shadow-none print:p-0 mx-auto">

                    {/* Top Header Row */}
                    <div className="flex justify-between items-end border-b-2 border-black mb-1 pb-1">
                        <div className="w-1/3">
                            <span className="font-bold">Date:</span> <span className="ml-2 font-mono">{new Date(document.issueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="w-1/3 text-center">
                            <h1 className="text-2xl font-bold uppercase">Bill of Lading</h1>
                        </div>
                        <div className="w-1/3 text-right">
                            <span className="font-bold">Page 1 of 1</span>
                        </div>
                    </div>

                    {/* Top Grid Section */}
                    <div className="border border-black flex">
                        {/* Left Column (Addresses) */}
                        <div className="w-1/2 border-r border-black flex flex-col">
                            {/* SHIP FROM */}
                            <div className="flex-1 border-b border-black p-2 relative">
                                <div className="absolute top-0 left-0 bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">Ship From</div>
                                <div className="mt-4 space-y-1 ml-1">
                                    <div className="font-bold">Name: <span className="font-normal">{document.shipper}</span></div>
                                    <div className="font-bold">Address: <span className="font-normal whitespace-pre-line">{document.shipperAddress}</span></div>
                                    <div className="font-bold mt-2 text-right">SID#: _________________</div>
                                    <div className="text-right">FOB: <input type="checkbox" /></div>
                                </div>
                            </div>

                            {/* SHIP TO */}
                            <div className="flex-1 border-b border-black p-2 relative">
                                <div className="absolute top-0 left-0 bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">Ship To</div>
                                <div className="mt-4 space-y-1 ml-1">
                                    <div className="font-bold">Name: <span className="font-normal">{document.consignee}</span></div>
                                    <div className="font-bold">Address: <span className="font-normal whitespace-pre-line">{document.consigneeAddress}</span></div>
                                    <div className="flex justify-between mt-2">
                                        <div className="font-bold">Location #: __________</div>
                                        <div className="font-bold">CID#: __________</div>
                                    </div>
                                    <div className="text-right">FOB: <input type="checkbox" /></div>
                                </div>
                            </div>

                            {/* THIRD PARTY */}
                            <div className="flex-1 p-2 relative min-h-[100px]">
                                <div className="absolute top-0 left-0 bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">Third Party Freight Charges Bill To</div>
                                <div className="mt-4 space-y-1 ml-1">
                                    {document.notifyParties?.map((party, i) => (
                                        <div key={i}>{party}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Carrier/BL Info) */}
                        <div className="w-1/2 flex flex-col">
                            {/* BL Number Section */}
                            <div className="h-28 border-b border-black p-2">
                                <div className="font-bold mb-1">Bill of Lading Number:</div>
                                <div className="text-xl font-bold ml-2">{document.documentNumber}</div>
                                <div className="mt-4 text-center text-gray-200 text-4xl tracking-widest font-libre-barcode select-none">
                                    || | ||| | |||
                                </div>
                            </div>

                            {/* Carrier Name / Trailer / Seal */}
                            <div className="border-b border-black p-2 space-y-2">
                                <div className="font-bold flex">CARRIER NAME: <span className="font-normal ml-2">{document.carrier}</span></div>
                                <div className="font-bold flex">Trailer number: <span className="font-normal ml-2">{document.vesselFlightTruck}</span></div>
                                <div className="font-bold flex">Seal number(s): <span className="font-normal ml-2">__________________</span></div>
                            </div>

                            {/* SCAC / Pro */}
                            <div className="h-28 border-b border-black p-2">
                                <div className="font-bold">SCAC: __________</div>
                                <div className="font-bold mt-1">Pro number: __________</div>
                                <div className="mt-2 text-center text-gray-200 text-4xl tracking-widest font-libre-barcode select-none">
                                    || | ||| | |||
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex-1 p-2">
                                <div className="font-bold text-[10px] mb-2">Freight Change Terms: (freight charges are prepaid unless marked otherwise)</div>
                                <div className="flex gap-4 text-sm">
                                    <label className="flex items-center gap-1 font-bold">
                                        <input type="checkbox" checked={document.freightTerms === 'prepaid'} readOnly /> Prepaid
                                    </label>
                                    <label className="flex items-center gap-1 font-bold">
                                        <input type="checkbox" checked={document.freightTerms === 'collect'} readOnly /> Collect
                                    </label>
                                    <label className="flex items-center gap-1 font-bold">
                                        <input type="checkbox" /> 3rd Party
                                    </label>
                                </div>
                                <div className="mt-2 border-t border-black pt-1">
                                    <label className="flex items-start gap-2 text-[10px]">
                                        <input type="checkbox" className="mt-1" />
                                        <span>Master Bill of Lading: with attached underlying Bills of Lading</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="border border-t-0 border-black p-2 min-h-[60px]">
                        <div className="font-bold">SPECIAL INSTRUCTIONS:</div>
                        <div className="whitespace-pre-wrap ml-2">{document.remarks}</div>
                    </div>

                    {/* Customer Order Info Table */}
                    <div className="mt-4 border border-black">
                        <div className="bg-gray-200 font-bold text-center border-b border-black text-[10px] py-0.5">CUSTOMER ORDER INFORMATION</div>
                        <table className="w-full text-[10px] border-collapse">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="border-r border-black p-1 w-1/4">CUSTOMER ORDER NUMBER</th>
                                    <th className="border-r border-black p-1 w-16"># PKGS</th>
                                    <th className="border-r border-black p-1 w-20">WEIGHT</th>
                                    <th className="border-r border-black p-1 w-16">PALLET/SLIP<br /><span className="text-[8px]">(CIRCLE ONE)</span></th>
                                    <th className="p-1">ADDITIONAL SHIPPER INFO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <tr key={i} className="border-b border-black h-6 last:border-b-0">
                                        <td className="border-r border-black"></td>
                                        <td className="border-r border-black"></td>
                                        <td className="border-r border-black"></td>
                                        <td className="border-r border-black text-center text-gray-300 font-bold">Y &nbsp; N</td>
                                        <td className=""></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Carrier Info Table */}
                    <div className="mt-4 border border-black bg-black text-white font-bold text-center text-[10px] py-0.5">
                        CARRIER INFORMATION
                    </div>
                    <div className="border border-t-0 border-black">
                        <table className="w-full text-[10px] border-collapse">
                            <thead>
                                <tr className="border-b border-black h-8">
                                    <th colSpan={2} className="border-r border-black p-1 w-24">HANDLING UNIT</th>
                                    <th colSpan={2} className="border-r border-black p-1 w-24">PACKAGE</th>
                                    <th rowSpan={2} className="border-r border-black p-1 w-20">WEIGHT</th>
                                    <th rowSpan={2} className="border-r border-black p-1 w-10">H.M.<br />(X)</th>
                                    <th rowSpan={2} className="border-r border-black p-1">COMMODITY DESCRIPTION</th>
                                    <th colSpan={2} className="p-1 w-24">L.T.L ONLY</th>
                                </tr>
                                <tr className="border-b border-black">
                                    <th className="border-r border-black p-1 w-12 bg-gray-100">QTY</th>
                                    <th className="border-r border-black p-1 w-12 bg-gray-100">TYPE</th>
                                    <th className="border-r border-black p-1 w-12 bg-gray-100">QTY</th>
                                    <th className="border-r border-black p-1 w-12 bg-gray-100">TYPE</th>
                                    <th className="border-r border-black p-1 w-12 bg-gray-100">NMFC #</th>
                                    <th className="p-1 w-12 bg-gray-100">CLASS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-black h-32 align-top">
                                    <td className="border-r border-black p-1 text-center font-mono"></td>
                                    <td className="border-r border-black p-1 font-mono"></td>
                                    <td className="border-r border-black p-1 text-center font-mono">{document.packages}</td>
                                    <td className="border-r border-black p-1 font-mono">PKGS</td>
                                    <td className="border-r border-black p-1 text-center font-mono">{document.weight}</td>
                                    <td className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1 relative">
                                        <div className="text-[9px] mb-2 text-center italic leading-tight text-gray-500">
                                            Commodities requiring special or additional care or attention in handling or stowing must be so marked and packaged as to ensure safe transportation with ordinary care. <br /> See Section 2(e) of NMFC Item 360
                                        </div>
                                        <div className="font-bold whitespace-pre-wrap">{document.description}</div>
                                    </td>
                                    <td className="border-r border-black p-1 font-mono">{document.hsCode}</td>
                                    <td className="p-1"></td>
                                </tr>
                                <tr className="h-8 bg-gray-200">
                                    <td colSpan={2} className="border-r border-black p-1 font-bold text-right">GRAND TOTAL</td>
                                    <td colSpan={2} className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1 font-mono font-bold">{document.weight}</td>
                                    <td colSpan={5}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Footer Section */}
                    <div className="border border-t-0 border-black flex">
                        {/* Disclaimer Left */}
                        <div className="w-1/2 p-2 border-r border-black text-[8px] leading-tight">
                            Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or declared value of the property.<br /><br />
                            The agreed or declared value of the property is hereby specifically stated by the shipper to be not exceeding __________________ per __________________.
                        </div>
                        {/* COD & Terms Right */}
                        <div className="w-1/2 p-2 text-[10px]">
                            <div className="flex mb-2">
                                <span className="font-bold w-24">COD Amount: $</span>
                                <span className="border-b border-black flex-1"></span>
                            </div>
                            <div className="flex gap-4 mb-2">
                                <span className="font-bold">Fee Terms:</span>
                                <label className="flex items-center gap-1"><input type="checkbox" /> Collect</label>
                                <label className="flex items-center gap-1"><input type="checkbox" /> Prepaid</label>
                            </div>
                            <div className="flex gap-2">
                                <label className="flex items-center gap-1"><input type="checkbox" /> Customer check acceptable</label>
                            </div>
                        </div>
                    </div>

                    {/* Legal Note Row */}
                    <div className="border border-t-0 border-black p-1 text-[8px] italic text-center">
                        NOTE: Liability Limitation for loss or damage in this shipment may be applicable. See 49 U.S.C. 14706(c)(1)(A) and (B).
                    </div>

                    {/* Signatures */}
                    <div className="border border-t-0 border-black flex h-24">
                        {/* Shipper Sig */}
                        <div className="w-1/3 border-r border-black p-2 flex flex-col justify-between">
                            <div className="font-bold text-[8px] leading-tight text-justify">
                                RECEIVED, subject to individually determined rates or contracts that have been agreed upon in writing between the carrier and shipper, if applicable, otherwise to the rates, classifications and rules that have been established by the carrier and are available to the shipper, on request.
                            </div>
                            <div className="mt-2">
                                <div className="font-bold text-[10px]">SHIPPER SIGNATURE / DATE</div>
                                <div className="text-[8px] italic leading-tight mb-4">This is to certify that the above named materials are properly classified, packaged, marked and labeled...</div>
                                <div className="border-b border-black"></div>
                            </div>
                        </div>
                        {/* Trailer Loaded / Freight Counted */}
                        <div className="w-1/4 border-r border-black p-2 text-[10px] space-y-2">
                            <div>
                                <div className="font-bold border-b border-black mb-1">Trailer Loaded:</div>
                                <div><label className="flex items-center gap-1"><input type="checkbox" /> By Shipper</label></div>
                                <div><label className="flex items-center gap-1"><input type="checkbox" /> By Driver</label></div>
                            </div>
                            <div>
                                <div className="font-bold border-b border-black mb-1">Freight Counted:</div>
                                <div><label className="flex items-center gap-1"><input type="checkbox" /> By Shipper</label></div>
                                <div><label className="flex items-center gap-1"><input type="checkbox" /> By Driver/Pallets</label></div>
                                <div><label className="flex items-center gap-1"><input type="checkbox" /> By Driver/Pieces</label></div>
                            </div>
                        </div>
                        {/* Carrier Sig */}
                        <div className="flex-1 p-2 flex flex-col justify-between">
                            <div className="font-bold text-[10px]">CARRIER SIGNATURE / PICKUP DATE</div>
                            <div className="text-[8px] italic leading-tight">Carrier acknowledges receipt of packages and required placards. Carrier certifies emergency response information was made available...</div>
                            <div className="mt-auto">
                                <div className="border-b border-black"></div>
                                <div className="text-right text-[8px] mt-1">Driver Signature</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* CSS for printing */}
                <style>{`
                    @media print {
                        @page { size: A4; margin: 0; }
                        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        body * { visibility: hidden; }
                        .print\\:block, .print\\:block * { visibility: visible; }
                        .print\\:shadow-none { box-shadow: none; }
                        .print\\:hidden { display: none !important; }
                    }
                `}</style>
            </div>
        </div>
    );
}
