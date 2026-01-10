import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { manifestSchema, ManifestFormValues, defaultManifestValues } from "./manifestSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Save, CheckCircle, ArrowLeft } from "lucide-react";

// Reuse existing step components as section blocks
import StepBasicDetails from "./StepBasicDetails";
import StepCarrierVehicle from "./StepCarrierVehicle";
import { StepCustoms } from "./StepCustoms";
import { StepOpsSecurity } from "./StepOpsSecurity";
// import StepShipmentScanning from "./StepShipmentScanning"; // Can be a separate tab or section

const CreateManifestForm = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ManifestFormValues>({
        resolver: zodResolver(manifestSchema),
        defaultValues: defaultManifestValues,
        mode: "onChange",
    });

    const handleSave = async (status: "DRAFT" | "SUBMITTED") => {
        setIsSaving(true);
        const values = form.getValues();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Prepare payload
            const payload = {
                ...values,
                manifest_number: values.manifest_number || `MAN-${Math.floor(Math.random() * 100000)}`,
                created_by: user.id,
                status: status, // Set Draft or Submitted
                // Handle dates
                dispatch_date_time: values.dispatch_date_time ? new Date(values.dispatch_date_time).toISOString() : null,
            };

            const { data, error } = await supabase
                .from("carrier_manifests")
                .insert(payload as any)
                .select()
                .single();

            if (error) throw error;

            toast.success(status === "DRAFT" ? "Manifest Saved as Draft" : "Manifest Submitted Successfully");
            navigate("/carrier/manifests");

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save manifest");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/carrier/manifests")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Carrier Manifest</h1>
                        <p className="text-muted-foreground">Fill minimal details to save draft, or complete all fields to submit.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSave("DRAFT")} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    <Button onClick={() => handleSave("SUBMITTED")} disabled={isSaving} className="bg-slate-900">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit Manifest
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form className="space-y-8">
                    <Tabs defaultValue="route" className="w-full">
                        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 h-auto">
                            <TabsTrigger value="route">1. Route & Schedule</TabsTrigger>
                            <TabsTrigger value="carrier">2. Carrier & Vehicle</TabsTrigger>
                            <TabsTrigger value="customs">3. Customs & Cargo</TabsTrigger>
                            <TabsTrigger value="ops">4. Ops & Security</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="route">
                                <StepBasicDetails form={form} />
                            </TabsContent>
                            <TabsContent value="carrier">
                                <StepCarrierVehicle form={form} />
                            </TabsContent>
                            <TabsContent value="customs">
                                <StepCustoms form={form} />
                            </TabsContent>
                            <TabsContent value="ops">
                                <StepOpsSecurity form={form} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </form>
            </Form>
        </div>
    );
};

export default CreateManifestForm;
