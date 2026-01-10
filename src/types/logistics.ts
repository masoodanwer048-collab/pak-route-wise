// Core Types for Pakistan Logistics Management System

export type TransportMode = 'air' | 'sea' | 'road' | 'rail';
export type ShipmentStatus = 'pending' | 'in_transit' | 'customs_hold' | 'cleared' | 'delivered' | 'delayed';
export type DocumentType = 'bl' | 'awb' | 'bilty' | 'gd' | 'commercial_invoice' | 'packing_list' | 'e_form' | 'gate_pass' | 'transit_pass';
export type TradeType = 'import' | 'export' | 'transit' | 'transshipment' | 'local';

// Pakistan Ports
export const PAKISTAN_PORTS = {
  sea: [
    { code: 'PKKAR', name: 'Karachi Port', city: 'Karachi' },
    { code: 'PKQAS', name: 'Port Qasim', city: 'Karachi' },
    { code: 'PKGWD', name: 'Gwadar Port', city: 'Gwadar' },
    { code: 'PICT', name: 'Pakistan International Container Terminal', city: 'Karachi' },
    { code: 'KICT', name: 'Karachi International Container Terminal', city: 'Karachi' },
    { code: 'QICT', name: 'Qasim International Container Terminal', city: 'Karachi' },
    { code: 'SAPT', name: 'South Asia Pakistan Terminals', city: 'Karachi' },
  ],
  dry: [
    { code: 'LAHORE_DP', name: 'Lahore Dry Port', city: 'Lahore' },
    { code: 'FAISALABAD_DP', name: 'Faisalabad Dry Port', city: 'Faisalabad' },
    { code: 'SIALKOT_DP', name: 'Sialkot Dry Port', city: 'Sialkot' },
    { code: 'MULTAN_DP', name: 'Multan Dry Port', city: 'Multan' },
    { code: 'PESHAWAR_DP', name: 'Peshawar Dry Port', city: 'Peshawar' },
    { code: 'QUETTA_DP', name: 'Quetta Dry Port', city: 'Quetta' },
  ],
  air: [
    { code: 'OPKC', name: 'Jinnah International Airport', city: 'Karachi' },
    { code: 'OPLA', name: 'Allama Iqbal International Airport', city: 'Lahore' },
    { code: 'OPIS', name: 'Islamabad International Airport', city: 'Islamabad' },
    { code: 'OPPS', name: 'Bacha Khan International Airport', city: 'Peshawar' },
    { code: 'OPQT', name: 'Quetta International Airport', city: 'Quetta' },
    { code: 'OPFA', name: 'Faisalabad International Airport', city: 'Faisalabad' },
    { code: 'OPMT', name: 'Multan International Airport', city: 'Multan' },
    { code: 'OPST', name: 'Sialkot International Airport', city: 'Sialkot' },
  ],
  border: [
    { code: 'TORKHAM', name: 'Torkham Border', city: 'Torkham' },
    { code: 'CHAMAN', name: 'Chaman Border', city: 'Chaman' },
    { code: 'WAGAH', name: 'Wagah Border', city: 'Lahore' },
  ],
} as const;

// HS Code Structure (Pakistan Customs Tariff)
export interface HSCode {
  code: string;
  description: string;
  chapter: number;
  heading: number;
  subheading: number;
  tariffItem: number;
  customsDuty: number;
  additionalCustomsDuty: number;
  regulatoryDuty: number;
  salesTax: number;
  additionalSalesTax: number;
  withholdingTax: number;
  exciseDuty: number;
  unit: string;
}

