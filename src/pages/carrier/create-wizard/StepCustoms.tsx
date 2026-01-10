import { UseFormReturn } from "react-hook-form";
import { ManifestFormValues } from "./manifestSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const StepCustoms = ({ form }: { form: UseFormReturn<ManifestFormValues> }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Customs Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="gd_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GD Number</FormLabel>
                                <FormControl><Input placeholder="GD-2024-..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gd_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GD Date</FormLabel>
                                <FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="igm_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>IGM Number</FormLabel>
                                <FormControl><Input placeholder="IGM..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bl_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>BL Number</FormLabel>
                                <FormControl><Input placeholder="BL..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="customs_station_code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Station Code</FormLabel>
                                <FormControl><Input placeholder="KHI-..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shipping_bill_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shipping Bill No</FormLabel>
                                <FormControl><Input placeholder="Display only if applicable" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cargo & Container Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="container_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Container No</FormLabel>
                                <FormControl><Input placeholder="ABCD1234567" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="container_size"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select Size" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="20FT">20FT</SelectItem>
                                        <SelectItem value="40FT">40FT</SelectItem>
                                        <SelectItem value="40HQ">40HQ</SelectItem>
                                        <SelectItem value="LCL">LCL</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="seal_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Seal Number</FormLabel>
                                <FormControl><Input placeholder="Seal #..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pkg_count"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Package Count</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gross_weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gross Weight (KG)</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="commodity_description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-3">
                                <FormLabel>Commodity Description</FormLabel>
                                <FormControl><Textarea placeholder="Describe goods..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Parties Involved</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="consignee_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Consignee Name</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="clearing_agent_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Clearing Agent</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
