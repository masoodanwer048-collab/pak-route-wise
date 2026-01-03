import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Truck,
  Ship,
  Plane,
  Train,
  ArrowRight,
  Package,
  DollarSign,
  Info,
} from 'lucide-react';
import { TransportMode, PAKISTAN_PORTS } from '@/types/logistics';
import { cn } from '@/lib/utils';

interface RateResult {
  baseRate: number;
  fuelSurcharge: number;
  securityFee: number;
  handlingCharges: number;
  documentationFee: number;
  terminalCharges: number;
  totalRate: number;
  currency: string;
  transitDays: number;
}

const containerTypes = [
  { value: '20GP', label: '20ft General Purpose' },
  { value: '40GP', label: '40ft General Purpose' },
  { value: '40HC', label: '40ft High Cube' },
  { value: '20RF', label: '20ft Reefer' },
  { value: '40RF', label: '40ft Reefer' },
];

const allPorts = [
  ...PAKISTAN_PORTS.sea.map((p) => ({ ...p, type: 'Sea Port' })),
  ...PAKISTAN_PORTS.dry.map((p) => ({ ...p, type: 'Dry Port' })),
  ...PAKISTAN_PORTS.air.map((p) => ({ ...p, type: 'Airport' })),
  ...PAKISTAN_PORTS.border.map((p) => ({ ...p, type: 'Border' })),
];

const internationalPorts = [
  { code: 'CNSHA', name: 'Shanghai, China', type: 'International' },
  { code: 'SGSIN', name: 'Singapore', type: 'International' },
  { code: 'AEDXB', name: 'Dubai, UAE', type: 'International' },
  { code: 'NLRTM', name: 'Rotterdam, Netherlands', type: 'International' },
  { code: 'GBFXT', name: 'Felixstowe, UK', type: 'International' },
  { code: 'USLAX', name: 'Los Angeles, USA', type: 'International' },
  { code: 'JPTYO', name: 'Tokyo, Japan', type: 'International' },
  { code: 'KRPUS', name: 'Busan, South Korea', type: 'International' },
];

