import React, { useRef, useState } from "react";
import { GoodsDeclaration, GDItem, GDType, initialGD } from "@/types/customs-gd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Save, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OfficialGDForm = () => {
    const [gd, setGD] = useState<GoodsDeclaration>(initialGD);
    const formRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // -- Calculators --
    const calculateDuties = (item: GDItem): GDItem => {
        // Simplified calculation logic for demo
        const cd = Math.round((item.assessableValue * item.customsDutyRate) / 100);
        const rd = Math.round((item.assessableValue * item.regulatoryDutyRate) / 100);
        const valueAfterDuty = item.assessableValue + cd + rd;
        const st = Math.round((valueAfterDuty * item.salesTaxRate) / 100);

        return {
            ...item,
            totalDuty: cd + rd + st
        };
    };

    const updateCalculations = (items: GDItem[]) => {
        const totalCD = items.reduce((sum, i) => sum + Math.round((i.assessableValue * i.customsDutyRate) / 100), 0);
        const totalRD = items.reduce((sum, i) => sum + Math.round((i.assessableValue * i.regulatoryDutyRate) / 100), 0);
        const totalST = items.reduce((sum, i) => {
            const val = i.assessableValue + Math.round((i.assessableValue * i.customsDutyRate) / 100) + Math.round((i.assessableValue * i.regulatoryDutyRate) / 100);
            return sum + Math.round((val * i.salesTaxRate) / 100);
        }, 0);

        setGD(prev => ({
            ...prev,
            items: items,
            totalCustomsDuty: totalCD,
            totalRegulatoryDuty: totalRD,
            totalSalesTax: totalST,
            totalTaxes: totalCD + totalRD + totalST
        }));
    };

    const handleItemChange = (index: number, field: keyof GDItem, value: any) => {
        const newItems = [...gd.items];
        newItems[index] = { ...newItems[index], [field]: value };
        // Recalculate this item
        if (field === "assessableValue" || field === "customsDutyRate" || field === "salesTaxRate" || field === "regulatoryDutyRate") {
            newItems[index] = calculateDuties(newItems[index]);
        }
        updateCalculations(newItems);
    };

    const addItem = () => {
        const newItem: GDItem = {
            itemNo: gd.items.length + 1,
            hsCode: "", description: "", qty: 0, uom: "KG",
            grossWeight: 0, netWeight: 0, declaredValue: 0, assessableValue: 0,
            customsDutyRate: 20, salesTaxRate: 18, regulatoryDutyRate: 0, totalDuty: 0
        }
        setGD({ ...gd, items: [...gd.items, newItem] });
    };

    const handlePrint = () => {
        // Clone styles into standard print call via window.print()
        // In a real refined app, we might use an iframe or a specific CSS media print setup
        // For now we rely on tailwind's `print:` modifiers and global CSS adjustments
        window.print();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar - Hidden on Print */}
            <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-lg border print:hidden">
                <h2 className="text-xl font-bold text-gray-800">New Goods Declaration (GD)</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setGD(initialGD)}>Reset</Button>
                    <Button variant="default" onClick={() => toast({ title: "Saved", description: "GD Draft Saved Successfully" })}>
                        <Save className="h-4 w-4 mr-2" /> Save Draft
                    </Button>
                    <Button variant="secondary" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" /> Print GD
                    </Button>
                </div>
            </div>

            {/* The GD Form - Designed to look like the Paper Form */}
            <div ref={formRef} className="bg-white p-6 max-w-[210mm] mx-auto shadow-lg print:shadow-none print:p-0 print:m-0 border border-gray-300 print:border-none text-xs leading-none">
                <style>{`
                    @media print {
                        @page { size: A4 portrait; margin: 10mm; }
                        body { -webkit-print-color-adjust: exact; background: white; }
                        .print-hidden { display: none !important; }
                        input, select { border: none !important; background: transparent !important; padding: 0 !important; margin: 0 !important; height: auto !important; }
                        textarea { border: none !important; resize: none; overflow: hidden; }
                        .gd-box { border: 1px solid black; }
                        .gd-section { border-bottom: 2px solid black; margin-bottom: 4px; }
                        .gd-label { font-weight: bold; font-size: 9px; text-transform: uppercase; color: #444; margin-bottom: 2px; display: block; }
                        .gd-value { font-weight: 600; font-size: 11px; width: 100%; outline: none; }
                    }
                    /* Screen styles that mimic print structure */
                    .gd-grid { display: grid; border: 1px solid black; }
                    .gd-row { display: flex; border-bottom: 1px solid black; }
                    .gd-row:last-child { border-bottom: none; }
                    .gd-col { border-right: 1px solid black; padding: 4px; display: flex; flex-col; }
                    .gd-col:last-child { border-right: none; }
                    .gd-label { font-size: 9px; color: #666; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 2px; }
                    .gd-input { width: 100%; border: none; font-weight: 600; font-size: 11px; padding: 0; height: auto; background: transparent; }
                    .gd-input:focus { outline: none; background: #f0f9ff; }
                    .gd-header { background: #e5e5e5; text-align: center; font-weight: bold; padding: 2px; border-bottom: 1px solid black; print:bg-gray-300; }
                `}</style>

                {/* Header Section */}
                <div className="border-2 border-black mb-1">
                    <div className="flex bg-gray-100 border-b border-black p-2 justify-between items-center print:bg-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">PAKISTAN CUSTOMS SERVICE</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold">GOODS DECLARATION (GD)</div>
                            <div className="text-[10px]">(Under Customs Act, 1969)</div>
                        </div>
                    </div>

                    <div className="flex border-b border-black">
                        <div className="flex-1 p-1 border-r border-black field-group">
                            <label className="gd-label">Customs Station / Collectorate</label>
                            <input className="gd-input" value={`${gd.station} / ${gd.collectorate}`} onChange={(e) => setGD({ ...gd, station: e.target.value })} />
                        </div>
                        <div className="w-48 p-1 border-r border-black">
                            <label className="gd-label">GD Type</label>
                            <select className="gd-input" value={gd.gdType} onChange={(e) => setGD({ ...gd, gdType: e.target.value as GDType })}>
                                <option value="Import">Import</option>
                                <option value="Export">Export</option>
                                <option value="Transit">Afghan Transit</option>
                                <option value="Transshipment">Transshipment</option>
                            </select>
                        </div>
                        <div className="w-32 p-1 border-r border-black">
                            <label className="gd-label">WeBOC Ref</label>
                            <input className="gd-input text-center" value={gd.webocRef} readOnly />
                        </div>
                        <div className="w-32 p-1">
                            <label className="gd-label">Filing Date</label>
                            <input className="gd-input text-center" value={gd.filingDate} readOnly />
                        </div>
                    </div>

                    <div className="p-2 bg-black text-white text-center font-bold font-mono tracking-widest text-lg print:text-black print:bg-transparent print:border-b print:border-black">
                        {gd.gdNumber}
                    </div>
                </div>

                {/* Trader Info */}
                <div className="grid grid-cols-2 gap-0 border border-black mb-1">
                    <div className="border-r border-black">
                        <div className="bg-gray-100 text-center font-bold text-[10px] border-b border-black py-1">IMPORTER / EXPORTER</div>
                        <div className="p-1 border-b border-gray-300">
                            <div className="flex gap-2 mb-1">
                                <div className="flex-1">
                                    <label className="gd-label">NTN</label>
                                    <input className="gd-input" value={gd.ntn} onChange={e => setGD({ ...gd, ntn: e.target.value })} />
                                </div>
                                <div className="flex-1">
                                    <label className="gd-label">STRN</label>
                                    <input className="gd-input" value={gd.strn} onChange={e => setGD({ ...gd, strn: e.target.value })} />
                                </div>
                            </div>
                            <label className="gd-label">Name & Address</label>
                            <textarea className="gd-input h-10 w-full" rows={2} value={`${gd.traderName}\n${gd.address}`} onChange={e => { }} />
                        </div>
                        <div className="p-1">
                            <label className="gd-label">Contact (Phone / Email)</label>
                            <input className="gd-input" value={`${gd.phone} / ${gd.email}`} onChange={e => { }} />
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-100 text-center font-bold text-[10px] border-b border-black py-1">CLEARING AGENT</div>
                        <div className="p-1 h-full">
                            <label className="gd-label">Name</label>
                            <input className="gd-input mb-2" value={gd.agentName} onChange={e => setGD({ ...gd, agentName: e.target.value })} />

                            <label className="gd-label">License Number</label>
                            <input className="gd-input font-mono" value={gd.agentLicense} onChange={e => setGD({ ...gd, agentLicense: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* Logistics Info (Grid) */}
                <div className="border border-black mb-1">
                    <div className="flex border-b border-black">
                        <div className="flex-1 p-1 border-r border-black">
                            <label className="gd-label">BL / AWB No</label>
                            <input className="gd-input" value={gd.blNumber} onChange={e => setGD({ ...gd, blNumber: e.target.value })} />
                        </div>
                        <div className="flex-1 p-1 border-r border-black">
                            <label className="gd-label">{gd.gdNumber.includes("IM") ? "IGM No" : "EGM No"} / Date</label>
                            <input className="gd-input" value={gd.manifestNo} onChange={e => setGD({ ...gd, manifestNo: e.target.value })} />
                        </div>
                        <div className="flex-1 p-1 border-r border-black">
                            <label className="gd-label">Index No</label>
                            <input className="gd-input" value="12" />
                        </div>
                        <div className="flex-1 p-1">
                            <label className="gd-label">Country of Origin</label>
                            <input className="gd-input" value={gd.originCountry} onChange={e => setGD({ ...gd, originCountry: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-[2] p-1 border-r border-black">
                            <label className="gd-label">Vessel / Flight Information</label>
                            <input className="gd-input" value={gd.vessel} onChange={e => setGD({ ...gd, vessel: e.target.value })} />
                        </div>
                        <div className="flex-1 p-1 border-r border-black">
                            <label className="gd-label">Port of Loading</label>
                            <input className="gd-input" value={gd.portOfLoading} onChange={e => setGD({ ...gd, portOfLoading: e.target.value })} />
                        </div>
                        <div className="flex-1 p-1">
                            <label className="gd-label">Port of Discharge</label>
                            <input className="gd-input" value={gd.portOfDischarge} onChange={e => setGD({ ...gd, portOfDischarge: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* Goods Table */}
                <div className="border border-black mb-1">
                    <div className="bg-gray-800 text-white text-center font-bold text-[10px] py-1 print:bg-gray-300 print:text-black">DESCRIPTION OF GOODS</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse">
                            <thead className="text-[9px] bg-gray-100">
                                <tr>
                                    <th className="border border-black p-1 w-8">Item</th>
                                    <th className="border border-black p-1 w-20">HS Code</th>
                                    <th className="border border-black p-1 text-left">Description</th>
                                    <th className="border border-black p-1 w-12">Qty</th>
                                    <th className="border border-black p-1 w-12">Unit</th>
                                    <th className="border border-black p-1 w-16">Value ($)</th>
                                    <th className="border border-black p-1 w-20">Assessed Value (PKR)</th>
                                    <th className="border border-black p-1 w-10">CD %</th>
                                    <th className="border border-black p-1 w-10">ST %</th>
                                    <th className="border border-black p-1 w-20">Total Duty</th>
                                    <th className="border border-black p-1 w-6 print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {gd.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-black p-1">{item.itemNo}</td>
                                        <td className="border border-black p-0">
                                            <input className="gd-input text-center" value={item.hsCode} onChange={e => handleItemChange(idx, 'hsCode', e.target.value)} />
                                        </td>
                                        <td className="border border-black p-0">
                                            <textarea className="gd-input h-6 text-left px-1 pt-1" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} />
                                        </td>
                                        <td className="border border-black p-0">
                                            <input type="number" className="gd-input text-center" value={item.qty} onChange={e => handleItemChange(idx, 'qty', Number(e.target.value))} />
                                        </td>
                                        <td className="border border-black p-0">
                                            <input className="gd-input text-center" value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} />
                                        </td>
                                        <td className="border border-black p-0">
                                            <input type="number" className="gd-input text-center" value={item.declaredValue} onChange={e => handleItemChange(idx, 'declaredValue', Number(e.target.value))} />
                                        </td>
                                        <td className="border border-black p-0 bg-yellow-50 print:bg-white">
                                            <input type="number" className="gd-input text-center" value={item.assessableValue} onChange={e => handleItemChange(idx, 'assessableValue', Number(e.target.value))} />
                                        </td>
                                        <td className="border border-black p-0">
                                            <input type="number" className="gd-input text-center" value={item.customsDutyRate} onChange={e => handleItemChange(idx, 'customsDutyRate', Number(e.target.value))} />
                                        </td>
                                        <td className="border border-black p-0">
                                            <input type="number" className="gd-input text-center" value={item.salesTaxRate} onChange={e => handleItemChange(idx, 'salesTaxRate', Number(e.target.value))} />
                                        </td>
                                        <td className="border border-black p-1 text-right font-bold">
                                            {item.totalDuty.toLocaleString()}
                                        </td>
                                        <td className="border border-black p-0 print:hidden text-center">
                                            {gd.items.length > 1 && (
                                                <button onClick={() => {
                                                    const newItems = gd.items.filter((_, i) => i !== idx);
                                                    setGD({ ...gd, items: newItems });
                                                    updateCalculations(newItems);
                                                }}>
                                                    <Trash className="h-3 w-3 text-red-500 mx-auto" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-100 p-1 text-center print:hidden border-t border-black">
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                    </div>
                </div>

                {/* Footer Totals */}
                <div className="flex border border-black mb-1">
                    <div className="w-1/2 p-2 border-r border-black">
                        <div className="text-[10px] font-bold underline mb-1">EXAMINATION & ASSESSMENT</div>
                        <div className="flex mb-1">
                            <label className="w-24 font-bold">Assessment Status:</label>
                            <span>{gd.status}</span>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold">Appraising Officer Remarks:</label>
                            <textarea className="w-full bg-gray-50 border border-gray-200 p-1 h-12 text-[10px]" value={gd.examinerRemarks} readOnly />
                        </div>
                    </div>
                    <div className="w-1/2 p-0">
                        <div className="flex border-b border-black">
                            <div className="flex-1 p-1 text-right font-bold bg-gray-100">Total Customs Duty</div>
                            <div className="flex-1 p-1 text-right">{gd.totalCustomsDuty.toLocaleString()}</div>
                        </div>
                        <div className="flex border-b border-black">
                            <div className="flex-1 p-1 text-right font-bold bg-gray-100">Total Sales Tax</div>
                            <div className="flex-1 p-1 text-right">{gd.totalSalesTax.toLocaleString()}</div>
                        </div>
                        <div className="flex border-b border-black">
                            <div className="flex-1 p-1 text-right font-bold bg-gray-100">Regulatory Duty</div>
                            <div className="flex-1 p-1 text-right">{gd.totalRegulatoryDuty.toLocaleString()}</div>
                        </div>
                        <div className="flex bg-black text-white print:bg-gray-300 print:text-black">
                            <div className="flex-1 p-1 text-right font-bold">GRAND TOTAL PAYABLE</div>
                            <div className="flex-1 p-1 text-right font-bold text-lg">{gd.totalTaxes.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Declaration & Signature */}
                <div className="border border-black p-2 flex justify-between items-end min-h-[80px]">
                    <div className="text-[10px] max-w-md">
                        <strong>DECLARATION:</strong> I/We hereby declare that the particulars given in this Goods Declaration are true and correct to the best of my/our knowledge and belief. I/We also undertake to abide by the provisions of the Customs Act, 1969.
                    </div>
                    <div className="text-center">
                        <div className="border-b border-black w-40 mb-1"></div>
                        <div className="text-[9px] font-bold">Signature of Declarant / Agent</div>
                        <div className="text-[9px]">{gd.declarantName} ({gd.cnic})</div>
                    </div>
                </div>

                {/* Print Footer */}
                <div className="mt-2 text-[9px] flex justify-between text-gray-400 font-mono">
                    <span>Generated by Pak Route Wise System</span>
                    <span>Page 1 of 1</span>
                    <span>Printed: {new Date().toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default OfficialGDForm;
