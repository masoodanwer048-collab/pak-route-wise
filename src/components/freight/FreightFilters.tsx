import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import { FreightFilters as FreightFiltersType } from '@/hooks/useFreightShipments';
import { ShipmentStatus } from '@/types/logistics';

interface FreightFiltersProps {
  filters: FreightFiltersType;
  onFilterChange: (filters: Partial<FreightFiltersType>) => void;
  onClearFilters: () => void;
  origins: string[];
  destinations: string[];
}

const statusOptions: { value: ShipmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'customs_hold', label: 'Customs Hold' },
  { value: 'cleared', label: 'Cleared' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'delayed', label: 'Delayed' },
];

export function FreightFilters({
  filters,
  onFilterChange,
  onClearFilters,
  origins,
  destinations,
}: FreightFiltersProps) {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.origin !== '' ||
    filters.destination !== '' ||
    filters.dateRange !== 'all';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Shipments</SheetTitle>
          <SheetDescription>
            Apply filters to narrow down your shipment list
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange({ status: value as ShipmentStatus | 'all' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Origin Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Origin</label>
            <Select
              value={filters.origin || 'all'}
              onValueChange={(value) => onFilterChange({ origin: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Origins</SelectItem>
                {origins.map((origin) => (
                  <SelectItem key={origin} value={origin}>
                    {origin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <Select
              value={filters.destination || 'all'}
              onValueChange={(value) => onFilterChange({ destination: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {destinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>
                    {dest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) =>
                onFilterChange({ dateRange: value as 'today' | 'week' | 'month' | 'all' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={onClearFilters} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
