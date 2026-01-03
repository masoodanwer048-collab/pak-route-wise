import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, AlertCircle, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Rule {
    id: string;
    code: string;
    title: string;
    description: string;
    category: "SRO" | "Policy" | "Tariff";
    effectiveDate: string;
}

const rules: Rule[] = [
    {
        id: "1", code: "SRO-2023-445", title: "Import Policy Order 2023",
        description: "Regulations regarding the import of used vehicles and machinery, detailing the age limit and duty structure updates.",
        category: "Policy", effectiveDate: "2023-07-01"
    },
    {
        id: "2", code: "SRO-1122(I)/2022", title: "Exemption on Solar Panels",
        description: "Sales tax exemption on the import of solar panels and related renewable energy equipment.",
        category: "SRO", effectiveDate: "2022-12-15"
    },
    {
        id: "3", code: "Customs Act - Ch 5", title: "Warehousing Rules",
        description: "Standard operating procedures for bonded warehousing periods and penalties for overstay.",
        category: "Tariff", effectiveDate: "2020-01-01"
    },
];

const CustomsRules = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRules = rules.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Customs Rules & SROs</h1>
                <p className="text-muted-foreground">Searchable database of Pakistan Customs regulations.</p>
            </div>

            <div className="max-w-xl relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    type="search"
                    placeholder="Search regulation, SRO number, or keywords..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Latest Regulations</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Accordion type="single" collapsible className="w-full">
                                {filteredRules.map((rule) => (
                                    <AccordionItem key={rule.id} value={rule.id}>
                                        <AccordionTrigger className="px-6 hover:no-underline">
                                            <div className="flex flex-col items-start text-left">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-xs">{rule.category}</Badge>
                                                    <span className="font-mono text-xs text-muted-foreground">{rule.code}</span>
                                                </div>
                                                <span className="font-semibold text-md">{rule.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-4 bg-gray-50/50">
                                            <p className="text-gray-700 mb-2">{rule.description}</p>
                                            <div className="text-xs text-muted-foreground">Effective Date: {rule.effectiveDate}</div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            {filteredRules.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">
                                    No regulations found matching your query.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="bg-blue-50 dark:bg-slate-900 border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <AlertCircle className="h-5 w-5" /> Important Notice
                            </CardTitle>
                            <CardDescription className="text-blue-600">
                                Ensure compliance with the updated HS Code 2024 directory before filing new GDs to avoid penalties.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <div className="mt-6 space-y-2">
                        <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-widest pl-2">Quick Categories</h4>
                        <div className="flex flex-col gap-2">
                            {["Imports", "Exports", "Transit Trade", "Valuation Rulings"].map(cat => (
                                <button key={cat} className="flex items-center justify-between p-3 rounded-lg bg-card border hover:bg-accent transition-colors text-sm font-medium">
                                    {cat} <ChevronRight className="h-4 w-4 text-gray-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomsRules;
