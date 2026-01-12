
import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const ManifestEntryForm = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center print:p-0 print:bg-white">
            {/* Action Bar (Hidden on Print) */}
            <div className="w-full max-w-[210mm] flex justify-end mb-6 print:hidden">
                <Button onClick={() => window.print()} className="gap-2">
                    <Printer className="h-4 w-4" /> Print Form
                </Button>
            </div>

            {/* A4 Sheet */}
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white border shadow-md p-[10mm] print:border-0 print:shadow-none print:p-0 mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold uppercase underline decoration-2 underline-offset-4">
                        CARRIER MANIFEST / CAREER MANIFEST ENTRY FORM
                    </h1>
                </div>

                {/* Top Info Section */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-end gap-2">
                            <span className="font-bold whitespace-nowrap">Manifest Type:</span>
                            <div className="border-b border-black flex-grow h-6"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-end gap-2">
                            <span className="font-bold whitespace-nowrap">Demand No.:</span>
                            <div className="border-b border-black flex-grow h-6"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-end gap-2">
                            <span className="font-bold whitespace-nowrap">S. No.:</span>
                            <div className="border-b border-black flex-grow h-6"></div>
                        </div>
                    </div>
                </div>

                {/* Main Table Form */}
                <div className="border-2 border-black">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 border-b border-black">
                        <div className="p-2 border-r border-black flex">
                            <span className="font-bold w-32">S.NO:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                        <div className="p-2 flex">
                            <span className="font-bold w-32">DATE:</span>
                            <input type="date" className="flex-grow outline-none bg-transparent font-mono" />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 border-b border-black">
                        <div className="p-2 border-r border-black flex">
                            <span className="font-bold w-32">G.D NO. & Date:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                        <div className="p-2 flex">
                            <span className="font-bold w-32">B/L NO.:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 border-b border-black">
                        <div className="p-2 flex">
                            <span className="font-bold w-64">Discharged From Vessel / Voyage:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-2 border-b border-black">
                        <div className="p-2 border-r border-black flex">
                            <span className="font-bold w-32">IGM NO. & Date:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                        <div className="p-2 flex">
                            <span className="font-bold w-32">INDEX NO.:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                    </div>

                    {/* Row 5 */}
                    <div className="grid grid-cols-2 border-b border-black">
                        <div className="p-2 border-r border-black flex">
                            <span className="font-bold w-32">Port of Loading:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                        <div className="p-2 flex">
                            <span className="font-bold w-32">Place of Delivery:</span>
                            <input className="flex-grow outline-none bg-transparent" />
                        </div>
                    </div>

                    {/* Row 6 */}
                    <div className="grid grid-cols-1 border-b border-black">
                        <div className="p-2 flex">
                            <span className="font-bold w-64">One/Two Way:</span>
                            <div className="flex gap-8">
                                <label className="flex items-center gap-2"><div className="w-4 h-4 border border-black"></div> One Way</label>
                                <label className="flex items-center gap-2"><div className="w-4 h-4 border border-black"></div> Two Way</label>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="border-b border-black min-h-[100px] p-2">
                        <span className="font-bold block mb-2">Description of Goods:</span>
                        <textarea className="w-full h-24 resize-none outline-none bg-transparent border-none p-0" placeholder="Enter description here..."></textarea>
                    </div>

                    {/* Container Details */}
                    <div className="grid grid-cols-2 border-b border-black">
                        <div className="p-2 border-r border-black">
                            <span className="font-bold block mb-1">Container NO.1:</span>
                            <input className="w-full outline-none bg-transparent border-b border-gray-300 border-dashed" />
                        </div>
                        <div className="p-2">
                            <span className="font-bold block mb-1">Container NO.2:</span>
                            <input className="w-full outline-none bg-transparent border-b border-gray-300 border-dashed" />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 border-b border-black">
                        <div className="p-2 border-r border-black">
                            <span className="font-bold block text-xs">SIZE</span>
                            <input className="w-full outline-none bg-transparent" />
                        </div>
                        <div className="p-2 border-r border-black">
                            <span className="font-bold block text-xs">Net Weight (MT)</span>
                            <input className="w-full outline-none bg-transparent" />
                        </div>
                        <div className="p-2 border-r border-black">
                            <span className="font-bold block text-xs">Gross Weight (MT)</span>
                            <input className="w-full outline-none bg-transparent" />
                        </div>
                        <div className="p-2">
                            <span className="font-bold block text-xs">PACKAGES</span>
                            <input className="w-full outline-none bg-transparent" />
                        </div>
                    </div>

                    {/* Party Details */}
                    <div className="border-b border-black p-2">
                        <span className="font-bold block mb-1">CONSIGNEE NAME:</span>
                        <input className="w-full outline-none bg-transparent border-b border-gray-300 border-dashed" />
                    </div>

                    <div className="border-b border-black p-2">
                        <span className="font-bold block mb-1">Loading Supervisor Name:</span>
                        <input className="w-full outline-none bg-transparent border-b border-gray-300 border-dashed" />
                    </div>

                    <div className="border-b border-black p-2">
                        <span className="font-bold block mb-1">Clearing Agent (Karachi) Name & Tel No.:</span>
                        <input className="w-full outline-none bg-transparent border-b border-gray-300 border-dashed" />
                    </div>

                    <div className="border-b border-black p-2">
                        <span className="font-bold block mb-1">Border Agent (Chaman/Torkham) Name & Tel No.:</span>
                        <input className="w-full outline-none bg-transparent border-b border-gray-300 border-dashed" />
                    </div>

                    <div className="p-2">
                        <span className="font-bold block mb-1">Vehicle No.:</span>
                        <input className="w-full outline-none bg-transparent text-lg font-mono" />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 grid grid-cols-3 gap-8 text-sm">
                    <div className="flex flex-col gap-2">
                        <div className="font-bold">Prepared By:</div>
                        <div className="border-b border-black mt-8 h-1"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-bold">Checked By:</div>
                        <div className="border-b border-black mt-8 h-1"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-bold">Signature & Stamp:</div>
                        <div className="border-b border-black mt-8 h-1"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManifestEntryForm;
