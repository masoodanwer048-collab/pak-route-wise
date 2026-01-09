import { UseFormReturn } from "react-hook-form";
import { ManifestFormValues } from "./manifestSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepCarrierVehicle = ({ form }: { form: UseFormReturn<ManifestFormValues> }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            {/* Carrier Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Carrier Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="carrier_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Carrier Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="OWN_FLEET">Own Fleet</SelectItem>
                                        <SelectItem value="VENDOR">Vendor</SelectItem>
                                        <SelectItem value="3PL">3PL</SelectItem>
                                        <SelectItem value="BUS_CARGO">Bus Cargo</SelectItem>
                                        <SelectItem value="SHIPPING_LINE">Shipping Line</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="carrier_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Carrier Name *</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="carrier_phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Vehicle Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                        control={form.control}
                        name="vehicle_reg_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reg Number *</FormLabel>
                                <FormControl><Input placeholder="ABC-123" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehicle_make"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Make</FormLabel>
                                <FormControl><Input placeholder="e.g. Hino" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehicle_model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl><Input placeholder="e.g. 500 Series" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehicle_color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Technicals */}
                    <FormField
                        control={form.control}
                        name="engine_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Engine No</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="chassis_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chassis No</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fitness_expiry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fitness Expiry</FormLabel>
                                <FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehicle_insurance_expiry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Insurance Expiry</FormLabel>
                                <FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="odometer_start"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Odometer Start</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fuel_level_start"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fuel %</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehicle_capacity_weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity (KG)</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Driver Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Driver & Crew</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="driver_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Driver Name *</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="driver_cnic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Driver CNIC *</FormLabel>
                                <FormControl><Input placeholder="42201-1234567-1" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="driver_mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile No</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="driver_license_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License No</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="driver_license_expiry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Expiry</FormLabel>
                                <FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="driver_emergency_contact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emergency Contact</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default StepCarrierVehicle;
