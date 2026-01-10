import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Ship,
  Truck,
  Plane,
  FileText,
  Package,
  Globe,
  Warehouse,
  MapPin,
  DollarSign,
  Shield,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  Box,
  ClipboardCheck,
  ArrowRightLeft,
  Building2,
  Anchor,
  Layers,
  Palette,
  Users
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- Types ---
interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path?: string;
  subItems?: { name: string; path: string }[];
  permissions?: string[]; // Future proofing for role-based access
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// --- Navigation Config ---
const navStructure: NavGroup[] = [
  {
    title: "", // Top level items (Dashboard)
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/' },
    ]
  },
  {
    title: "Operations",
    items: [
      { id: 'ops-workflow', name: 'Operations Workflow', icon: Layers, path: '/operations/workflow' },
      {
        id: 'freight',
        name: 'Freight Management',
        icon: Truck,
        subItems: [
          { name: 'Road Freight', path: '/freight/road' },
          { name: 'Sea Freight', path: '/freight/sea' },
          { name: 'Air Freight', path: '/freight/air' },
          { name: 'Rail Freight', path: '/freight/rail' },
          { name: 'Rate Calculator', path: '/freight/calculator' },
        ],
      },
      {
        id: 'documents',
        name: 'Documents',
        icon: FileText,
        subItems: [
          { name: 'Bill of Lading', path: '/documents/bl' },
          { name: 'Packing List', path: '/documents/packing-list' },
          { name: 'Bilty / GR', path: '/documents/bilty' },
          { name: 'Air Waybill', path: '/documents/awb' },
          { name: 'Shipping Manifest', path: '/documents/manifest' },
        ],
      },
      {
        id: 'customs',
        name: 'Customs (C&F)',
        icon: ClipboardCheck,
        subItems: [
          { name: 'GD Filing', path: '/customs/gd' },
          { name: 'HS Code Lookup', path: '/customs/hs-codes' },
          { name: 'Duty Calculator', path: '/customs/duty-calculator' },
          { name: 'Examination', path: '/customs/examination' },
          { name: 'Gate Pass', path: '/customs/gate-pass' },
        ],
      },
      {
        id: 'import',
        name: 'Imports',
        icon: Package,
        subItems: [
          { name: 'Import Index', path: '/import/index' },
          { name: 'IGM Processing', path: '/import/igm' },
          { name: 'Duty Assessment', path: '/import/duty' },
          { name: 'Release Orders', path: '/import/release' },
        ],
      },
      {
        id: 'export',
        name: 'Exports',
        icon: Globe,
        subItems: [
          { name: 'Export Filing', path: '/export/filing' },
          { name: 'E-Form Processing', path: '/export/e-form' },
          { name: 'Shipping Bills', path: '/export/shipping-bills' },
        ],
      },
      {
        id: 'transshipment',
        name: 'Transshipment',
        icon: ArrowRightLeft,
        subItems: [
          { name: 'TSR Filing', path: '/transshipment/tsr' },
          { name: 'Dry Port Transfer', path: '/transshipment/dry-port' },
          { name: 'Seal Verification', path: '/transshipment/seal' },
        ],
      },
      {
        id: 'afghan-transit',
        name: 'Afghan Transit',
        icon: MapPin,
        subItems: [
          { name: 'ATTA Management', path: '/atta/management' },
          { name: 'Transit Pass', path: '/atta/transit-pass' },
          { name: 'Border Clearance', path: '/atta/border-clearance' },
          { name: 'Bonded Carriers', path: '/atta/bonded-carriers' },
          { name: 'Carrier Manifest', path: '/carrier/manifests' },
        ],
      },
      {
        id: 'local-trade',
        name: 'Local Logistics',
        icon: Box,
        subItems: [
          { name: 'Dispatch', path: '/local/dispatch' },
          { name: 'Route Planning', path: '/local/routes' },
          { name: 'POD Management', path: '/local/pod' },
        ],
      },
      {
        id: 'maritime',
        name: 'Maritime Operations',
        icon: Anchor,
        subItems: [
          { name: 'Container Tracking', path: '/maritime/containers' },
          { name: 'Vessel Schedule', path: '/maritime/vessels' },
          { name: 'Port Directory', path: '/maritime/ports' },
        ],
      },
      {
        id: 'air-cargo',
        name: 'Air Cargo',
        icon: Plane,
        subItems: [
          { name: 'AWB Management', path: '/air-cargo/awb' },
          { name: 'Cargo Handling', path: '/air-cargo/handling' },
          { name: 'Airlines', path: '/air-cargo/airlines' },
        ],
      },
    ]
  },
  {
    title: "Courier Service",
    items: [
      {
        id: 'courier',
        name: 'Courier Module',
        icon: Truck,
        subItems: [
          { name: 'Shipment Booking', path: '/courier/booking' },
          { name: 'Live Tracking', path: '/courier/tracking' },
          { name: 'Courier Management', path: '/courier/management' },
        ],
      },
    ]
  },
  {
    title: "Warehousing",
    items: [
      {
        id: 'warehouse',
        name: 'Warehouse Mgmt',
        icon: Warehouse,
        subItems: [
          { name: 'Inventory', path: '/warehouse/inventory' },
          { name: 'GRN / GIN', path: '/warehouse/grn' },
          { name: 'Bonded Warehouse', path: '/warehouse/bonded' },
        ],
      },
    ]
  },
  {
    title: "Asset Management",
    items: [
      {
        id: 'fleet',
        name: 'Fleet Management',
        icon: Truck,
        subItems: [
          { name: 'Vehicles', path: '/fleet/vehicles' },
        ],
      },
    ]
  },
  {
    title: "Finance & Accounts",
    items: [
      {
        id: 'finance',
        name: 'Finance',
        icon: DollarSign,
        subItems: [
          { name: 'Dashboard', path: '/finance/dashboard' },
          { name: 'Invoices', path: '/finance/invoices' },
          { name: 'Expenses', path: '/finance/expenses' },
          { name: 'Duty Payments', path: '/finance/duties' },
          { name: 'Demurrage', path: '/finance/demurrage' },
          { name: 'Reports', path: '/finance/reports' },
        ],
      },
    ]
  },
  {
    title: "HR & Payroll",
    items: [
      {
        id: 'hr',
        name: 'Human Resources',
        icon: Users,
        subItems: [
          { name: 'Employees', path: '/hr/employees' },
          { name: 'Payroll', path: '/hr/payroll' },
        ],
      },
    ]
  },
  {
    title: "Compliance",
    items: [
      {
        id: 'compliance',
        name: 'Compliance',
        icon: Shield,
        subItems: [
          { name: 'Documents', path: '/compliance/documents' },
          { name: 'Customs Rules', path: '/compliance/rules' },
          { name: 'Audit Trail', path: '/compliance/audit' },
        ],
      },
    ]
  },
  {
    title: "Tracking & Visibility",
    items: [
      {
        id: 'tracking',
        name: 'Live Tracking',
        icon: MapPin,
        subItems: [
          { name: 'GPS Tracking', path: '/tracking/gps' },
          { name: 'Container Track', path: '/tracking/containers' },
          { name: 'Milestones', path: '/tracking/milestones' },
          { name: 'Alerts', path: '/tracking/alerts' },
        ],
      },
    ]
  },
  {
    title: "Reports",
    items: [
      { id: 'reports', name: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
    ]
  },
  {
    title: "System",
    items: [
      { id: 'settings', name: 'Global Settings', icon: Settings, path: '/settings' },
      { id: 'design-system', name: 'Design System', icon: Palette, path: '/design-system' },
    ]
  }
];