// Shipment
export interface Shipment {
  id: string;
  referenceNumber: string;
  mode: TransportMode;
  status: ShipmentStatus;
  tradeType: TradeType;
  origin: string;
  destination: string;
  consignor: Party;
  consignee: Party;
  notifyParty?: Party;
  carrier: Carrier;
  containerNumbers: string[];
  weight: number;
  weightUnit: 'kg' | 'mt';
  volume: number;
  volumeUnit: 'cbm' | 'cft';
  packages: number;
  packageType: string;
  hsCode: string;
  goodsDescription: string;
  invoiceValue: number;
  currency: string;
  etd: Date;
  eta: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Party (Consignor/Consignee)
export interface Party {
  id: string;
  name: string;
  ntn: string; // National Tax Number
  strn?: string; // Sales Tax Registration Number
  address: string;
  city: string;
  country: string;
  contactPerson: string;
  phone: string;
  email: string;
}

// Carrier
export interface Carrier {
  id: string;
  name: string;
  type: TransportMode;
  licenseNumber: string;
  vehicleNumber?: string;
  vesselName?: string;
  voyageNumber?: string;
  flightNumber?: string;
  imoNumber?: string;
}

// Bill of Lading
export interface BillOfLading {
  id: string;
  blNumber: string;
  blType: 'original' | 'telex' | 'seaway';
  shipmentId: string;
  shipper: Party;
  consignee: Party;
  notifyParty: Party;
  vessel: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfDelivery: string;
  containerNumbers: string[];
  sealNumbers: string[];
  grossWeight: number;
  measurementCBM: number;
  packages: number;
  description: string;
  freightTerms: 'prepaid' | 'collect';
  dateOfIssue: Date;
  placeOfIssue: string;
}

// Bilty (Road Consignment Note)
export interface Bilty {
  id: string;
  biltyNumber: string;
  shipmentId: string;
  consignor: Party;
  consignee: Party;
  truckNumber: string;
  driverName: string;
  driverCNIC: string;
  driverPhone: string;
  origin: string;
  destination: string;
  weight: number;
  packages: number;
  description: string;
  freightCharges: number;
  advanceAmount: number;
  balanceAmount: number;
  dateOfDispatch: Date;
}

// Goods Declaration (GD)
export interface GoodsDeclaration {
  id: string;
  gdNumber: string;
  gdType: 'import' | 'export' | 'transit' | 'transshipment';
  status: 'draft' | 'submitted' | 'assessed' | 'paid' | 'examined' | 'released';
  shipmentId: string;
  blNumber: string;
  importer: Party;
  exporter: Party;
  customsStation: string;
  portOfEntry: string;
  hsCode: string;
  goodsDescription: string;
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceValue: number;
  currency: string;
  exchangeRate: number;
  assessedValue: number;
  customsDuty: number;
  additionalCustomsDuty: number;
  regulatoryDuty: number;
  salesTax: number;
  additionalSalesTax: number;
  withholdingTax: number;
  exciseDuty: number;
  totalDutyTax: number;
  filingDate: Date;
  assessmentDate?: Date;
  paymentDate?: Date;
  releaseDate?: Date;
}

// Transit Pass (Afghan Transit Trade)
export interface TransitPass {
  id: string;
  transitPassNumber: string;
  shipmentId: string;
  gdNumber: string;
  blNumber: string;
  bondNumber: string;
  bondAmount: number;
  carrier: Carrier;
  sealNumbers: string[];
  originPort: string;
  destinationBorder: string;
  transitRoute: string[];
  validUntil: Date;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  issueDate: Date;
}

// Container
export interface Container {
  id: string;
  containerNumber: string;
  type: '20GP' | '40GP' | '40HC' | '20RF' | '40RF' | '20OT' | '40OT' | '20FR' | '40FR';
  sealNumber: string;
  tareWeight: number;
  maxPayload: number;
  status: 'empty' | 'loaded' | 'in_transit' | 'at_port' | 'delivered';
  currentLocation: string;
}

// Freight Rates
export interface FreightRate {
  id: string;
  mode: TransportMode;
  origin: string;
  destination: string;
  containerType?: string;
  rate: number;
  currency: string;
  unit: 'per_container' | 'per_kg' | 'per_cbm' | 'per_truck';
  validFrom: Date;
  validUntil: Date;
  carrier?: string;
  surcharges: Surcharge[];
}

export interface Surcharge {
  name: string;
  type: 'fixed' | 'percentage';
  amount: number;
}

// Invoice
export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: 'freight' | 'customs' | 'storage' | 'handling' | 'demurrage';
  shipmentId: string;
  partyId: string;
  partyName: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: Date;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalShipments: number;
  activeShipments: number;
  pendingClearance: number;
  delivered: number;
  totalContainers: number;
  customsDutyCollected: number;
  freightRevenue: number;
  avgClearanceTime: number;
}

// Module Navigation
export interface ModuleNavItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  subItems?: ModuleNavItem[];
}
