import React, { useRef, useState, useEffect } from "react";
import { GoodsDeclaration, GDItem, GDType, initialGD } from "@/types/customs-gd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Save, Plus, Trash, Edit, Eye, Check, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import * as XLSX from 'xlsx';

interface OfficialGDFormProps {
    initialData?: GoodsDeclaration | null;
    onSaveSuccess?: () => void;
}

const OfficialGDForm = ({ initialData, onSaveSuccess }: OfficialGDFormProps) => {
    const [gd, setGD] = useState<GoodsDeclaration>(initialGD);
    const [isEditMode, setIsEditMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (initialData) {
            setGD(initialData);
            setIsEditMode(false); // Default to view mode for existing
        } else {
            setGD(initialGD);
            setIsEditMode(true); // Default to edit mode for new
        }
    }, [initialData]);

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
        if (!isEditMode) return;
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

    const removeItem = (index: number) => {
        const newItems = gd.items.filter((_, i) => i !== index);
        setGD({ ...gd, items: newItems });
        updateCalculations(newItems);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = () => {
        // Flatten the data for Excel
        const flatData = [
            { Field: "GD Number", Value: gd.gdNumber },
            { Field: "GD Type", Value: gd.gdType },
            { Field: "Status", Value: gd.status },
            { Field: "Filing Date", Value: gd.filingDate },
            { Field: "WeBOC Ref", Value: gd.webocRef },
            { Field: "Customs Station", Value: gd.station },
            { Field: "Collectorate", Value: gd.collectorate },
            { Field: "Exporter Name", Value: gd.exporterName },
            { Field: "Exporter Address", Value: gd.exporterAddress },
            { Field: "Importer Name", Value: gd.importerName },
            { Field: "Importer Address", Value: gd.importerAddress },
            { Field: "NTN", Value: gd.ntn },
            { Field: "STRN", Value: gd.strn },
            { Field: "Agent Name", Value: gd.agentName },
            { Field: "Agent Address", Value: gd.agentAddress },
            { Field: "CHAL No", Value: gd.chalNo },
            { Field: "Pages", Value: gd.pages },
            { Field: "Country of Origin", Value: gd.countryOfOrigin },
            { Field: "Country of Consignment", Value: gd.countryOfConsignment },
            { Field: "Port of Shipment", Value: gd.portOfShipment },
            { Field: "Port of Discharge", Value: gd.portOfDischarge },
            { Field: "Mode of Transport", Value: gd.modeOfTransport },
            { Field: "Identity of Transport", Value: gd.identityOfTransport },
            { Field: "Rotation No", Value: gd.rotationNo },
            { Field: "BL Number", Value: gd.blNumber },
            { Field: "BL Date", Value: gd.blDate },
            { Field: "IGM No", Value: gd.igmNo },
            { Field: "IGM Date", Value: gd.igmDate },
            { Field: "Index No", Value: gd.indexNo },
            { Field: "Gross Weight", Value: gd.grossWeight },
            { Field: "Net Weight", Value: gd.netWeight },
            { Field: "Packages No", Value: gd.packagesNo },
            { Field: "Packages Kind", Value: gd.packagesKind },
            { Field: "Marks & Numbers", Value: gd.marksAndNumbers },
            { Field: "Location", Value: gd.locationOfGoods },
            { Field: "Delivery Term", Value: gd.deliveryTerm },
            { Field: "Currency", Value: gd.currencyCode },
            { Field: "Exchange Rate", Value: gd.exchangeRate },
            { Field: "Invoice No", Value: gd.invoiceNo },
            { Field: "Invoice Date", Value: gd.invoiceDate },
            { Field: "FOB Value", Value: gd.fobValue },
            { Field: "Freight", Value: gd.freight },
            { Field: "Insurance", Value: gd.insurance },
            { Field: "Other Charges", Value: gd.otherCharges },
            { Field: "Landing Charges", Value: gd.landingCharges },
            { Field: "Total Declared Value", Value: gd.totalDeclaredValue },
            { Field: "Total Customs Duty", Value: gd.totalCustomsDuty },
            { Field: "Total Sales Tax", Value: gd.totalSalesTax },
            { Field: "Total Regulatory Duty", Value: gd.totalRegulatoryDuty },
            { Field: "Total Taxes", Value: gd.totalTaxes },
            { Field: "Declarant Name", Value: gd.declarantName },
            { Field: "Declarant CNIC", Value: gd.cnic },
        ];

        const itemData = gd.items.map(item => ({
            "Item No": item.itemNo,
            "HS Code": item.hsCode,
            "Description": item.description,
            "Qty": item.qty,
            "UOM": item.uom,
            "Declared Value": item.declaredValue,
            "Assessable Value": item.assessableValue,
            "CD Rate": item.customsDutyRate,
            "ST Rate": item.salesTaxRate,
            "RD Rate": item.regulatoryDutyRate,
            "Total Duty": item.totalDuty
        }));

        const wb = XLSX.utils.book_new();
        const wsMain = XLSX.utils.json_to_sheet(flatData);
        const wsItems = XLSX.utils.json_to_sheet(itemData);

        XLSX.utils.book_append_sheet(wb, wsMain, "GD Details");
        XLSX.utils.book_append_sheet(wb, wsItems, "Items");

        XLSX.writeFile(wb, `GD_${gd.gdNumber || 'Draft'}.xlsx`);
        toast({ title: "Exported", description: "GD exported to Excel successfully." });
    };

    const handleSave = async (isSubmit: boolean = false) => {
        setIsLoading(true);
        try {
            // Define the whitelist of known columns in DB
            const knownColumns = [
                'id', 'created_at', 'updated_at',
                'gd_number', 'gd_type', 'status', 'filing_date',
                'weboc_ref', 'customs_station', 'collectorate',
                'exporter', 'importer', 'agent',
                'pages',
                'shipment_details', 'cargo_details', 'valuation_details', 'items',
                'total_customs_duty', 'total_sales_tax', 'total_regulatory_duty', 'total_taxes',
                'examiner_remarks', 'declarant_name', 'declarant_cnic',
                'extra_data' // The safety net
            ];

            // Initial payload with all intended data
            const rawPayload: any = {
                gd_number: gd.gdNumber,
                gd_type: gd.gdType.toLowerCase(), // Convert to lowercase to match potential enum
                status: isSubmit ? 'submitted' : 'draft', // Lowercase status enum
                filing_date: gd.filingDate,
                // weboc_ref: gd.webocRef, // DISABLED AGAIN: Schema cache is not updating.
                customs_station: gd.station,
                // collectorate: gd.collectorate, // DISABLED AGAIN: Schema cache is not updating.

                // Use explicit column names that match DB schema
                exporter: { name: gd.exporterName, address: gd.exporterAddress },
                importer: { name: gd.importerName, address: gd.importerAddress, ntn: gd.ntn, strn: gd.strn },
                agent: { name: gd.agentName, address: gd.agentAddress, chal_no: gd.chalNo },

                pages: gd.pages,

                shipment_details: {
                    country_of_origin: gd.countryOfOrigin,
                    country_of_consignment: gd.countryOfConsignment,
                    port_of_shipment: gd.portOfShipment,
                    port_of_discharge: gd.portOfDischarge,
                    mode_of_transport: gd.modeOfTransport,
                    identity_of_transport: gd.identityOfTransport,
                    rotation_no: gd.rotationNo,
                    bl_number: gd.blNumber,
                    bl_date: gd.blDate,
                    igm_no: gd.igmNo,
                    igm_date: gd.igmDate,
                    index_no: gd.indexNo
                },

                cargo_details: {
                    gross_weight: gd.grossWeight,
                    net_weight: gd.netWeight,
                    packages_no: gd.packagesNo,
                    packages_kind: gd.packagesKind,
                    marks: gd.marksAndNumbers,
                    location: gd.locationOfGoods
                },

                valuation_details: {
                    delivery_term: gd.deliveryTerm,
                    currency: gd.currencyCode,
                    exchange_rate: gd.exchangeRate,
                    invoice_no: gd.invoiceNo,
                    invoice_date: gd.invoiceDate,
                    fob_value: gd.fobValue,
                    freight: gd.freight,
                    insurance: gd.insurance,
                    other_charges: gd.otherCharges,
                    landing_charges: gd.landingCharges,
                    total_declared_value: gd.totalDeclaredValue
                },

                items: gd.items,

                total_customs_duty: gd.totalCustomsDuty,
                total_sales_tax: gd.totalSalesTax,
                total_regulatory_duty: gd.totalRegulatoryDuty,
                total_taxes: gd.totalTaxes,

                examiner_remarks: gd.examinerRemarks,
                declarant_name: gd.declarantName,
                declarant_cnic: gd.cnic
            };

            // Payload Sanitizer: Move unknown keys to 'extra_data'
            const finalPayload: any = { extra_data: {} };

            Object.keys(rawPayload).forEach(key => {
                if (knownColumns.includes(key)) {
                    finalPayload[key] = rawPayload[key];
                } else {
                    console.warn(`Field '${key}' not in DB schema, moving to extra_data.`);
                    finalPayload.extra_data[key] = rawPayload[key];
                }
            });

            // Clean up undefined
            Object.keys(finalPayload).forEach(key => finalPayload[key] === undefined && delete finalPayload[key]);

            console.log("Sanitized Payload:", finalPayload);

            const { error } = await supabase.from('goods_declarations').insert(finalPayload);

            if (error) throw error;

            toast({
                title: isSubmit ? "GD Submitted" : "Draft Saved",
                description: "Goods Declaration saved successfully."
            });

            setIsEditMode(false);
            if (onSaveSuccess) onSaveSuccess();

        } catch (error: any) {
            console.error("Error saving GD:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to save GD"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = ({
        value,
        onChange,
        className = "",
        type = "text",
        placeholder = "",
        readOnly = false
    }: {
        value: any,
        onChange?: (val: string) => void,
        className?: string,
        type?: string,
        placeholder?: string,
        readOnly?: boolean
    }) => {
        if (!isEditMode) {
            return <div className={`gd-input truncate ${className} px-1 py-0.5`}>{value}</div>;
        }
        return (
            <input
                className={`gd-input ${className}`}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
            />
        );
    };

    return (
        <div className="space-y-4">
            {/* Toolbar - Hidden on Print */}
            <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-lg border print:hidden">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800">Goods Declaration (GD)</h2>
                    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                        <Button
                            variant={isEditMode ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setIsEditMode(false)}
                            className={!isEditMode ? "bg-white shadow-sm" : ""}
                        >
                            <Eye className="h-4 w-4 mr-2" /> View
                        </Button>
                        <Button
                            variant={isEditMode ? "ghost" : "secondary"}
                            size="sm"
                            onClick={() => setIsEditMode(true)}
                            className={isEditMode ? "bg-white shadow-sm" : ""}
                        >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                    </div>
                </div>
                <div className="flex gap-2">
                    {isEditMode && (
                        <>
                            <Button variant="outline" onClick={() => setGD(initialGD)}>Reset</Button>
                            <Button variant="default" onClick={() => handleSave(false)} disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" /> Save Draft
                            </Button>
                            <Button variant="accent" onClick={() => handleSave(true)} disabled={isLoading}>
                                <Check className="h-4 w-4 mr-2" /> Submit GD
                            </Button>
                        </>
                    )}
                    <Button variant="outline" onClick={handleExportExcel}>
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" /> Excel
                    </Button>
                    <Button variant="secondary" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" /> Print / PDF
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
                        input, select, textarea { border: none !important; background: transparent !important; resize: none; appearance: none; }
                        .gd-box { border: 1px solid black; }
                    }
                    .gd-section { border: 1px solid black; margin-bottom: -1px; }
                    .gd-cell { border-right: 1px solid black; padding: 2px; }
                    .gd-cell:last-child { border-right: none; }
                    .gd-row { border-bottom: 1px solid black; display: flex; }
                    .gd-row:last-child { border-bottom: none; }
                    .gd-label { font-size: 9px; font-weight: bold; color: #444; display: block; margin-bottom: 1px; }
                    .gd-input { width: 100%; font-size: 11px; font-weight: 500; outline: none; background: transparent; padding: 2px; border-radius: 2px; }
                    .gd-input:focus { background: #f0fdf4; }
                    .gd-input[readonly] { background: transparent; }
                `}</style>

                {/* Logo Section - Visible in Print & View */}
                <div className="flex flex-col items-center justify-center mb-4 pt-2">
                    {/* <img src="/kohesar_logo.png" alt="Kohsar Logistics" className="h-16 object-contain mb-1" onError={(e) => (e.currentTarget.style.display = 'none')} /> */}
                    {/* <h2 className="text-lg font-bold text-black hidden print:block">KOHSAR LOGISTICS (PRIVATE) LIMITED</h2> */}
                    <p className="text-[10px] italic text-gray-600 hidden print:block">KEEP THE LORD ON THE ROAD</p>
                </div>

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
                                <InputField value={gd.webocRef} onChange={v => setGD({ ...gd, webocRef: v })} className="font-mono text-sm font-bold text-right" />
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 p-2 bg-gray-50">
                        <div className="mb-2">
                            <label className="gd-label">1. GD Type</label>
                            {isEditMode ? (
                                <select className="gd-input font-bold" value={gd.gdType} onChange={e => setGD({ ...gd, gdType: e.target.value as GDType })}>
                                    <option value="Import">IMP (Import)</option>
                                    <option value="Export">EXP (Export)</option>
                                    <option value="Transit">TRANSIT</option>
                                </select>
                            ) : (
                                <div className="gd-input font-bold">{gd.gdType}</div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="gd-label">2. GD No</label>
                                <InputField value={gd.gdNumber} onChange={v => setGD({ ...gd, gdNumber: v })} className="font-bold" />
                            </div>
                            <div className="w-1/3">
                                <label className="gd-label">3. Date</label>
                                <InputField value={gd.filingDate} onChange={v => setGD({ ...gd, filingDate: v })} />
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
                                <InputField value={gd.exporterName} onChange={v => setGD({ ...gd, exporterName: v })} className="font-bold" placeholder="Name" />
                                <InputField value={gd.exporterAddress} onChange={v => setGD({ ...gd, exporterAddress: v })} placeholder="Address" />
                            </div>
                        </div>
                        <div className="p-1 w-full relative">
                            <span className="absolute top-1 right-1 text-[9px] font-bold border border-black px-1 rounded">Importer</span>
                            <label className="gd-label">5. Importer / Consignee</label>
                            <InputField value={gd.importerName} onChange={v => setGD({ ...gd, importerName: v })} className="font-bold" placeholder="Name" />
                            <InputField value={gd.importerAddress} onChange={v => setGD({ ...gd, importerAddress: v })} placeholder="Address" />
                            <div className="flex gap-2 mt-1">
                                <div className="flex-1">
                                    <label className="gd-label">NTN / ID</label>
                                    <InputField value={gd.ntn} onChange={v => setGD({ ...gd, ntn: v })} className="font-mono" />
                                </div>
                                <div className="flex-1">
                                    <label className="gd-label">STRN</label>
                                    <InputField value={gd.strn} onChange={v => setGD({ ...gd, strn: v })} className="font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="gd-row">
                            <div className="p-1 w-full h-full">
                                <label className="gd-label">6. Declarant / Agent</label>
                                <InputField value={gd.agentName} onChange={v => setGD({ ...gd, agentName: v })} className="font-bold" />
                                <InputField value={gd.agentAddress} onChange={v => setGD({ ...gd, agentAddress: v })} />
                                <div className="flex gap-2 mt-1">
                                    <div className="flex-1">
                                        <label className="gd-label">7. CHAL No</label>
                                        <InputField value={gd.chalNo} onChange={v => setGD({ ...gd, chalNo: v })} className="font-mono" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="gd-label">8. Pages</label>
                                        <InputField value={gd.pages} onChange={v => setGD({ ...gd, pages: v })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-1">
                            <label className="gd-label">Customs Station</label>
                            <InputField value={gd.station} onChange={v => setGD({ ...gd, station: v })} />
                            <label className="gd-label mt-1">Collectorate</label>
                            <InputField value={gd.collectorate} onChange={v => setGD({ ...gd, collectorate: v })} />
                        </div>
                    </div>
                </div>

                {/* 3. Shipment Details */}
                <div className="bg-gray-100 border border-black border-b-0 text-center font-bold text-[10px] py-1">SHIPMENT DETAILS</div>
                <div className="gd-section grid grid-cols-4">
                    <div className="gd-cell">
                        <label className="gd-label">9. Country of Origin</label>
                        <InputField value={gd.countryOfOrigin} onChange={v => setGD({ ...gd, countryOfOrigin: v })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">10. Country of Consignment</label>
                        <InputField value={gd.countryOfConsignment} onChange={v => setGD({ ...gd, countryOfConsignment: v })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">11. Port of Shipment</label>
                        <InputField value={gd.portOfShipment} onChange={v => setGD({ ...gd, portOfShipment: v })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">12. Port of Discharge</label>
                        <InputField value={gd.portOfDischarge} onChange={v => setGD({ ...gd, portOfDischarge: v })} />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-4">
                    <div className="gd-cell">
                        <label className="gd-label">13. Mode of Transport</label>
                        {isEditMode ? (
                            <select className="gd-input" value={gd.modeOfTransport} onChange={e => setGD({ ...gd, modeOfTransport: e.target.value })}>
                                <option>Sea</option><option>Air</option><option>Land</option><option>Rail</option>
                            </select>
                        ) : (
                            <div className="gd-input">{gd.modeOfTransport}</div>
                        )}
                    </div>
                    <div className="gd-cell col-span-2">
                        <label className="gd-label">14. Identity of Transport (Vessel/Flight)</label>
                        <InputField value={gd.identityOfTransport} onChange={v => setGD({ ...gd, identityOfTransport: v })} className="font-bold" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">Rotation / Voyage No</label>
                        <InputField value={gd.rotationNo} onChange={v => setGD({ ...gd, rotationNo: v })} />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-5">
                    <div className="gd-cell">
                        <label className="gd-label">15. B/L or AWB No.</label>
                        <InputField value={gd.blNumber} onChange={v => setGD({ ...gd, blNumber: v })} className="font-mono" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">16. Date</label>
                        <InputField value={gd.blDate} onChange={v => setGD({ ...gd, blDate: v })} type="date" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">17. IGM No.</label>
                        <InputField value={gd.igmNo} onChange={v => setGD({ ...gd, igmNo: v })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">18. IGM Date</label>
                        <InputField value={gd.igmDate} onChange={v => setGD({ ...gd, igmDate: v })} type="date" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">19. Index No.</label>
                        <InputField value={gd.indexNo} onChange={v => setGD({ ...gd, indexNo: v })} />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-5">
                    <div className="gd-cell">
                        <label className="gd-label">20. Gross Weight (kg)</label>
                        <InputField value={gd.grossWeight} onChange={v => setGD({ ...gd, grossWeight: Number(v) })} type="number" className="text-right" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">21. Net Weight (kg)</label>
                        <InputField value={gd.netWeight} onChange={v => setGD({ ...gd, netWeight: Number(v) })} type="number" className="text-right" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">22. Packages</label>
                        <div className="flex gap-1">
                            <InputField value={gd.packagesNo} onChange={v => setGD({ ...gd, packagesNo: Number(v) })} type="number" className="w-1/2" />
                            <InputField value={gd.packagesKind} onChange={v => setGD({ ...gd, packagesKind: v })} className="w-1/2" />
                        </div>
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">23. Marks & Numbers</label>
                        <InputField value={gd.marksAndNumbers} onChange={v => setGD({ ...gd, marksAndNumbers: v })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">24. Location</label>
                        <InputField value={gd.locationOfGoods} onChange={v => setGD({ ...gd, locationOfGoods: v })} />
                    </div>
                </div>

                {/* 4. Valuation Details */}
                <div className="bg-gray-100 border border-black border-b-0 text-center font-bold text-[10px] py-1">VALUATION DETAILS (CALCULATION OF CUSTOMS VALUE)</div>
                <div className="gd-section grid grid-cols-5">
                    <div className="gd-cell">
                        <label className="gd-label">25. Delivery Terms</label>
                        <InputField value={gd.deliveryTerm} onChange={v => setGD({ ...gd, deliveryTerm: v })} className="font-bold" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">26. Currency Code</label>
                        <InputField value={gd.currencyCode} onChange={v => setGD({ ...gd, currencyCode: v })} className="text-center" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">27. Exchange Rate</label>
                        <InputField value={gd.exchangeRate} onChange={v => setGD({ ...gd, exchangeRate: Number(v) })} type="number" className="text-right" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">28. Invoice No.</label>
                        <InputField value={gd.invoiceNo} onChange={v => setGD({ ...gd, invoiceNo: v })} />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">29. Invoice Date</label>
                        <InputField value={gd.invoiceDate} onChange={v => setGD({ ...gd, invoiceDate: v })} />
                    </div>
                </div>

                <div className="gd-section grid grid-cols-6 bg-gray-50">
                    <div className="gd-cell">
                        <label className="gd-label">30. FOB Value ($)</label>
                        <InputField value={gd.fobValue} onChange={v => setGD({ ...gd, fobValue: Number(v) })} type="number" className="text-right" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">31. Freight ($)</label>
                        <InputField value={gd.freight} onChange={v => setGD({ ...gd, freight: Number(v) })} type="number" className="text-right" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">32. Insurance ($)</label>
                        <InputField value={gd.insurance} onChange={v => setGD({ ...gd, insurance: Number(v) })} type="number" className="text-right" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">33. Other Charges</label>
                        <InputField value={gd.otherCharges} onChange={v => setGD({ ...gd, otherCharges: Number(v) })} type="number" className="text-right" />
                    </div>
                    <div className="gd-cell">
                        <label className="gd-label">34. Landing (1%)</label>
                        <InputField value={gd.landingCharges} type="number" className="text-right" readOnly />
                    </div>
                    <div className="gd-cell bg-gray-100">
                        <label className="gd-label">35. Total Declared Value (PKR)</label>
                        <InputField value={gd.totalDeclaredValue} type="number" className="text-right font-bold" readOnly />
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
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.hsCode} onChange={v => handleItemChange(idx, 'hsCode', v)} className="text-center" />
                                    </td>
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.description} onChange={v => handleItemChange(idx, 'description', v)} className="text-left px-1" />
                                    </td>
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.qty} onChange={v => handleItemChange(idx, 'qty', Number(v))} type="number" className="text-center" />
                                    </td>
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.uom} onChange={v => handleItemChange(idx, 'uom', v)} className="text-center" />
                                    </td>
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.qty ? Math.round(item.declaredValue / item.qty) : 0} type="number" className="text-center" readOnly />
                                    </td>
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.assessableValue} onChange={v => handleItemChange(idx, 'assessableValue', Number(v))} type="number" className="text-center bg-yellow-50" />
                                    </td>
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.customsDutyRate} onChange={v => handleItemChange(idx, 'customsDutyRate', Number(v))} type="number" className="text-center" />
                                    </td>
                                    <td className="border-r border-black p-0">
                                        <InputField value={item.salesTaxRate} onChange={v => handleItemChange(idx, 'salesTaxRate', Number(v))} type="number" className="text-center" />
                                    </td>
                                    <td className="border-r border-black p-1 text-right font-bold">{item.totalDuty.toLocaleString()}</td>
                                    <td className="print:hidden">
                                        {isEditMode && (
                                            <button onClick={() => removeItem(idx)}>
                                                <Trash className="h-3 w-3 text-red-500" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bg-gray-100 p-1 text-center print:hidden border-t border-black">
                        {isEditMode && (
                            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addItem}>
                                <Plus className="h-3 w-3 mr-1" /> Add Item
                            </Button>
                        )}
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
                        <InputField value={gd.examinerRemarks} onChange={v => setGD({ ...gd, examinerRemarks: v })} className="bg-gray-50 border border-gray-200 h-12" />
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
                        <InputField value={gd.declarantName} onChange={v => setGD({ ...gd, declarantName: v })} className="font-bold text-center" />
                        <InputField value={gd.cnic} onChange={v => setGD({ ...gd, cnic: v })} className="font-mono text-[9px] text-center" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialGDForm;
