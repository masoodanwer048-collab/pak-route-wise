import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Ship,
  Truck,
  Plane,
  Train,
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
  FileSearch,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path?: string;
  subItems?: { name: string; path: string }[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/' },
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
    name: 'BL / Bilty / Manifest',
    icon: FileText,
    subItems: [
      { name: 'Bill of Lading', path: '/documents/bl' },
      { name: 'Bilty / GR', path: '/documents/bilty' },
      { name: 'Air Waybill', path: '/documents/awb' },
      { name: 'Shipping Manifest', path: '/documents/manifest' },
    ],
  },
  {
    id: 'customs',
    name: 'Clearing & Forwarding',
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
    name: 'Import Management',
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
    name: 'Export Management',
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
      { name: 'Border Clearance', path: '/atta/border' },
      { name: 'Bonded Carriers', path: '/atta/carriers' },
    ],
  },
  {
    id: 'local-trade',
    name: 'Local Trade',
    icon: Box,
    subItems: [
      { name: 'Dispatch', path: '/local/dispatch' },
      { name: 'Route Planning', path: '/local/routes' },
      { name: 'POD Management', path: '/local/pod' },
    ],
  },
  {
    id: 'warehouse',
    name: 'Warehousing',
    icon: Warehouse,
    subItems: [
      { name: 'Inventory', path: '/warehouse/inventory' },
      { name: 'GRN / GIN', path: '/warehouse/grn' },
      { name: 'Bonded Warehouse', path: '/warehouse/bonded' },
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
  {
    id: 'maritime',
    name: 'Port Operations',
    icon: Ship,
    subItems: [
      { name: 'Container Tracking', path: '/maritime/containers' },
      { name: 'Vessel Schedule', path: '/maritime/vessels' },
      { name: 'Port Directory', path: '/maritime/ports' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Billing',
    icon: DollarSign,
    subItems: [
      { name: 'Invoices', path: '/finance/invoices' },
      { name: 'Duty Payments', path: '/finance/duty-payments' },
      { name: 'Demurrage', path: '/finance/demurrage' },
      { name: 'Reports', path: '/finance/reports' },
    ],
  },
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
  {
    id: 'tracking',
    name: 'Tracking & Alerts',
    icon: MapPin,
    subItems: [
      { name: 'GPS Tracking', path: '/tracking/gps' },
      { name: 'Container Track', path: '/tracking/containers' },
      { name: 'Milestones', path: '/tracking/milestones' },
      { name: 'Alerts', path: '/tracking/alerts' },
    ],
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    icon: BarChart3,
    path: '/reports',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isItemActive = (item: NavItem) => {
    if (item.path) return location.pathname === item.path;
    if (item.subItems) {
      return item.subItems.some((sub) => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Ship className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">LogiPak Pro</span>
            <span className="text-xs text-sidebar-foreground/60">Logistics Management</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.includes(item.id);
              const isActive = isItemActive(item);

              return (
                <li key={item.id}>
                  {item.path ? (
                    <NavLink
                      to={item.path}
                      className={cn(
                        'nav-item w-full',
                        isActive
                          ? 'nav-item-active'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className={cn(
                          'nav-item w-full justify-between',
                          isActive
                            ? 'nav-item-active'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && item.subItems && (
                        <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.path}>
                              <NavLink
                                to={subItem.path}
                                className={cn(
                                  'nav-item text-sm',
                                  location.pathname === subItem.path
                                    ? 'text-sidebar-primary'
                                    : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'
                                )}
                              >
                                {subItem.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
              <Building2 className="h-5 w-5 text-sidebar-foreground" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-sidebar-foreground">Demo Corp Ltd</p>
              <p className="text-xs text-sidebar-foreground/60">NTN: 1234567-8</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
