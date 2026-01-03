import { useState, useMemo, useCallback } from 'react';
import { HSCode } from '@/types/logistics';

const mockHSCodes: HSCode[] = [
  {
    code: '8471.30.00',
    description: 'Portable automatic data processing machines, weighing not more than 10 kg',
    chapter: 84,
    heading: 8471,
    subheading: 30,
    tariffItem: 0,
    customsDuty: 10,
    additionalCustomsDuty: 2,
    regulatoryDuty: 5,
    salesTax: 18,
    additionalSalesTax: 3,
    withholdingTax: 5.5,
    exciseDuty: 0,
    unit: 'Number',
  },
  {
    code: '8471.41.00',
    description: 'Other automatic data processing machines comprising in the same housing at least a CPU and an input/output unit',
    chapter: 84,
    heading: 8471,
    subheading: 41,
    tariffItem: 0,
    customsDuty: 10,
    additionalCustomsDuty: 2,
    regulatoryDuty: 5,
    salesTax: 18,
    additionalSalesTax: 3,
    withholdingTax: 5.5,
    exciseDuty: 0,
    unit: 'Number',
  },
  {
    code: '8471.49.00',
    description: 'Other automatic data processing machines presented in the form of systems',
    chapter: 84,
    heading: 8471,
    subheading: 49,
    tariffItem: 0,
    customsDuty: 10,
    additionalCustomsDuty: 2,
    regulatoryDuty: 0,
    salesTax: 18,
    additionalSalesTax: 3,
    withholdingTax: 5.5,
    exciseDuty: 0,
    unit: 'Number',
  },
  {
    code: '5208.21.00',
    description: 'Woven fabrics of cotton, containing 85% or more by weight of cotton, plain weave, bleached',
    chapter: 52,
    heading: 5208,
    subheading: 21,
    tariffItem: 0,
    customsDuty: 15,
    additionalCustomsDuty: 0,
    regulatoryDuty: 0,
    salesTax: 17,
    additionalSalesTax: 0,
    withholdingTax: 4,
    exciseDuty: 0,
    unit: 'Meters',
  },
  {
    code: '8703.23.00',
    description: 'Motor cars for transport of persons, spark-ignition engine 1500-3000 cc',
    chapter: 87,
    heading: 8703,
    subheading: 23,
    tariffItem: 0,
    customsDuty: 50,
    additionalCustomsDuty: 7,
    regulatoryDuty: 25,
    salesTax: 17,
    additionalSalesTax: 5,
    withholdingTax: 6,
    exciseDuty: 20,
    unit: 'Number',
  },
  {
    code: '8443.32.00',
    description: 'Other printers, copying machines and facsimile machines, capable of connecting to ADP machine',
    chapter: 84,
    heading: 8443,
    subheading: 32,
    tariffItem: 0,
    customsDuty: 10,
    additionalCustomsDuty: 2,
    regulatoryDuty: 0,
    salesTax: 18,
    additionalSalesTax: 3,
    withholdingTax: 5.5,
    exciseDuty: 0,
    unit: 'Number',
  },
  {
    code: '8517.12.00',
    description: 'Telephones for cellular networks or for other wireless networks',
    chapter: 85,
    heading: 8517,
    subheading: 12,
    tariffItem: 0,
    customsDuty: 10,
    additionalCustomsDuty: 0,
    regulatoryDuty: 0,
    salesTax: 18,
    additionalSalesTax: 3,
    withholdingTax: 5.5,
    exciseDuty: 0,
    unit: 'Number',
  },
  {
    code: '8704.21.00',
    description: 'Motor vehicles for transport of goods, diesel/semi-diesel, GVW not exceeding 5 tonnes',
    chapter: 87,
    heading: 8704,
    subheading: 21,
    tariffItem: 0,
    customsDuty: 30,
    additionalCustomsDuty: 5,
    regulatoryDuty: 10,
    salesTax: 17,
    additionalSalesTax: 3,
    withholdingTax: 6,
    exciseDuty: 0,
    unit: 'Number',
  },
  {
    code: '3004.90.00',
    description: 'Medicaments consisting of mixed or unmixed products for therapeutic/prophylactic uses',
    chapter: 30,
    heading: 3004,
    subheading: 90,
    tariffItem: 0,
    customsDuty: 5,
    additionalCustomsDuty: 0,
    regulatoryDuty: 0,
    salesTax: 0,
    additionalSalesTax: 0,
    withholdingTax: 0,
    exciseDuty: 0,
    unit: 'KG',
  },
  {
    code: '7208.10.00',
    description: 'Flat-rolled products of iron or non-alloy steel, in coils, not further worked than hot-rolled',
    chapter: 72,
    heading: 7208,
    subheading: 10,
    tariffItem: 0,
    customsDuty: 5,
    additionalCustomsDuty: 2,
    regulatoryDuty: 0,
    salesTax: 18,
    additionalSalesTax: 0,
    withholdingTax: 5.5,
    exciseDuty: 0,
    unit: 'MT',
  },
  {
    code: '2710.12.00',
    description: 'Petroleum oils light oils and preparations',
    chapter: 27,
    heading: 2710,
    subheading: 12,
    tariffItem: 0,
    customsDuty: 5,
    additionalCustomsDuty: 0,
    regulatoryDuty: 0,
    salesTax: 17,
    additionalSalesTax: 0,
    withholdingTax: 0,
    exciseDuty: 0,
    unit: 'MT',
  },
  {
    code: '1006.30.00',
    description: 'Rice - Semi-milled or wholly milled rice',
    chapter: 10,
    heading: 1006,
    subheading: 30,
    tariffItem: 0,
    customsDuty: 0,
    additionalCustomsDuty: 0,
    regulatoryDuty: 0,
    salesTax: 0,
    additionalSalesTax: 0,
    withholdingTax: 0,
    exciseDuty: 0,
    unit: 'MT',
  },
];