export default function RateCalculator() {
  const [mode, setMode] = useState<TransportMode>('sea');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [containerType, setContainerType] = useState('20GP');
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<RateResult | null>(null);

  const calculateRate = () => {
    // Simulated rate calculation based on mode and parameters
    const baseRates: Record<TransportMode, number> = {
      sea: 1200,
      road: 450,
      air: 3500,
      rail: 800,
    };

    const containerMultiplier: Record<string, number> = {
      '20GP': 1,
      '40GP': 1.8,
      '40HC': 2,
      '20RF': 1.5,
      '40RF': 2.5,
    };

    const multiplier = containerMultiplier[containerType] || 1;
    const baseRate = baseRates[mode] * multiplier * quantity;
    const fuelSurcharge = baseRate * 0.15;
    const securityFee = mode === 'air' ? 150 : 50;
    const handlingCharges = mode === 'sea' ? 200 : mode === 'air' ? 300 : 100;
    const documentationFee = 75;
    const terminalCharges = mode === 'sea' ? 180 : mode === 'air' ? 250 : 80;

    const totalRate = baseRate + fuelSurcharge + securityFee + handlingCharges + documentationFee + terminalCharges;

    const transitDays = {
      sea: Math.floor(Math.random() * 10 + 15),
      road: Math.floor(Math.random() * 3 + 2),
      air: Math.floor(Math.random() * 2 + 1),
      rail: Math.floor(Math.random() * 5 + 4),
    };

    setResult({
      baseRate,
      fuelSurcharge,
      securityFee,
      handlingCharges,
      documentationFee,
      terminalCharges,
      totalRate,
      currency: 'USD',
      transitDays: transitDays[mode],
    });
  };

  const modeIcons: Record<TransportMode, typeof Truck> = {
    road: Truck,
    sea: Ship,
    air: Plane,
    rail: Train,
  };

  const ModeIcon = modeIcons[mode];

  return (
    <MainLayout title="Rate Calculator" subtitle="Calculate freight rates across all transport modes">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-accent" />
              Calculate Freight Rate
            </CardTitle>
            <CardDescription>
              Enter shipment details to get an estimated freight rate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transport Mode */}
            <div className="space-y-3">
              <Label>Transport Mode</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['road', 'sea', 'air', 'rail'] as TransportMode[]).map((m) => {
                  const Icon = modeIcons[m];
                  return (
                    <Button
                      key={m}
                      variant={mode === m ? 'default' : 'outline'}
                      className={cn(
                        'flex flex-col h-auto py-3 gap-1',
                        mode === m && 'bg-accent text-accent-foreground'
                      )}
                      onClick={() => setMode(m)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs capitalize">{m}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Origin</Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="section-intl" disabled className="font-semibold text-muted-foreground">
                      International Ports
                    </SelectItem>
                    {internationalPorts.map((port) => (
                      <SelectItem key={port.code} value={port.code}>
                        {port.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="section-pk" disabled className="font-semibold text-muted-foreground">
                      Pakistan Ports
                    </SelectItem>
                    {allPorts.map((port) => (
                      <SelectItem key={port.code} value={port.code}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="section-pk" disabled className="font-semibold text-muted-foreground">
                      Pakistan Ports
                    </SelectItem>
                    {allPorts.map((port) => (
                      <SelectItem key={port.code} value={port.code}>
                        {port.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="section-intl" disabled className="font-semibold text-muted-foreground">
                      International Ports
                    </SelectItem>
                    {internationalPorts.map((port) => (
                      <SelectItem key={port.code} value={port.code}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Container Type (for sea freight) */}
            {mode === 'sea' && (
              <div className="space-y-2">
                <Label>Container Type</Label>
                <Select value={containerType} onValueChange={setContainerType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {containerTypes.map((ct) => (
                      <SelectItem key={ct.value} value={ct.value}>
                        {ct.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity & Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{mode === 'sea' ? 'Containers' : mode === 'road' ? 'Trucks' : 'Units'}</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="text"
                  placeholder="e.g., 24000"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <Button
              variant="accent"
              className="w-full"
              onClick={calculateRate}
              disabled={!origin || !destination}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Rate
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className={cn(!result && 'opacity-60')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Rate Estimate
            </CardTitle>
            <CardDescription>
              {result ? 'Estimated freight rate breakdown' : 'Fill in the form to see rate estimate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Route Summary */}
                <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-medium">
                      {[...allPorts, ...internationalPorts].find((p) => p.code === origin)?.name || origin}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ModeIcon className="h-5 w-5" />
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-medium">
                      {[...allPorts, ...internationalPorts].find((p) => p.code === destination)?.name || destination}
                    </p>
                  </div>
                </div>

                {/* Rate Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Rate</span>
                    <span className="font-mono">${result.baseRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fuel Surcharge (15%)</span>
                    <span className="font-mono">${result.fuelSurcharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Security Fee</span>
                    <span className="font-mono">${result.securityFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Handling Charges</span>
                    <span className="font-mono">${result.handlingCharges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Documentation Fee</span>
                    <span className="font-mono">${result.documentationFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Terminal Charges</span>
                    <span className="font-mono">${result.terminalCharges.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Estimated Rate</span>
                    <span className="text-2xl font-bold text-accent font-mono">
                      ${result.totalRate.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Package className="h-3 w-3" />
                    {quantity} {mode === 'sea' ? 'Container(s)' : 'Unit(s)'}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <ModeIcon className="h-3 w-3" />
                    {result.transitDays} Transit Days
                  </Badge>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm">
                  <Info className="h-4 w-4 text-warning mt-0.5" />
                  <p className="text-muted-foreground">
                    This is an estimated rate. Actual rates may vary based on current market conditions,
                    carrier availability, and specific cargo requirements.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Calculator className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-muted-foreground">No calculation yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select origin, destination, and cargo details to calculate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
