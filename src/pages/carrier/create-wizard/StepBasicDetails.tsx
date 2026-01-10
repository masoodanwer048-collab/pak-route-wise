import { UseFormReturn } from "react-hook-form";
import { ManifestFormValues } from "./manifestSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepBasicDetails = ({ form }: { form: UseFormReturn<ManifestFormValues> }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Route & Schedule</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="manifest_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Manifest Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="LINEHAUL">Linehaul (City to City)</SelectItem>
                                        <SelectItem value="DELIVERY">Delivery (Last Mile)</SelectItem>
                                        <SelectItem value="RTO">RTO (Return)</SelectItem>
                                        <SelectItem value="VENDOR">Vendor / 3PL</SelectItem>
                                        <SelectItem value="CONTAINER">Container Movement</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dispatch_date_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dispatch Date & Time</FormLabel>
                                <FormControl><Input type="datetime-local" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="origin_hub"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Origin Hub *</FormLabel>
                                <FormControl><Input placeholder="e.g. KHI-HUB-01" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="destination_hub"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Destination Hub *</FormLabel>
                                <FormControl><Input placeholder="e.g. LHE-HUB-03" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="route_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Route Name</FormLabel>
                                <FormControl><Input placeholder="e.g. KHI-LHE Express" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="route_code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Route Code</FormLabel>
                                <FormControl><Input placeholder="Optional" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default StepBasicDetails;
