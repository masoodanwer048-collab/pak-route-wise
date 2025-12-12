import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Globe, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

const ports = [
  {
    name: "Karachi Port Trust (KPT)",
    code: "PKKHI",
    type: "Deep Sea Port",
    address: "Eduljee Dinshaw Road, Karachi, Pakistan",
    phone: "+92-21-99214530",
    website: "https://kpt.gov.pk",
    terminals: ["East Wharf", "West Wharf", "KICT", "PICT"]
  },
  {
    name: "Port Qasim Authority (PQA)",
    code: "PKBQM",
    type: "Deep Sea Port / Industrial Zone",
    address: "Bin Qasim, Karachi, Pakistan",
    phone: "+92-21-99272111",
    website: "https://pqa.gov.pk",
    terminals: ["QICT", "FOTCO", "Engro Vopak"]
  },
  {
    name: "Gwadar Port Authority (GPA)",
    code: "PKGWA",
    type: "Deep Sea Port",
    address: "Pak-China Friendship Ave, Gwadar, Balochistan",
    phone: "+92-86-9200401",
    website: "http://gwadarport.gov.pk",
    terminals: ["COPHC Multi-Purpose Terminal"]
  },
  {
    name: "South Asia Pakistan Terminals (SAPT)",
    code: "SAPT",
    type: "Container Terminal",
    address: "Keamari Groyne, Karachi",
    phone: "+92-21-32862800",
    website: "https://sapt.com.pk",
    terminals: ["Deep Draft Berths"]
  }
];

const PortDirectory = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-slide-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Port Directory</h1>
        <p className="text-muted-foreground">Information and contacts for major ports and terminals.</p>
      </div>

      <div className="max-w-md relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input type="search" placeholder="Search ports..." className="pl-8" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {ports.map((port, index) => (
          <Card key={index} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-800">{port.name}</CardTitle>
                  <CardDescription className="font-mono mt-1">{port.code} • {port.type}</CardDescription>
                </div>
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{port.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{port.phone}</span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Terminals:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {port.terminals.map(t => (
                    <span key={t} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border">{t}</span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 pt-4 rounded-b-xl border-t">
              <Button variant="outline" className="w-full gap-2" asChild>
                <a href={port.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" /> Visit Website <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortDirectory;
