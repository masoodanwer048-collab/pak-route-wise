import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BookOpen,
  Calculator,
  Info,
  ChevronRight,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

const hsCodeResults = [
  {
    code: '8471.30.00',
    description: 'Portable automatic data processing machines, weighing not more than 10 kg',
    chapter: 84,
    heading: '84.71',
    customsDuty: 10,
    additionalDuty: 2,
    regulatoryDuty: 5,
    salesTax: 18,
    withholdingTax: 5.5,
    totalDuty: 40.5,
    unit: 'Number',
  },
  {
    code: '8471.41.00',
    description: 'Other automatic data processing machines comprising in the same housing',
    chapter: 84,
    heading: '84.71',
    customsDuty: 10,
    additionalDuty: 2,
    regulatoryDuty: 5,
    salesTax: 18,
    withholdingTax: 5.5,
    totalDuty: 40.5,
    unit: 'Number',
  },
  {
    code: '8471.49.00',
    description: 'Other automatic data processing machines presented in the form of systems',
    chapter: 84,
    heading: '84.71',
    customsDuty: 10,
    additionalDuty: 2,
    regulatoryDuty: 0,
    salesTax: 18,
    withholdingTax: 5.5,
    totalDuty: 35.5,
    unit: 'Number',
  },
];

export default function HSCodeLookup() {
  const [searchQuery, setSearchQuery] = useState('8471');
  const [selectedCode, setSelectedCode] = useState<typeof hsCodeResults[0] | null>(null);

  return (
    <MainLayout 
      title="HS Code Lookup" 
      subtitle="Pakistan Customs Tariff - Search HS Codes & Calculate Duties"
    >
      <div className="space-y-6">
        {/* Search Section */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Pakistan Customs Tariff</h2>
              <p className="text-sm text-muted-foreground">FBR HS Code Classification System</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by HS Code or Description (e.g., 8471 or 'computer')"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="accent">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Popular:</span>
            <button className="code-text hover:bg-accent/20 transition-colors">8471 - Computers</button>
            <button className="code-text hover:bg-accent/20 transition-colors">5208 - Cotton</button>
            <button className="code-text hover:bg-accent/20 transition-colors">8703 - Vehicles</button>
            <button className="code-text hover:bg-accent/20 transition-colors">8517 - Telecom</button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* HS Code Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Search Results ({hsCodeResults.length})</h3>
            <div className="space-y-3">
              {hsCodeResults.map((hs) => (
                <button
                  key={hs.code}
                  onClick={() => setSelectedCode(hs)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition-all hover:shadow-md',
                    selectedCode?.code === hs.code
                      ? 'border-accent bg-accent/5 shadow-md'
                      : 'border-border bg-card hover:border-accent/50'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-mono font-semibold text-lg">{hs.code}</p>
                        <p className="text-sm text-muted-foreground">
                          Chapter {hs.chapter} | Heading {hs.heading}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      'h-5 w-5 transition-transform',
                      selectedCode?.code === hs.code ? 'rotate-90 text-accent' : 'text-muted-foreground'
                    )} />
                  </div>
                  <p className="mt-3 text-sm">{hs.description}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="status-badge bg-info/10 text-info">
                      CD: {hs.customsDuty}%
                    </span>
                    <span className="status-badge bg-warning/10 text-warning">
                      ST: {hs.salesTax}%
                    </span>
                    <span className="status-badge bg-success/10 text-success">
                      Total: {hs.totalDuty}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duty Details */}
          <div>
            {selectedCode ? (
              <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Duty Breakdown</h3>
                    <p className="font-mono text-muted-foreground">{selectedCode.code}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Customs Duty (CD)</span>
                    <span className="font-mono font-medium">{selectedCode.customsDuty}%</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Additional Customs Duty (ACD)</span>
                    <span className="font-mono font-medium">{selectedCode.additionalDuty}%</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Regulatory Duty (RD)</span>
                    <span className="font-mono font-medium">{selectedCode.regulatoryDuty}%</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Sales Tax (ST)</span>
                    <span className="font-mono font-medium">{selectedCode.salesTax}%</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Withholding Tax (WHT)</span>
                    <span className="font-mono font-medium">{selectedCode.withholdingTax}%</span>
                  </div>
                  <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-4 -mx-4">
                    <span className="font-semibold">Total Effective Rate</span>
                    <span className="font-mono font-bold text-lg text-accent">{selectedCode.totalDuty}%</span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p>Unit of Measurement: <strong>{selectedCode.unit}</strong></p>
                      <p className="mt-1">Rates as per Pakistan Customs Tariff 2024. Additional SROs may apply.</p>
                    </div>
                  </div>
                </div>

                <Button variant="accent" className="w-full mt-4">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Duty for Import
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Select an HS Code</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any HS code from the results to view detailed duty breakdown
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
