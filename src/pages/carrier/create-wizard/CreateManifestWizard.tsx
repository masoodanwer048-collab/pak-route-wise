import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { manifestSchema, ManifestFormValues, defaultManifestValues } from "./manifestSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import StepBasicDetails from "./StepBasicDetails";
import StepCarrierVehicle from "./StepCarrierVehicle";
import { StepCustoms } from "./StepCustoms";
import { StepOpsSecurity } from "./StepOpsSecurity";
import StepShipmentScanning from "./StepShipmentScanning";
import StepReview from "./StepReview";

const CreateManifestWizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ManifestFormValues>({
        resolver: zodResolver(manifestSchema),
        defaultValues: defaultManifestValues,
        mode: "onChange",
    });

    // 1: Route, 2: Carrier/Vehicle, 3: Customs, 4: Ops/Security, 5: Scan, 6: Review
    const TOTAL_STEPS = 6;

    const nextStep = async () => {
        // Trigger validation for the current section if needed
        // const isValid = await form.trigger([...fields]); 
        setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const onSubmit = async (values: ManifestFormValues) => {
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Prepare payload
            const payload = {
                ...values,
                manifest_number: values.manifest_number || `MAN-${Math.floor(Math.random() * 100000)}`, // Auto-gen simple ID
                created_by: user.id,
                // Ensure dates are ISO strings if they exist
                dispatch_date_time: values.dispatch_date_time ? new Date(values.dispatch_date_time).toISOString() : null,
                loading_start_time: values.loading_start_time ? new Date(values.loading_start_time).toISOString() : null
            };

            const { data: manifestData, error } = await supabase
                .from("carrier_manifests")
                .insert(payload as any)
                .select()
                .single();

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }
            if (!manifestData) throw new Error("Failed to create manifest (No data returned)");

            // Link scanned shipments
            if (values.shipment_ids && values.shipment_ids.length > 0) {
                const { error: updateError } = await supabase
                    .from("shipments")
                    .update({
                        manifest_id: manifestData.id,
                        manifest_status: 'LOADED'
                    } as any)
                    .in("id", values.shipment_ids);

                if (updateError) {
                    console.error("Error linking shipments:", updateError);
                    toast.error("Manifest created but failed to link all shipments.");
                }
            }

            toast.success("Manifest Created Successfully!");
            navigate("/carrier/manifests");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to create manifest");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Carrier Manifest</h1>
                    <p className="text-muted-foreground">step {step} of {TOTAL_STEPS}: {getStepTitle(step)}</p>
                </div>
            </div>

            {/* Stepper UI */}
            <div className="flex space-x-2 mb-6">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                    const s = i + 1;
                    return (
                        <div
                            key={s}
                            className={`flex-1 h-2 rounded-full transition-all duration-300 ${s <= step ? 'bg-slate-900' : 'bg-slate-200'}`}
                        />
                    );
                })}
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {step === 1 && <StepBasicDetails form={form} />}
                            {step === 2 && <StepCarrierVehicle form={form} />}
                            {step === 3 && <StepCustoms form={form} />}
                            {step === 4 && <StepOpsSecurity form={form} />}
                            {step === 5 && <StepShipmentScanning form={form} />}
                            {step === 6 && <StepReview form={form} />}

                            <div className="flex justify-between pt-6 border-t mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={step === 1 ? () => navigate(-1) : prevStep}
                                >
                                    {step === 1 ? "Cancel" : "Back"}
                                </Button>

                                {step < TOTAL_STEPS ? (
                                    <Button type="button" size="lg" onClick={nextStep}>
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button type="submit" size="lg" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800">
                                        {isSubmitting ? "Generating Manifest..." : "Submit & Create"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

const getStepTitle = (step: number) => {
    switch (step) {
        case 1: return "Route & Basic Info";
        case 2: return "Carrier & Logistics Profile";
        case 3: return "Customs & Documentation";
        case 4: return "Operational & Security";
        case 5: return "Shipment Scanning";
        case 6: return "Review & Submit";
        default: return "";
    }
};

export default CreateManifestWizard;
