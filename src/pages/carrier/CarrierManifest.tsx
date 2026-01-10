
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Save, Send, Truck, FileText, MapPin, User, Calendar } from 'lucide-react';

interface CarrierManifest {
    id: string;
    manifest_number: string;
    vehicle_number: string;
    driver_name: string;
    departure_location: string;
    destination_location: string;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
    created_at: string;
}

export default function CarrierManifest() {
    const { user } = useAuth();
    const [manifests, setManifests] = useState<CarrierManifest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'create'>('list');

    // Form State
    const [formData, setFormData] = useState({
        manifest_number: '',
        vehicle_number: '',
        driver_name: '',
        driver_cnic: '',
        departure_location: '',
        destination_location: '',
        gross_weight: '',
        container_numbers: [''], // Array for multiple containers
        seal_numbers: [''] // Array for multiple seals
    });

    useEffect(() => {
        fetchManifests();
    }, [user]);

    const fetchManifests = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('carrier_manifests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setManifests(data || []);
        } catch (error) {
            console.error('Error fetching manifests:', error);
            // toast.error('Failed to load manifests'); // Commented out to avoid noise if table doesn't exist yet
        } finally {
            setIsLoading(false);
        }

        // Generate a random manifest number for new forms
        setFormData(prev => ({ ...prev, manifest_number: `CM-${Math.floor(Math.random() * 10000)}` }));
    };

    const handleContainerChange = (index: number, value: string) => {
        const newContainers = [...formData.container_numbers];
        newContainers[index] = value;
        setFormData({ ...formData, container_numbers: newContainers });
    };

    const addContainer = () => {
        setFormData({ ...formData, container_numbers: [...formData.container_numbers, ''] });
    };

    const handleSealChange = (index: number, value: string) => {
        const newSeals = [...formData.seal_numbers];
        newSeals[index] = value;
        setFormData({ ...formData, seal_numbers: newSeals });
    };

    const addSeal = () => {
        setFormData({ ...formData, seal_numbers: [...formData.seal_numbers, ''] });
    };

    const handleSubmit = async (status: 'DRAFT' | 'SUBMITTED') => {
        if (!user) return;

        try {
            const payload = {
                carrier_user_id: user.id,
                manifest_number: formData.manifest_number,
                vehicle_number: formData.vehicle_number,
                driver_name: formData.driver_name,
                driver_cnic: formData.driver_cnic,
                departure_location: formData.departure_location,
                destination_location: formData.destination_location,
                gross_weight: parseFloat(formData.gross_weight) || 0,
                container_numbers: JSON.stringify(formData.container_numbers.filter(c => c)),
                seal_numbers: JSON.stringify(formData.seal_numbers.filter(s => s)),
                status: status
            };

            // @ts-ignore
            const { error } = await supabase.from('carrier_manifests').insert(payload);

            if (error) throw error;

            toast.success(`Manifest ${status === 'DRAFT' ? 'saved as draft' : 'submitted successfully'}`);
            setView('list');
            fetchManifests();
        } catch (error: any) {
            console.error('Error saving manifest:', error);
            toast.error(error.message || 'Failed to save manifest');
        }
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <Truck className="h-8 w-8 text-primary" />
                        Carrier Manifests
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage transport manifests for bonded carriers.</p>
                </div>
                {view === 'list' && (
                    <Button onClick={() => setView('create')} className="gap-2">
                        <Plus className="h-4 w-4" /> Create New Manifest
                    </Button>
                )}
                {view === 'create' && (
                    <Button variant="outline" onClick={() => setView('list')}>
                        Cancel
                    </Button>
                )}
            </div>

            {view === 'list' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Manifests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading manifests...</div>
                        ) : manifests.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">No manifests found</h3>
                                <p className="text-gray-500">Create your first carrier manifest to get started.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Manifest #</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        {/* <TableHead className="text-right">Actions</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manifests.map((m) => (
                                        <TableRow key={m.id}>
                                            <TableCell className="font-medium">{m.manifest_number}</TableCell>
                                            <TableCell>{m.vehicle_number}</TableCell>
                                            <TableCell>{m.driver_name}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {m.departure_location} <span className="text-primary">→</span> {m.destination_location}
                                            </TableCell>
                                            <TableCell>{new Date(m.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        m.status === 'APPROVED' ? 'default' :
                                                            m.status === 'SUBMITTED' ? 'secondary' : 'outline'
                                                    }
                                                    className={
                                                        m.status === 'APPROVED' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                            m.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''
                                                    }
                                                >
                                                    {m.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card className="max-w-4xl mx-auto border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle>New Manifest Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Manifest Number</Label>
                                <Input value={formData.manifest_number} readOnly className="bg-muted font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label>Vehicle Registration No.</Label>
                                <div className="relative">
                                    <Truck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="e.g. TLA-123"
                                        className="pl-9"
                                        value={formData.vehicle_number}
                                        onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Driver Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Full Name"
                                        className="pl-9"
                                        value={formData.driver_name}
                                        onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Driver CNIC / License</Label>
                                <Input
                                    placeholder="CNIC Number"
                                    value={formData.driver_cnic}
                                    onChange={(e) => setFormData({ ...formData, driver_cnic: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Section 2: Route */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg border border-dashed">
                            <div className="space-y-2">
                                <Label>Departure Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Origin City/Port"
                                        className="pl-9"
                                        value={formData.departure_location}
                                        onChange={(e) => setFormData({ ...formData, departure_location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Destination Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Destination City/Port"
                                        className="pl-9"
                                        value={formData.destination_location}
                                        onChange={(e) => setFormData({ ...formData, destination_location: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Cargo Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="font-semibold">Container Numbers</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={addContainer} className="text-xs h-7">
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                </div>
                                {formData.container_numbers.map((c, i) => (
                                    <Input
                                        key={`cont-${i}`}
                                        placeholder={`Container #${i + 1}`}
                                        value={c}
                                        onChange={(e) => handleContainerChange(i, e.target.value)}
                                        className="font-mono text-sm"
                                    />
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="font-semibold">Seal Numbers</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={addSeal} className="text-xs h-7">
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                </div>
                                {formData.seal_numbers.map((s, i) => (
                                    <Input
                                        key={`seal-${i}`}
                                        placeholder={`Seal #${i + 1}`}
                                        value={s}
                                        onChange={(e) => handleSealChange(i, e.target.value)}
                                        className="font-mono text-sm"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <Button variant="outline" onClick={() => handleSubmit('DRAFT')}>
                                <Save className="h-4 w-4 mr-2" /> Save Draft
                            </Button>
                            <Button onClick={() => handleSubmit('SUBMITTED')}>
                                <Send className="h-4 w-4 mr-2" /> Submit Manifest
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