interface DutyCalculation {
  assessedValue: number;
  customsDuty: number;
  additionalCustomsDuty: number;
  regulatoryDuty: number;
  salesTax: number;
  additionalSalesTax: number;
  withholdingTax: number;
  exciseDuty: number;
  totalDuty: number;
  landedCost: number;
}

export function useHSCodes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState<HSCode | null>(null);
  const [chapterFilter, setChapterFilter] = useState<number | 'all'>('all');

  const filteredCodes = useMemo(() => {
    return mockHSCodes.filter(hs => {
      if (chapterFilter !== 'all' && hs.chapter !== chapterFilter) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          hs.code.toLowerCase().includes(query) ||
          hs.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [searchQuery, chapterFilter]);

  const chapters = useMemo(() => {
    const chapterSet = new Set(mockHSCodes.map(hs => hs.chapter));
    return Array.from(chapterSet).sort((a, b) => a - b);
  }, []);

  const calculateDuty = useCallback((hsCode: HSCode, invoiceValue: number, exchangeRate: number = 278.50): DutyCalculation => {
    const assessedValue = invoiceValue * exchangeRate * 1.01; // 1% insurance & freight
    
    const customsDuty = assessedValue * (hsCode.customsDuty / 100);
    const additionalCustomsDuty = assessedValue * (hsCode.additionalCustomsDuty / 100);
    const regulatoryDuty = assessedValue * (hsCode.regulatoryDuty / 100);
    
    const dutyPaidValue = assessedValue + customsDuty + additionalCustomsDuty + regulatoryDuty;
    
    const salesTax = dutyPaidValue * (hsCode.salesTax / 100);
    const additionalSalesTax = dutyPaidValue * (hsCode.additionalSalesTax / 100);
    const withholdingTax = dutyPaidValue * (hsCode.withholdingTax / 100);
    const exciseDuty = dutyPaidValue * (hsCode.exciseDuty / 100);
    
    const totalDuty = customsDuty + additionalCustomsDuty + regulatoryDuty + salesTax + additionalSalesTax + withholdingTax + exciseDuty;
    const landedCost = assessedValue + totalDuty;

    return {
      assessedValue,
      customsDuty,
      additionalCustomsDuty,
      regulatoryDuty,
      salesTax,
      additionalSalesTax,
      withholdingTax,
      exciseDuty,
      totalDuty,
      landedCost,
    };
  }, []);

  const getTotalEffectiveRate = useCallback((hsCode: HSCode): number => {
    return hsCode.customsDuty + hsCode.additionalCustomsDuty + hsCode.regulatoryDuty +
      hsCode.salesTax + hsCode.additionalSalesTax + hsCode.withholdingTax + hsCode.exciseDuty;
  }, []);

  return {
    hsCodes: filteredCodes,
    allHSCodes: mockHSCodes,
    searchQuery,
    setSearchQuery,
    selectedCode,
    setSelectedCode,
    chapterFilter,
    setChapterFilter,
    chapters,
    calculateDuty,
    getTotalEffectiveRate,
  };
}
