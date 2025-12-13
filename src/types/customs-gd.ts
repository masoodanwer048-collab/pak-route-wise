export type GDType = "Import" | "Export" | "Transit" | "Transshipment";

export interface GDItem {
    itemNo: number;
    hsCode: string;
    description: string;
    qty: number;
    uom: string;
    grossWeight: number;
    netWeight: number;
    declaredValue: number;
    assessableValue: number;
    customsDutyRate: number;
    salesTaxRate: number;
    regulatoryDutyRate: number;
    totalDuty: number;
}

export interface GoodsDeclaration {
    // Header
    gdNumber: string;
    gdType: GDType;
    station: string;
    collectorate: string;
    filingDate: string;
    webocRef: string;

    // Importer/Exporter
    ntn: string;
    strn: string;
    traderName: string;
    address: string;
    phone: string;
    email: string;
    agentName: string;
    agentLicense: string;

    // Consignment
    blNumber: string;
    manifestNo: string;
    transporter: string; // Shipping Line / Airline
    vessel: string;
    portOfLoading: string; // From
    portOfDischarge: string; // To
    originCountry: string;
    exportCountry: string;

    // Goods
    items: GDItem[];

    // Summary Taxes
    totalCustomsDuty: number;
    totalSalesTax: number;
    totalRegulatoryDuty: number;
    totalTaxes: number;

    // Legal
    policyRef: string;
    sroNo: string;

    // Assessment
    examinerRemarks: string;
    status: "Pending" | "Assessed" | "Cleared" | "Examination";

    // Payment
    challanNo: string;
    bank: string;
    paymentStatus: "Paid" | "Unpaid";

    // Declaration
    declarantName: string;
    cnic: string;
}

export const initialGD: GoodsDeclaration = {
    gdNumber: "KPKI-IM-2023-00001",
    gdType: "Import",
    station: "Port Qasim",
    collectorate: "MCC Appraisement East",
    filingDate: new Date().toISOString().split('T')[0],
    webocRef: "WB-998877",
    ntn: "1234567-8",
    strn: "11-00-1111-000-11",
    traderName: "Global Trade Links (Pvt) Ltd",
    address: "Plot 44, Industrial Area, Karachi",
    phone: "021-33334444",
    email: "info@globaltrade.com",
    agentName: "Fast Track Clearing Agency",
    agentLicense: "CHAL-2010",
    blNumber: "MSC-12345678",
    manifestNo: "IGM-2023-445",
    transporter: "MSC",
    vessel: "MSC AL GHEZA V.22",
    portOfLoading: "Jebel Ali, UAE",
    portOfDischarge: "Port Qasim, PK",
    originCountry: "China",
    exportCountry: "UAE",
    items: [
        {
            itemNo: 1,
            hsCode: "8504.4090",
            description: "Solar Inverters 5KW (Hybrid)",
            qty: 50,
            uom: "NOS",
            grossWeight: 1200,
            netWeight: 1150,
            declaredValue: 15000000,
            assessableValue: 15200000,
            customsDutyRate: 11,
            salesTaxRate: 18,
            regulatoryDutyRate: 0,
            totalDuty: 4408000
        }
    ],
    totalCustomsDuty: 1672000,
    totalSalesTax: 2736000,
    totalRegulatoryDuty: 0,
    totalTaxes: 4408000,
    policyRef: "IPO-2022 Para 5(A)",
    sroNo: "SRO 212(I)/2009",
    examinerRemarks: "Documents verified. Goods match invoice description.",
    status: "Assessed",
    challanNo: "CPR-99887766",
    bank: "National Bank of Pakistan",
    paymentStatus: "Unpaid",
    declarantName: "Ahmed Ali",
    cnic: "42101-1234567-8"
};
