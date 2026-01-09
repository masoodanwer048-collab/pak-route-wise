import { UseFormReturn } from "react-hook-form";
import { ManifestFormValues } from "./manifestSchema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const StepOpsSecurity = ({ form }: { form: UseFormReturn<ManifestFormValues> }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">

            {/* Operational Controls */}
            <Card>
                <CardHeader>
                    <CardTitle>Operational Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="trip_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trip ID / Run Sheet</FormLabel>
                                <FormControl><Input placeholder="TRIP-..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="departure_gate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departure Gate</FormLabel>
                                <FormControl><Input placeholder="Gate 1..." {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dispatch_shift"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select Shift" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Morning">Morning</SelectItem>
                                        <SelectItem value="Evening">Evening</SelectItem>
                                        <SelectItem value="Night">Night</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle>Security & Compliance</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="security_guard_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Security Guard Name</FormLabel>
                                <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="security_check_status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Security Check Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || "PENDING"}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PASSED">Passed</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="police_escort_required"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Police Escort Required</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Financials */}
            <Card>
                <CardHeader>
                    <CardTitle>Financials (Estimated)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="carrier_cost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Carrier Cost (PKR)</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fuel_cost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fuel Cost (PKR)</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="toll_charges"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Toll Charges (PKR)</FormLabel>
                                <FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
