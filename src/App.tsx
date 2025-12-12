import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RoadFreight from "./pages/freight/RoadFreight";
import SeaFreight from "./pages/freight/SeaFreight";
import AirFreight from "./pages/freight/AirFreight";
import RailFreight from "./pages/freight/RailFreight";
import RateCalculator from "./pages/freight/RateCalculator";
import GDFiling from "./pages/customs/GDFiling";
import HSCodeLookup from "./pages/customs/HSCodeLookup";
import BillOfLading from "./pages/documents/BillOfLading";
import TransitManagement from "./pages/atta/TransitManagement";
import PortDirectory from "./pages/maritime/PortDirectory";
import AirWaybill from "./pages/documents/AirWaybill";
import Bilty from "./pages/documents/Bilty";
import NotFound from "./pages/NotFound";
import ExportFiling from "./pages/export/ExportFiling";
import EFormManagement from "./pages/export/EFormManagement";
import ShippingBills from "./pages/export/ShippingBills";
import TSRFiling from "./pages/transshipment/TSRFiling";
import DryPortTransfer from "./pages/transshipment/DryPortTransfer";
import SealVerification from "./pages/transshipment/SealVerification";
import ATTAManagement from "./pages/atta/ATTAManagement";
import TransitPass from "./pages/atta/TransitPass";
import BorderClearance from "./pages/atta/BorderClearance";
import BondedCarriers from "./pages/atta/BondedCarriers";
import Dispatch from "./pages/local/Dispatch";
import RoutePlanning from "./pages/local/RoutePlanning";
import PODManagement from "./pages/local/PODManagement";
import Inventory from "./pages/warehouse/Inventory";
import GRNGIN from "./pages/warehouse/GRNGIN";
import BondedWarehouse from "./pages/warehouse/BondedWarehouse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Freight Management */}
          <Route path="/freight/road" element={<RoadFreight />} />
          <Route path="/freight/sea" element={<SeaFreight />} />
          <Route path="/freight/air" element={<AirFreight />} />
          <Route path="/freight/rail" element={<RailFreight />} />
          <Route path="/freight/calculator" element={<RateCalculator />} />

          {/* Documents */}
          <Route path="/documents/bl" element={<BillOfLading />} />
          <Route path="/documents/bilty" element={<Bilty />} />
          <Route path="/documents/awb" element={<AirWaybill />} />
          <Route path="/documents/manifest" element={<BillOfLading />} />

          {/* Customs */}
          <Route path="/customs/gd" element={<GDFiling />} />
          <Route path="/customs/hs-codes" element={<HSCodeLookup />} />
          <Route path="/customs/duty-calculator" element={<HSCodeLookup />} />
          <Route path="/customs/examination" element={<GDFiling />} />
          <Route path="/customs/gate-pass" element={<GDFiling />} />

          {/* Import */}
          <Route path="/import/index" element={<GDFiling />} />
          <Route path="/import/igm" element={<GDFiling />} />
          <Route path="/import/duty" element={<HSCodeLookup />} />
          <Route path="/import/release" element={<GDFiling />} />

          {/* Export */}

          <Route path="/export/filing" element={<ExportFiling />} />
          <Route path="/export/e-form" element={<EFormManagement />} />
          <Route path="/export/shipping-bills" element={<ShippingBills />} />

          {/* Transshipment */}
          <Route path="/transshipment/tsr" element={<TSRFiling />} />
          <Route path="/transshipment/dry-port" element={<DryPortTransfer />} />
          <Route path="/transshipment/seal" element={<SealVerification />} />

          {/* Afghan Transit */}
          <Route path="/atta/management" element={<ATTAManagement />} />
          <Route path="/atta/transit-pass" element={<TransitPass />} />
          <Route path="/atta/border-clearance" element={<BorderClearance />} />
          <Route path="/atta/bonded-carriers" element={<BondedCarriers />} />

          {/* Local Trade */}
          <Route path="/local/dispatch" element={<Dispatch />} />
          <Route path="/local/routes" element={<RoutePlanning />} />
          <Route path="/local/pod" element={<PODManagement />} />

          {/* Warehouse */}
          <Route path="/warehouse/inventory" element={<Inventory />} />
          <Route path="/warehouse/grn" element={<GRNGIN />} />
          <Route path="/warehouse/bonded" element={<BondedWarehouse />} />

          {/* Air Cargo */}
          <Route path="/air-cargo/awb" element={<BillOfLading />} />
          <Route path="/air-cargo/handling" element={<RoadFreight />} />
          <Route path="/air-cargo/airlines" element={<PortDirectory />} />

          {/* Maritime */}
          <Route path="/maritime/containers" element={<RoadFreight />} />
          <Route path="/maritime/vessels" element={<PortDirectory />} />
          <Route path="/maritime/ports" element={<PortDirectory />} />

          {/* Finance */}
          <Route path="/finance/invoices" element={<GDFiling />} />
          <Route path="/finance/duty-payments" element={<GDFiling />} />
          <Route path="/finance/demurrage" element={<GDFiling />} />
          <Route path="/finance/reports" element={<GDFiling />} />

          {/* Compliance */}
          <Route path="/compliance/documents" element={<BillOfLading />} />
          <Route path="/compliance/rules" element={<HSCodeLookup />} />
          <Route path="/compliance/audit" element={<GDFiling />} />

          {/* Tracking */}
          <Route path="/tracking/gps" element={<TransitManagement />} />
          <Route path="/tracking/containers" element={<RoadFreight />} />
          <Route path="/tracking/milestones" element={<RoadFreight />} />
          <Route path="/tracking/alerts" element={<RoadFreight />} />

          {/* Reports & Settings */}
          <Route path="/reports" element={<GDFiling />} />
          <Route path="/settings" element={<RoadFreight />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
