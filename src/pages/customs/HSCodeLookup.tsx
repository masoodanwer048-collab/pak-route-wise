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
  Package,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHSCodes } from '@/hooks/useHSCodes';
import { DutyCalculatorDialog } from '@/components/customs/DutyCalculatorDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HSCodeLookup() {
  const isMobile = useIsMobile();
  const {
    hsCodes,
    searchQuery,
    setSearchQuery,
    selectedCode,
    setSelectedCode,
    chapterFilter,
    setChapterFilter,
    chapters,
    getTotalEffectiveRate,
  } = useHSCodes();

  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const popularSearches = [
    { code: '8471', label: 'Computers' },
    { code: '5208', label: 'Cotton' },
    { code: '8703', label: 'Vehicles' },
    { code: '8517', label: 'Telecom' },
    { code: '3004', label: 'Medicines' },
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setSelectedCode(null);
  };

  return (
    <MainLayout 
      title="HS Code Lookup" 
      subtitle="Pakistan Customs Tariff - Search HS Codes & Calculate Duties"
    >
      <div className="space-y-6">
        {/* Search Section */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Pakistan Customs Tariff</h2>
              <p className="text-sm text-muted-foreground">FBR HS Code Classification System</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by HS Code or Description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select 
              value={chapterFilter === 'all' ? 'all' : String(chapterFilter)} 
              onValueChange={(v) => setChapterFilter(v === 'all' ? 'all' : Number(v))}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {chapters.map(ch => (
                  <SelectItem key={ch} value={String(ch)}>Chapter {ch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {popularSearches.map(ps => (
              <button 
                key={ps.code}
                className="code-text hover:bg-accent/20 transition-colors"
                onClick={() => handleSearch(ps.code)}
              >
                {ps.code} - {ps.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* HS Code Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Search Results ({hsCodes.length})</h3>
            <ScrollArea className={cn(isMobile ? 'h-auto' : 'h-[calc(100vh-400px)]')}>
              <div className="space-y-3 pr-2">
                {hsCodes.map((hs) => {
                  const totalRate = getTotalEffectiveRate(hs);
                  
                  return (
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
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
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
                          'h-5 w-5 transition-transform shrink-0',
                          selectedCode?.code === hs.code ? 'rotate-90 text-accent' : 'text-muted-foreground'
                        )} />
                      </div>
                      <p className="mt-3 text-sm line-clamp-2">{hs.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="status-badge bg-info/10 text-info">
                          CD: {hs.customsDuty}%
                        </span>
                        <span className="status-badge bg-warning/10 text-warning">
                          ST: {hs.salesTax}%
                        </span>
                        <span className="status-badge bg-success/10 text-success">
                          Total: {totalRate.toFixed(1)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
                
                {hsCodes.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No HS Codes found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try a different search term or chapter filter
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Duty Details */}
          <div>
            {selectedCode ? (
              <div className="rounded-xl border border-border bg-card p-4 md:p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Duty Breakdown</h3>
                    <p className="font-mono text-muted-foreground">{selectedCode.code}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Customs Duty (CD)</span>
                    <span className="font-mono font-medium">{selectedCode.customsDuty}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Additional CD (ACD)</span>
                    <span className="font-mono font-medium">{selectedCode.additionalCustomsDuty}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Regulatory Duty (RD)</span>
                    <span className="font-mono font-medium">{selectedCode.regulatoryDuty}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Sales Tax (ST)</span>
                    <span className="font-mono font-medium">{selectedCode.salesTax}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Additional ST</span>
                    <span className="font-mono font-medium">{selectedCode.additionalSalesTax}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Withholding Tax (WHT)</span>
                    <span className="font-mono font-medium">{selectedCode.withholdingTax}%</span>
                  </div>
                  {selectedCode.exciseDuty > 0 && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Excise Duty</span>
                      <span className="font-mono font-medium">{selectedCode.exciseDuty}%</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-4 -mx-4">
                    <span className="font-semibold">Total Effective Rate</span>
                    <span className="font-mono font-bold text-lg text-accent">
                      {getTotalEffectiveRate(selectedCode).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <p>Unit of Measurement: <strong>{selectedCode.unit}</strong></p>
                      <p className="mt-1">Rates as per Pakistan Customs Tariff 2024. Additional SROs may apply.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="accent" 
                  className="w-full mt-4"
                  onClick={() => setCalculatorOpen(true)}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Duty for Import
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 md:p-12 text-center">
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

      <DutyCalculatorDialog
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        hsCode={selectedCode}
      />
    </MainLayout>
  );
}
