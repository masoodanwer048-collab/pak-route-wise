import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RoadFreight from "./pages/freight/RoadFreight";
import GDFiling from "./pages/customs/GDFiling";
import HSCodeLookup from "./pages/customs/HSCodeLookup";
import BillOfLading from "./pages/documents/BillOfLading";
import TransitManagement from "./pages/atta/TransitManagement";
import PortDirectory from "./pages/maritime/PortDirectory";
import NotFound from "./pages/NotFound";

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
          <Route path="/freight/sea" element={<RoadFreight />} />
          <Route path="/freight/air" element={<RoadFreight />} />
          <Route path="/freight/rail" element={<RoadFreight />} />
          <Route path="/freight/calculator" element={<RoadFreight />} />
          
          {/* Documents */}
          <Route path="/documents/bl" element={<BillOfLading />} />
          <Route path="/documents/bilty" element={<BillOfLading />} />
          <Route path="/documents/awb" element={<BillOfLading />} />
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
          <Route path="/export/filing" element={<GDFiling />} />
          <Route path="/export/e-form" element={<GDFiling />} />
          <Route path="/export/shipping-bills" element={<BillOfLading />} />
          
          {/* Transshipment */}
          <Route path="/transshipment/tsr" element={<TransitManagement />} />
          <Route path="/transshipment/dry-port" element={<TransitManagement />} />
          <Route path="/transshipment/seal" element={<TransitManagement />} />
          
          {/* Afghan Transit */}
          <Route path="/atta/management" element={<TransitManagement />} />
          <Route path="/atta/transit-pass" element={<TransitManagement />} />
          <Route path="/atta/border" element={<TransitManagement />} />
          <Route path="/atta/carriers" element={<TransitManagement />} />
          
          {/* Local Trade */}
          <Route path="/local/dispatch" element={<RoadFreight />} />
          <Route path="/local/routes" element={<RoadFreight />} />
          <Route path="/local/pod" element={<RoadFreight />} />
          
          {/* Warehouse */}
          <Route path="/warehouse/inventory" element={<RoadFreight />} />
          <Route path="/warehouse/grn" element={<RoadFreight />} />
          <Route path="/warehouse/bonded" element={<RoadFreight />} />
          
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
