import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertTriangle, AlertCircle, Info, Truck, Package, Anchor } from 'lucide-react';

const DesignSystem = () => {
    return (
        <MainLayout title="Kohesar Design System" subtitle="Official UI/UX Guidelines & Component Library">
            <div className="space-y-12 pb-20 animate-slide-up">

                {/* 1. Brand Guidelines & Colors */}
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">1. Brand Identity & Colors</h2>
                        <p className="text-muted-foreground">
                            Primary brand colors for Kohesar Logistics. These tokens should be used consistently across the platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Primary */}
                        <ColorSwatch name="Primary" token="bg-primary" hex="#06B6D4" text="text-primary-foreground" />
                        <ColorSwatch name="Secondary" token="bg-secondary" hex="#1E293B" text="text-secondary-foreground" />
                        <ColorSwatch name="Accent" token="bg-accent" hex="#E0F7FA" text="text-accent-foreground" />
                        <ColorSwatch name="Muted" token="bg-muted" hex="#F1F5F9" text="text-muted-foreground" />

                        {/* Statuses */}
                        <ColorSwatch name="Success" token="bg-success" hex="#22C55E" text="text-white" />
                        <ColorSwatch name="Warning" token="bg-warning" hex="#F59E0B" text="text-white" />
                        <ColorSwatch name="Error" token="bg-destructive" hex="#EF4444" text="text-white" />
                        <ColorSwatch name="Pending" token="bg-pending" hex="#A855F7" text="text-white" />
                    </div>
                </section>

                <hr />

                {/* 2. Typography */}
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">2. Typography</h2>
                        <p className="text-muted-foreground">
                            Inter font family. Clear hierarchy for headings and body text.
                        </p>
                    </div>

                    <div className="border rounded-xl p-8 space-y-8 bg-card">
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Heading 1</span>
                            <h1>The Quick Brown Fox Jumps Over The Lazy Dog</h1>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Heading 2</span>
                            <h2>The Quick Brown Fox Jumps Over The Lazy Dog</h2>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Heading 3</span>
                            <h3>The Quick Brown Fox Jumps Over The Lazy Dog</h3>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Body Text</span>
                            <p className="max-w-prose">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Domestica logistics solution standard.
                                Efficient supply chain management requires consistent visual markers and legible typography.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Small / Caption</span>
                            <p className="text-sm text-muted-foreground">
                                This is caption text used for hints, timestamps, and secondary info.
                            </p>
                        </div>
                    </div>
                </section>

                <hr />

                {/* 3. UI Components */}
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">3. UI Components</h2>
                        <p className="text-muted-foreground">
                            Standard buttons, form elements, and badges.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Buttons */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Buttons</CardTitle>
                                <CardDescription>Primary, Secondary, Outline, and Ghost variants.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                    <Button>Primary Action</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="destructive">Delete</Button>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <Button size="sm">Small</Button>
                                    <Button>Default</Button>
                                    <Button size="lg">Large Button</Button>
                                    <Button disabled>Disabled</Button>
                                    <Button><CheckCircle className="mr-2 h-4 w-4" /> With Icon</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Inputs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Inputs & Forms</CardTitle>
                                <CardDescription>Standard input fields with focus states.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input type="email" id="email" placeholder="user@kohesar.com" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" />
                                    <Label htmlFor="terms">Accept terms and conditions</Label>
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="disabled">Disabled Input</Label>
                                    <Input disabled type="text" id="disabled" placeholder="Cannot type here" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <hr />

                {/* 4. Data Display */}
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">4. Data Display</h2>
                        <p className="text-muted-foreground">
                            Tables, Cards, and Status Badges.
                        </p>
                    </div>

                    <Tabs defaultValue="cards" className="w-full">
                        <TabsList>
                            <TabsTrigger value="cards">Cards</TabsTrigger>
                            <TabsTrigger value="table">Tables</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cards" className="mt-4 grid md:grid-cols-3 gap-6">
                            <Card className="stat-card border-none">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
                                        <h3 className="text-2xl font-bold">1,204</h3>
                                    </div>
                                </div>
                            </Card>
                            <Card className="stat-card border-none">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center text-success">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Active Fleet</p>
                                        <h3 className="text-2xl font-bold">45</h3>
                                    </div>
                                </div>
                            </Card>
                            <Card className="stat-card border-none">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center text-warning">
                                        <Anchor className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                                        <h3 className="text-2xl font-bold">12</h3>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                        <TabsContent value="table" className="mt-4">
                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Shipment ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Origin</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">INV001</TableCell>
                                            <TableCell><Badge className="bg-success hover:bg-success/90">Paid</Badge></TableCell>
                                            <TableCell>Karachi Port</TableCell>
                                            <TableCell className="text-right">$250.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">INV002</TableCell>
                                            <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                                            <TableCell>Lahore Dry Port</TableCell>
                                            <TableCell className="text-right">$150.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">INV003</TableCell>
                                            <TableCell><Badge variant="destructive">Failed</Badge></TableCell>
                                            <TableCell>Islamabad</TableCell>
                                            <TableCell className="text-right">$350.00</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>
            </div>
        </MainLayout>
    );
};

// Helper for Color Swatches
const ColorSwatch = ({ name, token, hex, text }: { name: string, token: string, hex: string, text: string }) => (
    <div className="space-y-2">
        <div className={`h-24 w-full rounded-xl shadow-sm flex items-end p-3 ${token}`}>
            <span className={`text-xs font-mono font-medium opacity-90 ${text}`}>{hex}</span>
        </div>
        <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">var(--{name.toLowerCase()})</p>
        </div>
    </div>
);

export default DesignSystem;
