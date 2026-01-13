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
    id?: string;
    // Header
    gdNumber: string;
    gdType: GDType;
    filingDate: string;
    station: string;
    collectorate: string;
    webocRef: string;

    // Exporter / Consignor
    exporterName: string;
    exporterAddress: string;

    // Importer / Consignee
    importerName: string;
    importerAddress: string;
    ntn: string;
    strn: string;

    // Agent
    agentName: string;
    agentAddress: string;
    chalNo: string; // License No

    // Header Details
    pages: string;

    // Shipment Details
    countryOfOrigin: string;
    countryOfConsignment: string;
    portOfShipment: string;
    portOfDischarge: string;
    modeOfTransport: string;
    identityOfTransport: string; // Vessel/Flight Name & No
    rotationNo: string; // Voyage / Rotation No
    blNumber: string;
    blDate: string;
    igmNo: string;
    igmDate: string;
    indexNo: string;

    // Cargo Details
    grossWeight: number;
    netWeight: number;
    packagesNo: number;
    packagesKind: string;
    marksAndNumbers: string;
    locationOfGoods: string;

    // Valuation Details
    deliveryTerm: string; // FOB, CIF, C&F
    currencyCode: string;
    exchangeRate: number;
    invoiceNo: string;
    invoiceDate: string;
    fobValue: number;
    freight: number;
    insurance: number;
    otherCharges: number;
    landingCharges: number;
    totalDeclaredValue: number;

    // Items
    items: GDItem[];

    // Totals
    totalCustomsDuty: number;
    totalSalesTax: number;
    totalRegulatoryDuty: number;
    totalTaxes: number;

    // Assessment & Legal
    status: "Pending" | "Assessed" | "Cleared" | "Examination";
    examinerRemarks: string;

    // Declaration
    declarantName: string;
    cnic: string;
}

export const initialGD: GoodsDeclaration = {
    gdNumber: "",
    gdType: "Import",
    station: "Port Qasim",
    collectorate: "MCC Appraisement East",
    filingDate: new Date().toISOString().split('T')[0],
    webocRef: "WB-998877",

    exporterName: "Sunshine Solar Inc.",
    exporterAddress: "123 Solar Way, Shanghai, China",

    importerName: "Global Trade Links (Pvt) Ltd",
    importerAddress: "Plot 44, Industrial Area, Karachi",
    ntn: "1234567-8",
    strn: "11-00-1111-000-11",

    agentName: "Fast Track Clearing Agency",
    agentAddress: "Office 202, Business Plaza, Karachi",
    chalNo: "CHAL-2010",

    pages: "1 of 2",

    countryOfOrigin: "China",
    countryOfConsignment: "China",
    portOfShipment: "Jebel Ali, UAE",
    portOfDischarge: "Port Qasim, PK",
    modeOfTransport: "Sea",
    identityOfTransport: "MSC AL GHEZA",
    rotationNo: "V.22",
    blNumber: "MSC-12345678",
    blDate: "2023-10-01",
    igmNo: "IGM-2023-445",
    igmDate: "2023-10-15",
    indexNo: "112",

    grossWeight: 1200,
    netWeight: 1150,
    packagesNo: 20,
    packagesKind: "Pallets",
    marksAndNumbers: "GTL-001/20",
    locationOfGoods: "Shed 4, PQ",

    deliveryTerm: "CIF",
    currencyCode: "USD",
    exchangeRate: 285.50,
    invoiceNo: "INV-2023-001",
    invoiceDate: "2023-09-25",
    fobValue: 50000,
    freight: 2500,
    insurance: 150,
    otherCharges: 0,
    landingCharges: 0,
    totalDeclaredValue: 15000000,

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

    status: "Assessed",
    examinerRemarks: "Documents verified. Goods match invoice description.",

    declarantName: "Ahmed Ali",
    cnic: "42101-1234567-8"
};
