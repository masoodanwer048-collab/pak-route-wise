import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

const formSchema = z.object({
    manifest_number: z.string().min(1, "Manifest number is required"),
    vehicle_number: z.string().min(1, "Vehicle number is required"),
    driver_name: z.string().min(1, "Driver name is required"),
    driver_cnic: z.string().optional(),
    gross_weight: z.string().refine((val) => !isNaN(Number(val)), "Must be a number").optional(),
    departure_location: z.string().optional(),
    destination_location: z.string().optional(),
});

const CreateManifest = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            manifest_number: "",
            vehicle_number: "",
            driver_name: "",
            driver_cnic: "",
            gross_weight: "",
            departure_location: "",
            destination_location: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in to create a manifest");
                return;
            }

            const payload = {
                manifest_number: values.manifest_number,
                vehicle_number: values.vehicle_number,
                driver_name: values.driver_name,
                carrier_user_id: user.id, // Ensure this user exists in app_users for FK constraint or handle appropriately
                driver_cnic: values.driver_cnic,
                gross_weight: values.gross_weight ? Number(values.gross_weight) : null,
                departure_location: values.departure_location,
                destination_location: values.destination_location,
                status: "DRAFT",
            };

            const { error } = await supabase
                .from("carrier_manifests")
                .insert(payload);

            if (error) throw error;

            toast.success("Manifest created successfully");
            navigate("/carrier/manifests");
        } catch (error: any) {
            console.error("Error creating manifest:", error);
            toast.error(error.message || "Failed to create manifest");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Create New Manifest</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manifest Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="manifest_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manifest Number *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. MAN-2024-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="vehicle_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Number *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. ABC-123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gross_weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gross Weight (kg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="driver_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Driver Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Driver Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="driver_cnic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Driver CNIC</FormLabel>
                                            <FormControl>
                                                <Input placeholder="00000-0000000-0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="departure_location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Departure Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="City/Facility" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="destination_location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Destination Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="City/Facility" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {submitting ? "Saving..." : "Create Manifest"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateManifest;
