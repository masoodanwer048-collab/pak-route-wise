import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from '@/components/layout/MainLayout';

const tsrSchema = z.object({
    requestId: z.string().min(1, "Request ID is required"),
    containerNumber: z.string().min(1, "Container Number is required"),
    manifestNumber: z.string().min(1, "Manifest Number is required"),
    originPort: z.string().min(1, "Origin Port is required"),
    destinationPort: z.string().min(1, "Destination Port is required"),
    transporterName: z.string().min(1, "Transporter Name is required"),
    vehicleNumber: z.string().min(1, "Vehicle Number is required"),
});

type TSRFormValues = z.infer<typeof tsrSchema>;

const TSRFiling = () => {
    const { toast } = useToast();
    const form = useForm<TSRFormValues>({
        resolver: zodResolver(tsrSchema),
        defaultValues: {
            requestId: "",
            containerNumber: "",
            manifestNumber: "",
            originPort: "",
            destinationPort: "",
            transporterName: "",
            vehicleNumber: "",
        },
    });

    const onSubmit = (data: TSRFormValues) => {
        console.log("TSR Filing Data:", data);
        toast({
            title: "TSR Submitted",
            description: `Transshipment Request ${data.requestId} has been filed successfully.`,
        });
        form.reset();
    };

    return (
        <MainLayout title="TSR Filing" subtitle="Submit Transshipment Requests for moving goods between ports">
            <div className="space-y-6 animate-slide-up">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Shipment & Route Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="requestId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Request ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="TSR-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="manifestNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Manifest / IGM Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter manifest number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="containerNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Container Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. ABCD-1234567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="originPort"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Origin Port</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Karachi Port Trust" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="destinationPort"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Destination Port</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Port Qasim / Dry Port" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Transport Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="transporterName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Transporter Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Logistics Company Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Registration No.</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. TUV-123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" size="lg">
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </MainLayout>
    );
};

export default TSRFiling;
