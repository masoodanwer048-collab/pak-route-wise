import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HSCode } from '@/types/logistics';
import { useHSCodes } from '@/hooks/useHSCodes';
import { Calculator, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface DutyCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hsCode?: HSCode | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
};

export function DutyCalculatorDialog({ open, onOpenChange, hsCode }: DutyCalculatorDialogProps) {
  const { calculateDuty } = useHSCodes();
  const [invoiceValue, setInvoiceValue] = useState<number>(10000);
  const [exchangeRate, setExchangeRate] = useState<number>(278.50);
  const [calculation, setCalculation] = useState<ReturnType<typeof calculateDuty> | null>(null);

  useEffect(() => {
    if (hsCode && open) {
      const result = calculateDuty(hsCode, invoiceValue, exchangeRate);
      setCalculation(result);
    }
  }, [hsCode, invoiceValue, exchangeRate, open, calculateDuty]);

  const handleCalculate = () => {
    if (hsCode) {
      const result = calculateDuty(hsCode, invoiceValue, exchangeRate);
      setCalculation(result);
    }
  };

  if (!hsCode) return null;

  const totalRate = hsCode.customsDuty + hsCode.additionalCustomsDuty + hsCode.regulatoryDuty +
    hsCode.salesTax + hsCode.additionalSalesTax + hsCode.withholdingTax + hsCode.exciseDuty;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Duty Calculator
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* HS Code Info */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-bold text-lg">{hsCode.code}</span>
                <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded">
                  {totalRate.toFixed(1)}% Total
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{hsCode.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Chapter {hsCode.chapter} | Heading {hsCode.heading} | Unit: {hsCode.unit}
              </p>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Value (USD)</Label>
                <Input
                  type="number"
                  value={invoiceValue}
                  onChange={(e) => setInvoiceValue(Number(e.target.value))}
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label>Exchange Rate (PKR/USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                />
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full" variant="accent">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Duty
            </Button>

            {calculation && (
              <>
                <Separator />
                
                {/* Duty Rate Breakdown */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">Duty Rates</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Customs Duty</span>
                      <span className="font-mono">{hsCode.customsDuty}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Additional CD</span>
                      <span className="font-mono">{hsCode.additionalCustomsDuty}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Regulatory Duty</span>
                      <span className="font-mono">{hsCode.regulatoryDuty}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Sales Tax</span>
                      <span className="font-mono">{hsCode.salesTax}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Additional ST</span>
                      <span className="font-mono">{hsCode.additionalSalesTax}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>WHT</span>
                      <span className="font-mono">{hsCode.withholdingTax}%</span>
                    </div>
                    {hsCode.exciseDuty > 0 && (
                      <div className="flex justify-between p-2 bg-muted/30 rounded col-span-2">
                        <span>Excise Duty</span>
                        <span className="font-mono">{hsCode.exciseDuty}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Calculated Amounts */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">Calculated Amounts</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-muted-foreground">Assessed Value (CIF)</span>
                      <span className="font-mono">{formatCurrency(calculation.assessedValue)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm border-t border-border">
                      <span className="text-muted-foreground">Customs Duty</span>
                      <span className="font-mono">{formatCurrency(calculation.customsDuty)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-muted-foreground">Additional CD</span>
                      <span className="font-mono">{formatCurrency(calculation.additionalCustomsDuty)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-muted-foreground">Regulatory Duty</span>
                      <span className="font-mono">{formatCurrency(calculation.regulatoryDuty)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm border-t border-border">
                      <span className="text-muted-foreground">Sales Tax</span>
                      <span className="font-mono">{formatCurrency(calculation.salesTax)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-muted-foreground">Additional ST</span>
                      <span className="font-mono">{formatCurrency(calculation.additionalSalesTax)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span className="text-muted-foreground">Withholding Tax</span>
                      <span className="font-mono">{formatCurrency(calculation.withholdingTax)}</span>
                    </div>
                    {calculation.exciseDuty > 0 && (
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-muted-foreground">Excise Duty</span>
                        <span className="font-mono">{formatCurrency(calculation.exciseDuty)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 bg-warning/10 rounded-lg px-3 -mx-3 mt-2">
                      <span className="font-semibold">Total Duty & Taxes</span>
                      <span className="font-mono font-bold text-warning">{formatCurrency(calculation.totalDuty)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-accent/10 rounded-lg px-3 -mx-3">
                      <span className="font-semibold">Landed Cost</span>
                      <span className="font-mono font-bold text-lg text-accent">{formatCurrency(calculation.landedCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Calculations are estimates based on Pakistan Customs Tariff 2024. 
                      Additional SROs, exemptions, or conditions may apply. 
                      Consult with a licensed customs agent for accurate assessment.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
