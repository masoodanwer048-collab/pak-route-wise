import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // If loading, show nothing (or a spinner) to prevent premature redirect
  if (isLoading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Fallback: Check localStorage if user state is null (race condition safety)
  const storedUser = localStorage.getItem('demo_user');
  if (!user && !storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import Index from "./pages/Index";
import RoadFreight from "./pages/freight/RoadFreight";
import SeaFreight from "./pages/freight/SeaFreight";
import AirFreight from "./pages/freight/AirFreight";
import RailFreight from "./pages/freight/RailFreight";
import RateCalculator from "./pages/freight/RateCalculator";
import GDFiling from "./pages/customs/GDFiling";
import HSCodeLookup from "./pages/customs/HSCodeLookup";
import Examination from "./pages/customs/Examination";
import DutyAssessment from "./pages/import/DutyAssessment";
import ImportIndex from "./pages/import/ImportIndex";
import IGMManagement from "./pages/import/IGMManagement";
import ReleaseOrders from "./pages/import/ReleaseOrders";
import BillOfLading from "./pages/documents/BillOfLading";
import PackingList from "./pages/documents/PackingList";
import TransitManagement from "./pages/atta/TransitManagement";
import DesignSystem from "./pages/DesignSystem";

import Manifest from "./pages/documents/Manifest";
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
import ContainerTracking from "./pages/maritime/ContainerTracking";
import VesselSchedule from "./pages/maritime/VesselSchedule";
import PortDirectory from "./pages/maritime/PortDirectory";
import Vehicles from "./pages/fleet/Vehicles";
import Invoices from "./pages/finance/Invoices";
import DutyPayments from "./pages/finance/DutyPayments";
import Demurrage from "./pages/finance/Demurrage";
import FinancialReports from "./pages/finance/FinancialReports";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import Expenses from "./pages/finance/Expenses";
import DocumentsManager from "./pages/compliance/DocumentsManager";
import CustomsRules from "./pages/compliance/CustomsRules";
import AuditTrail from "./pages/compliance/AuditTrail";
import SettingsLayout from "./pages/settings/SettingsLayout";
import EmployeeManagement from "./pages/hr/EmployeeManagement";
import PayrollManagement from "./pages/hr/PayrollManagement";
import OperationsWorkflow from "./pages/OperationsWorkflow";
import CourierBooking from "./pages/courier/CourierBooking";
import CourierTracking from "./pages/courier/CourierTracking";
import CourierManagement from "./pages/courier/CourierManagement";
import CarrierManifests from "./pages/carrier/CarrierManifests";
import CreateManifest from "./pages/carrier/CreateManifest";
import ManifestDetails from "./pages/carrier/ManifestDetails";
import ToastDemo from "./pages/ToastDemo";



const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Dedicated Carrier Login Route */}
            <Route path="/carrier/login" element={<Login isCarrier />} />

            <Route path="/carrier" element={<Navigate to="/carrier/login" replace />} />
            <Route path="/*" element={
              <ProtectedRoute>
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
                  <Route path="/documents/packing-list" element={<PackingList />} />
                  <Route path="/documents/bilty" element={<Bilty />} />
                  <Route path="/documents/awb" element={<AirWaybill />} />
                  <Route path="/documents/manifest" element={<Manifest />} />

                  {/* Customs */}
                  <Route path="/customs/gd" element={<GDFiling />} />
                  <Route path="/customs/hs-codes" element={<HSCodeLookup />} />
                  <Route path="/customs/duty-calculator" element={<HSCodeLookup />} />
                  <Route path="/customs/examination" element={<Examination />} />
                  <Route path="/customs/gate-pass" element={<GDFiling />} />

                  {/* Import */}
                  <Route path="/import/index" element={<ImportIndex />} />
                  <Route path="/import/igm" element={<IGMManagement />} />
                  <Route path="/import/duty" element={<DutyAssessment />} />
                  <Route path="/import/release" element={<ReleaseOrders />} />

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

                  {/* Carrier Module */}
                  <Route path="/carrier/manifests" element={<CarrierManifests />} />
                  <Route path="/carrier/create" element={<CreateManifest />} />
                  <Route path="/carrier/manifests/:id" element={<ManifestDetails />} />

                  {/* Demo */}
                  <Route path="/toast-demo" element={<ToastDemo />} />
                  <Route path="/local/dispatch" element={<Dispatch />} />
                  <Route path="/local/routes" element={<RoutePlanning />} />
                  <Route path="/local/pod" element={<PODManagement />} />

                  {/* Warehouse */}
                  <Route path="/warehouse/inventory" element={<Inventory />} />
                  <Route path="/warehouse/grn" element={<GRNGIN />} />
                  <Route path="/warehouse/bonded" element={<BondedWarehouse />} />

                  {/* Fleet */}
                  <Route path="/fleet/vehicles" element={<Vehicles />} />

                  {/* Courier Service */}
                  <Route path="/courier/booking" element={<CourierBooking />} />
                  <Route path="/courier/tracking" element={<CourierTracking />} />
                  <Route path="/courier/management" element={<CourierManagement />} />


                  {/* Air Cargo */}
                  <Route path="/air-cargo/awb" element={<BillOfLading />} />
                  <Route path="/air-cargo/handling" element={<RoadFreight />} />
                  <Route path="/air-cargo/airlines" element={<PortDirectory />} />

                  {/* Maritime */}
                  <Route path="/maritime/containers" element={<ContainerTracking />} />
                  <Route path="/maritime/vessels" element={<VesselSchedule />} />
                  <Route path="/maritime/ports" element={<PortDirectory />} />

                  {/* Finance */}
                  <Route path="/finance/dashboard" element={<FinanceDashboard />} />
                  <Route path="/finance/invoices" element={<Invoices />} />
                  <Route path="/finance/expenses" element={<Expenses />} />
                  <Route path="/finance/duties" element={<DutyPayments />} />
                  <Route path="/finance/demurrage" element={<Demurrage />} />
                  <Route path="/finance/reports" element={<FinancialReports />} />

                  {/* Compliance */}
                  <Route path="/compliance/documents" element={<DocumentsManager />} />
                  <Route path="/compliance/rules" element={<CustomsRules />} />
                  <Route path="/compliance/audit" element={<AuditTrail />} />

                  {/* Tracking */}
                  <Route path="/tracking/gps" element={<TransitManagement />} />
                  <Route path="/tracking/containers" element={<RoadFreight />} />
                  <Route path="/tracking/milestones" element={<RoadFreight />} />
                  <Route path="/tracking/alerts" element={<RoadFreight />} />

                  {/* HR Management */}
                  <Route path="/hr/employees" element={<EmployeeManagement />} />
                  <Route path="/hr/payroll" element={<PayrollManagement />} />

                  {/* Reports & Settings */}
                  <Route path="/reports" element={<GDFiling />} />
                  <Route path="/design-system" element={<DesignSystem />} />
                  <Route path="/settings" element={<SettingsLayout />} />

                  <Route path="/operations/workflow" element={<OperationsWorkflow />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
