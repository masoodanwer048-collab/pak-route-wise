import React, { useRef, useState } from "react";
import { GoodsDeclaration, GDItem, GDType, initialGD } from "@/types/customs-gd";
import { Button } from "@/components/ui/button";
import { Printer, Save, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OfficialGDForm = () => {
    const [gd, setGD] = useState<GoodsDeclaration>(initialGD);
    const formRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // -- Calculators --
    const calculateDuties = (item: GDItem): GDItem => {
        const cd = Math.round((item.assessableValue * item.customsDutyRate) / 100);
        const rd = Math.round((item.assessableValue * item.regulatoryDutyRate) / 100);
        const st = Math.round(((item.assessableValue + cd + rd) * item.salesTaxRate) / 100);

        return {
            ...item,
            totalDuty: cd + rd + st
        };
    };

    const updateCalculations = (items: GDItem[]) => {
        const totalCD = items.reduce((sum, i) => sum + Math.round((i.assessableValue * i.customsDutyRate) / 100), 0);
        const totalRD = items.reduce((sum, i) => sum + Math.round((i.assessableValue * i.regulatoryDutyRate) / 100), 0);
        const totalST = items.reduce((sum, i) => {
            const base = i.assessableValue + Math.round((i.assessableValue * i.customsDutyRate) / 100) + Math.round((i.assessableValue * i.regulatoryDutyRate) / 100);
            return sum + Math.round((base * i.salesTaxRate) / 100);
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

        if (["assessableValue", "customsDutyRate", "salesTaxRate", "regulatoryDutyRate"].includes(field)) {
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
        window.print();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar - Hidden on Print */}
            <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-lg border print:hidden">
                <h2 className="text-xl font-bold text-gray-800">Goods Declaration (GD)</h2>
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

            {/* The GD Form */}
            <div ref={formRef} className="bg-white p-2 mx-auto shadow-lg print:shadow-none print:p-0 print:m-0 border border-gray-300 print:border-none text-xs leading-none max-w-[210mm]">
                <style>{`
                    @media print {
                        @page { size: A4 portrait; margin: 10mm; }
                        body { -webkit-print-color-adjust: exact; background: white; }
                        .print-hidden { display: none !important; }
                        input, select, textarea { border: none !important; background: transparent !important; resize: none; }
                        .gd-box { border: 1px solid black; }
                    }
                    .gd-section { border: 1px solid black; margin-bottom: -1px; }
                    .gd-cell { border-right: 1px solid black; padding: 2px; }
                    .gd-cell:last-child { border-right: none; }
                    .gd-row { border-bottom: 1px solid black; display: flex; }
                    .gd-row:last-child { border-bottom: none; }
                    .gd-label { font-size: 9px; font-weight: bold; color: #444; display: block; margin-bottom: 1px; }
                    .gd-input { width: 100%; font-size: 11px; font-weight: 500; outline: none; background: transparent; padding: 0; }
                    .gd-input:focus { background: #f0fdf4; }
                `}</style>

                {/* 1. Header Section */}
                <div className="gd-section flex">
                    <div className="w-2/3 border-r border-black p-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-lg font-bold">GOODS DECLARATION (GD)</h1>
                                <p className="text-[10px] italic">Under Customs Act, 1969</p>
                            </div>
                            <div className="text-right">
                                <div className="gd-label">Customs Ref (WeBOC)</div>
                                <div className="font-mono text-sm font-bold">{gd.webocRef}</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 p-2 bg-gray-50">
                        <div className="mb-2">
                            <label className="gd-label">1. GD Type</label>
                            <select className="gd-input font-bold" value={gd.gdType} onChange={e => setGD({ ...gd, gdType: e.target.value as GDType })}>
                                <option value="Import">IMP (Import)</option>
                                <option value="Export">EXP (Export)</option>
                                <option value="Transit">TRANSIT</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="gd-label">2. GD No</label>
                                <input className="gd-input font-bold" value={gd.gdNumber} onChange={e => setGD({ ...gd, gdNumber: e.target.value })} />
                            </div>
                            <div className="w-1/3">
                                <label className="gd-label">3. Date</label>
                                <input className="gd-input" value={gd.filingDate} onChange={e => setGD({ ...gd, filingDate: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Parties */}
                <div className="gd-section flex">
                    <div className="w-1/2 border-r border-black">
                        <div className="gd-row">
                            <div className="p-1 w-full relative">
                                <span className="absolute top-1 right-1 text-[9px] font-bold border border-black px-1 rounded">Exporter</span>
                                <label className="gd-label">4. Exporter / Consignor</label>
                                <input className="gd-input font-bold" value={gd.exporterName} onChange={e => setGD({ ...gd, exporterName: e.target.value })} placeholder="Name" />
                                <textarea className="gd-input h-8" value={gd.exporterAddress} onChange={e => setGD({ ...gd, exporterAddress: e.target.value })} placeholder="Address" />
                            </div>
                        </div>
                        <div className="p-1 w-full relative">
                            <span className="absolute top-1 right-1 text-[9px] font-bold border border-black px-1 rounded">Importer</span>
                            <label className="gd-label">5. Importer / Consignee</label>
                            <input className="gd-input font-bold" value={gd.importerName} onChange={e => setGD({ ...gd, importerName: e.target.value })} placeholder="Name" />
                            <textarea className="gd-input h-8" value={gd.importerAddress} onChange={e => setGD({ ...gd, importerAddress: e.target.value })} placeholder="Address" />
                            <div className="flex gap-2 mt-1">
                                <div className="flex-1">
                                    <label className="gd-label">NTN / ID</label>
                                    <input className="gd-input font-mono" value={gd.ntn} onChange={e => setGD({ ...gd, ntn: e.target.value })} />
                                </div>
                                <div className="flex-1">
                                    <label className="gd-label">STRN</label>
                                    <input className="gd-input font-mono" value={gd.strn} onChange={e => setGD({ ...gd, strn: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="gd-row">
                            <div className="p-1 w-full h-full">
                                <label className="gd-label">6. Declarant / Agent</label>
                                <input className="gd-input font-bold" value={gd.agentName} onChange={e => setGD({ ...gd, agentName: e.target.value })} />
                                <textarea className="gd-input h-8" value={gd.agentAddress} onChange={e => setGD({ ...gd, agentAddress: e.target.value })} />
                                <div className="flex gap-2 mt-1">
                                    <div className="flex-1">
                                        <label className="gd-label">7. CHAL No</label>
                                        <input className="gd-input font-mono" value={gd.chalNo} onChange={e => setGD({ ...gd, chalNo: e.target.value })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="gd-label">8. Pages</label>
                                        <input className="gd-input" value={gd.pages} onChange={e => setGD({ ...gd, pages: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-1">
                            <label className="gd-label">Customs Station</label>
                            <input className="gd-input" value={gd.station} onChange={e => setGD({ ...gd, station: e.target.value })} />
                            <label className="gd-label mt-1">Collectorate</label>
                            <input className="gd-input" value={gd.collectorate} onChange={e => setGD({ ...gd, collectorate: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* 3. Shipment Details */}
                <div className="bg-gray-100 border border-black border-b-0 text-center font-bold text-[10px] py-1">SHIPMENT DETAILS</div>
                <div className="gd-section grid grid-cols-4">
                    <div className="gd-cell">
                        <label className="gd-label">9. Country of Origin</label>
                        <input className="gd-input" value={gd.countryOfOrigin} onChange={e => setGD({ ...gd, countryOfOrigin: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">10. Country of Consignment</label>
                        <input className="gd-input" value={gd.countryOfConsignment} onChange={e => setGD({ ...gd, countryOfConsignment: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">11. Port of Shipment</label>
                        <input className="gd-input" value={gd.portOfShipment} onChange={e => setGD({ ...gd, portOfShipment: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">12. Port of Discharge</label>
                        <input className="gd-input" value={gd.portOfDischarge} onChange={e => setGD({ ...gd, portOfDischarge: e.target.value })} />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-4">
                    <div className="gd-cell">
                        <label className="gd-label">13. Mode of Transport</label>
                        <select className="gd-input" value={gd.modeOfTransport} onChange={e => setGD({ ...gd, modeOfTransport: e.target.value })}>
                            <option>Sea</option><option>Air</option><option>Land</option><option>Rail</option>
                        </select>
                    </div>
                    <div className="gd-cell col-span-2">
                        <label className="gd-label">14. Identity of Transport (Vessel/Flight)</label>
                        <input className="gd-input font-bold" value={gd.identityOfTransport} onChange={e => setGD({ ...gd, identityOfTransport: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">Rotation / Voyage No</label>
                        <input className="gd-input" value="V.22" />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-5">
                    <div className="gd-cell">
                        <label className="gd-label">15. B/L or AWB No.</label>
                        <input className="gd-input font-mono" value={gd.blNumber} onChange={e => setGD({ ...gd, blNumber: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">16. Date</label>
                        <input className="gd-input type=date" value={gd.blDate} onChange={e => setGD({ ...gd, blDate: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">17. IGM No.</label>
                        <input className="gd-input" value={gd.igmNo} onChange={e => setGD({ ...gd, igmNo: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">18. IGM Date</label>
                        <input className="gd-input type=date" value={gd.igmDate} onChange={e => setGD({ ...gd, igmDate: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">19. Index No.</label>
                        <input className="gd-input" value={gd.indexNo} onChange={e => setGD({ ...gd, indexNo: e.target.value })} />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-5">
                    <div className="gd-cell">
                        <label className="gd-label">20. Gross Weight (kg)</label>
                        <input className="gd-input text-right" type="number" value={gd.grossWeight} onChange={e => setGD({ ...gd, grossWeight: Number(e.target.value) })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">21. Net Weight (kg)</label>
                        <input className="gd-input text-right" type="number" value={gd.netWeight} onChange={e => setGD({ ...gd, netWeight: Number(e.target.value) })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">22. Packages</label>
                        <input className="gd-input" value={`${gd.packagesNo} ${gd.packagesKind}`} onChange={e => { }} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">23. Marks & Numbers</label>
                        <input className="gd-input" value={gd.marksAndNumbers} onChange={e => setGD({ ...gd, marksAndNumbers: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">24. Location</label>
                        <input className="gd-input" value={gd.locationOfGoods} onChange={e => setGD({ ...gd, locationOfGoods: e.target.value })} />
                    </div>
                </div>

                {/* 4. Valuation Details */}
                <div className="bg-gray-100 border border-black border-b-0 text-center font-bold text-[10px] py-1">VALUATION DETAILS (CALCULATION OF CUSTOMS VALUE)</div>
                <div className="gd-section grid grid-cols-5">
                    <div className="gd-cell">
                        <label className="gd-label">25. Delivery Terms</label>
                        <input className="gd-input font-bold" value={gd.deliveryTerm} onChange={e => setGD({ ...gd, deliveryTerm: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">26. Currency Code</label>
                        <input className="gd-input text-center" value={gd.currencyCode} onChange={e => setGD({ ...gd, currencyCode: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">27. Exchange Rate</label>
                        <input className="gd-input text-right" type="number" value={gd.exchangeRate} onChange={e => setGD({ ...gd, exchangeRate: Number(e.target.value) })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">28. Invoice No.</label>
                        <input className="gd-input" value={gd.invoiceNo} onChange={e => setGD({ ...gd, invoiceNo: e.target.value })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">29. Invoice Date</label>
                        <input className="gd-input" value={gd.invoiceDate} onChange={e => setGD({ ...gd, invoiceDate: e.target.value })} />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-6 bg-gray-50">
                    <div className="gd-cell">
                        <label className="gd-label">30. FOB Value ($)</label>
                        <input className="gd-input text-right" type="number" value={gd.fobValue} onChange={e => setGD({ ...gd, fobValue: Number(e.target.value) })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">31. Freight ($)</label>
                        <input className="gd-input text-right" type="number" value={gd.freight} onChange={e => setGD({ ...gd, freight: Number(e.target.value) })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">32. Insurance ($)</label>
                        <input className="gd-input text-right" type="number" value={gd.insurance} onChange={e => setGD({ ...gd, insurance: Number(e.target.value) })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">33. Other Charges</label>
                        <input className="gd-input text-right" type="number" value={gd.otherCharges} onChange={e => setGD({ ...gd, otherCharges: Number(e.target.value) })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">34. Landing (1%)</label>
                        <input className="gd-input text-right" type="number" value={gd.landingCharges} readOnly />
                    </div>
                    <div className="gd-cell bg-gray-100">
                        <label className="gd-label">35. Total Declared Value (PKR)</label>
                        <input className="gd-input text-right font-bold" type="number" value={gd.totalDeclaredValue} readOnly />
                    </div>
                </div>

                {/* 5. Item Declaration */}
                <div className="bg-gray-800 text-white text-center font-bold text-[10px] py-1 mt-1 print:bg-black">ITEM DECLARATION</div>
                <div className="border-x border-b border-black">
                    <table className="w-full text-[10px] text-center">
                        <thead className="bg-gray-100 font-bold border-b border-black">
                            <tr>
                                <th className="border-r border-black p-1 w-8">Item</th>
                                <th className="border-r border-black p-1 w-20">HS Code</th>
                                <th className="border-r border-black p-1 text-left">Description</th>
                                <th className="border-r border-black p-1 w-12">Qty</th>
                                <th className="border-r border-black p-1 w-10">Unit</th>
                                <th className="border-r border-black p-1 w-16">Unit Price</th>
                                <th className="border-r border-black p-1 w-20">Assessed Value</th>
                                <th className="border-r border-black p-1 w-10">CD%</th>
                                <th className="border-r border-black p-1 w-10">ST%</th>
                                <th className="border-r border-black p-1 w-20">Total Duty</th>
                                <th className="p-1 w-8 print:hidden"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {gd.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-300 last:border-none hover:bg-gray-50">
                                    <td className="border-r border-black p-1">{item.itemNo}</td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-center" value={item.hsCode} onChange={e => handleItemChange(idx, 'hsCode', e.target.value)} /></td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-left px-1" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} /></td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-center" type="number" value={item.qty} onChange={e => handleItemChange(idx, 'qty', Number(e.target.value))} /></td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-center" value={item.uom} onChange={e => handleItemChange(idx, 'uom', e.target.value)} /></td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-center" type="number" value={Math.round(item.declaredValue / item.qty)} readOnly /></td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-center bg-yellow-50" type="number" value={item.assessableValue} onChange={e => handleItemChange(idx, 'assessableValue', Number(e.target.value))} /></td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-center" type="number" value={item.customsDutyRate} onChange={e => handleItemChange(idx, 'customsDutyRate', Number(e.target.value))} /></td>
                                    <td className="border-r border-black p-0"><input className="gd-input text-center" type="number" value={item.salesTaxRate} onChange={e => handleItemChange(idx, 'salesTaxRate', Number(e.target.value))} /></td>
                                    <td className="border-r border-black p-1 text-right font-bold">{item.totalDuty.toLocaleString()}</td>
                                    <td className="print:hidden"><button onClick={() => {
                                        const n = gd.items.filter((_, i) => i !== idx);
                                        setGD({ ...gd, items: n });
                                        updateCalculations(n);
                                    }}><Trash className="h-3 w-3 text-red-500" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bg-gray-100 p-1 text-center print:hidden border-t border-black">
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                    </div>
                </div>

                {/* 6. Footer Totals */}
                <div className="gd-section flex">
                    <div className="w-1/2 p-2 border-r border-black">
                        <div className="font-bold border-b border-black mb-1">Assessment Summary</div>
                        <div className="flex justify-between text-[11px] mb-1">
                            <span>Status:</span>
                            <span className="font-bold uppercase">{gd.status}</span>
                        </div>
                        <div className="flex justify-between text-[11px] mb-1">
                            <span>Assessed By:</span>
                            <span>System</span>
                        </div>
                        <label className="gd-label mt-2">Examiner Remarks</label>
                        <textarea className="w-full bg-gray-50 border border-gray-200 p-1 h-12 text-[10px]" value={gd.examinerRemarks} readOnly />
                    </div>
                    <div className="w-1/2 bg-gray-50">
                        <table className="w-full text-right text-[11px]">
                            <tbody>
                                <tr><td className="p-1 border-b border-gray-300">Customs Duty</td><td className="p-1 font-bold border-b border-gray-300">{gd.totalCustomsDuty.toLocaleString()}</td></tr>
                                <tr><td className="p-1 border-b border-gray-300">Regulatory Duty</td><td className="p-1 font-bold border-b border-gray-300">{gd.totalRegulatoryDuty.toLocaleString()}</td></tr>
                                <tr><td className="p-1 border-b border-gray-300">Sales Tax</td><td className="p-1 font-bold border-b border-gray-300">{gd.totalSalesTax.toLocaleString()}</td></tr>
                                <tr><td className="p-1 border-b border-gray-300">Detailed Taxes (IT/ACD)</td><td className="p-1 font-bold border-b border-gray-300">0</td></tr>
                                <tr className="bg-black text-white print:text-black print:bg-transparent print:border-t print:border-black">
                                    <td className="p-2 font-bold text-sm">TOTAL PAYABLE</td>
                                    <td className="p-2 font-bold text-sm">{gd.totalTaxes.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 7. Declaration */}
                <div className="gd-section p-2 flex justify-between items-end min-h-[100px]">
                    <div className="text-[10px] w-2/3 pr-4">
                        <h4 className="font-bold underline mb-1">DECLARATION</h4>
                        <p>I/We hereby declare that the particulars given above are true and correct to the best of my/our knowledge and belief. I/We also undertake to abide by the provisions of the Customs Act, 1969 and applicable SROs.</p>
                    </div>
                    <div className="text-center w-1/3">
                        <div className="border-b-2 border-black mb-1 w-3/4 mx-auto"></div>
                        <div className="gd-label">Signature of Declarant / Agent</div>
                        <div className="font-bold">{gd.declarantName}</div>
                        <div className="text-[9px] font-mono">{gd.cnic}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialGDForm;