// --- Sub-components ---

const MobileNavFooter = () => (
  <div className="border-t border-sidebar-border p-4 bg-sidebar/50 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary ring-1 ring-sidebar-primary/50">
        <Building2 className="h-5 w-5" />
      </div>
      <div className="flex-1 truncate">
        <p className="text-sm font-bold text-sidebar-foreground">Kohesar Logistics Private Limited</p>
        <p className="text-xs text-sidebar-foreground/60 font-mono">NTN: 8968606-4</p>
      </div>
    </div>
  </div>
);

export function SidebarContent() {
  const location = useLocation();
  const { hasModuleAccess } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard', 'freight']);

  const filteredNav = useMemo(() => navStructure.map(group => {
    // Filter items based on permissions
    const visibleItems = group.items.filter(item => {
      // Map sidebar IDs to DB Module Keys
      const moduleKeyMap: Record<string, string> = {
        'ops-workflow': 'ops_workflow',
        'freight': 'freight', // Or specific
        'documents': 'documents',
        'customs': 'customs_gd',
        'import': 'import',
        'export': 'export',
        'transshipment': 'transshipment',
        'afghan-transit': 'afghan_transit',
        'local-trade': 'local_logistics',
        'maritime': 'maritime',
        'air-cargo': 'air_cargo',
        'courier': 'courier',
        // 'carrier' path maps to 'afghan_transit' module for permission check as per checking Bonded Carrier role
        'carrier': 'afghan_transit',
        'warehouse': 'warehousing',
        'fleet': 'fleet',
        'finance': 'finance',
        'hr': 'hr',
        'compliance': 'compliance',
        'tracking': 'tracking',
        'reports': 'reports',
        'settings': 'settings'
      };

      const moduleKey = moduleKeyMap[item.id];
      if (moduleKey && !hasModuleAccess(moduleKey)) {
        return false;
      }
      return true;
    });

    if (visibleItems.length === 0) return null;
    return { ...group, items: visibleItems };
  }).filter(Boolean) as NavGroup[], [hasModuleAccess]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isItemActive = (item: NavItem) => {
    // Check exact path match
    if (item.path && location.pathname === item.path) return true;
    // Check sub-items match
    if (item.subItems) {
      return item.subItems.some((sub) => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo Area */}
      <div className="flex h-32 shrink-0 items-center justify-center border-b border-sidebar-border px-2 bg-white shadow-sm z-10 overflow-hidden">
        <img
          src="/kohesar_logo.png"
          alt="Kohesar Logistics"
          className="h-full w-full object-contain p-1 transform transition-transform hover:scale-105"
        />
      </div>

      {/* Main Navigation Scroll Area */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-3">
          {filteredNav.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {group.title && (
                <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-2 mt-4 font-mono">
                  {group.title}
                </h4>
              )}

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isExpanded = expandedItems.includes(item.id);
                  const isActive = isItemActive(item);

                  return (
                    <li key={item.id}>
                      {item.path ? (
                        <NavLink
                          to={item.path}
                          className={({ isActive: isLinkActive }) => cn(
                            'nav-item w-full group relative',
                            isLinkActive
                              ? 'nav-item-active'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                          )}
                        >
                          <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-muted-foreground group-hover:text-sidebar-foreground")} />
                          <span className="truncate">{item.name}</span>
                          {/* Active Indicator Bar */}
                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-sidebar-primary-foreground/50" />}
                        </NavLink>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className={cn(
                              'nav-item w-full justify-between group select-none',
                              isActive
                                ? 'text-sidebar-primary font-medium bg-sidebar-accent/50'
                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-sidebar-primary" : "text-sidebar-muted-foreground")} />
                              <span className="truncate">{item.name}</span>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-200" />
                            )}
                          </button>

                          {/* Animated Submenu */}
                          <div className={cn(
                            "grid transition-all duration-200 ease-in-out",
                            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          )}>
                            <ul className="overflow-hidden">
                              {item.subItems?.map((subItem) => (
                                <li key={subItem.path} className="relative">
                                  {/* Connectivity line */}
                                  <div className="absolute left-[1.15rem] top-0 bottom-0 w-px bg-sidebar-border" />

                                  <NavLink
                                    to={subItem.path}
                                    className={({ isActive: isSubActive }) => cn(
                                      'relative flex items-center gap-2 py-2 pl-9 pr-3 text-sm transition-colors rounded-md mx-1 my-0.5',
                                      isSubActive
                                        ? 'text-sidebar-primary font-medium bg-sidebar-accent/30'
                                        : 'text-sidebar-foreground/90 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
                                    )}
                                  >
                                    {({ isActive: isSubActive }) => (
                                      <>
                                        {/* Dot Indicator */}
                                        <div className={cn(
                                          "absolute left-[1.03rem] h-1.5 w-1.5 rounded-full ring-2 ring-sidebar",
                                          isSubActive ? "bg-sidebar-primary" : "bg-sidebar-border"
                                        )} />
                                        <span className="truncate">{subItem.name}</span>
                                      </>
                                    )}

                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <MobileNavFooter />
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden md:block h-screen w-64 border-r border-sidebar-border shadow-xl">
      <SidebarContent />
    </aside>
  );
}
