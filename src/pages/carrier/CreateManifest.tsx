import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

// UI Components
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Send, FileText, Truck, User, Package, Shield } from "lucide-react";

// --- Schema Definition ---
const manifestSchema = z.object({
    // Required
    manifest_type: z.enum(["LINEHAUL", "DELIVERY", "RTO", "VENDOR", "CONTAINER"], {
        required_error: "Manifest Type is required",
    }),
    dispatch_date_time: z.string().min(1, "Manifest Date is required"),

    // Optional Basic
    manifest_number: z.string().optional(),
    origin_hub: z.string().optional(),
    destination_hub: z.string().optional(),
    status: z.enum(["DRAFT", "SUBMITTED", "LOADING", "IN_TRANSIT", "RECEIVED", "CLOSED", "CANCELLED"]).optional(),
    route_name: z.string().optional(),
    expected_arrival_date_time: z.string().optional(),
    remarks: z.string().optional(),

    // Driver Details
    driver_name: z.string().optional(),
    driver_cnic: z.string().optional(),
    driver_mobile: z.string().optional(),
    driver_license_no: z.string().optional(),
    driver_license_expiry: z.string().optional(),
    driver_address: z.string().optional(),
    driver_emergency_contact: z.string().optional(),

    // Vehicle Details
    vehicle_reg_no: z.string().optional(),
    vehicle_type: z.string().optional(),
    vehicle_make: z.string().optional(),
    vehicle_model: z.string().optional(),
    vehicle_year: z.string().optional(),
    engine_no: z.string().optional(),
    chassis_no: z.string().optional(),
    vehicle_insurance_expiry: z.string().optional(),
    tracker_id: z.string().optional(),
    carrier_name: z.string().optional(),
    carrier_phone: z.string().optional(),

    // Customs/Shipping
    gd_number: z.string().optional(),
    gd_date: z.string().optional(),
    igm_number: z.string().optional(),
    ngm_number: z.string().optional(),
    index_number: z.string().optional(),
    bl_number: z.string().optional(),
    shipping_bill_number: z.string().optional(),
    container_no: z.string().optional(),
    container_size: z.string().optional(),
    container_type: z.string().optional(),
    seal_no: z.string().optional(),

    // Maritime / Vessel
    vessel_name: z.string().optional(),
    voyage_number: z.string().optional(),
    port_of_loading: z.string().optional(),
    port_of_discharge: z.string().optional(),

    // Cargo / Packages
    pkg_count: z.coerce.number().optional(),
    pkg_type: z.string().optional(),
    gross_weight: z.coerce.number().optional(),
    net_weight: z.coerce.number().optional(),
    volume_cbm: z.coerce.number().optional(),
    commodity_description: z.string().optional(),
    hs_code: z.string().optional(),

    // Parties
    consignee_name: z.string().optional(),
    consignee_phone: z.string().optional(),
    consignee_address: z.string().optional(),
    shipper_name: z.string().optional(),
    shipper_phone: z.string().optional(),
    clearing_agent_name: z.string().optional(),
    clearing_agent_phone: z.string().optional(),
    clearing_agent_ntn: z.string().optional(),
});

type ManifestFormValues = z.infer<typeof manifestSchema>;

// --- DB Column Whitelist (Safe Save) ---
// Minimal set of columns that are guaranteed to exist in the database
const SYSTEM_COLUMNS = ["created_by", "updated_by", "created_at", "updated_at", "submitted_by", "submitted_at", "carrier_user_id"];

const CORE_DB_COLUMNS = [
    "id", ...SYSTEM_COLUMNS,
    "manifest_type", "manifest_number", "origin_hub", "destination_hub", "status",
    "route_name", "dispatch_date_time", "expected_arrival_date_time", "remarks"
];

const EXTENDED_DB_COLUMNS = [
    "driver_name", "driver_cnic", "driver_mobile", "driver_license_no",
    "driver_license_expiry", "driver_address", "driver_emergency_contact",
    "vehicle_reg_no", "vehicle_type", "vehicle_make", "vehicle_model", "vehicle_year",
    "engine_no", "chassis_no", "vehicle_insurance_expiry", "tracker_id",
    "carrier_name", "carrier_phone",
    "gd_number", "gd_date", "igm_number", "ngm_number", "index_number",
    "bl_number", "shipping_bill_number",
    "container_no", "container_size", "container_type", "seal_no",
    "vessel_name", "voyage_number", "port_of_loading", "port_of_discharge",
    "pkg_count", "pkg_type", "gross_weight", "net_weight", "volume_cbm",
    "commodity_description", "hs_code",
    "consignee_name", "consignee_phone", "consignee_address",
    "shipper_name", "shipper_phone",
    "clearing_agent_name", "clearing_agent_phone", "clearing_agent_ntn"
];

const CreateManifest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit");
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user: authUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ... (rest of the code remains the same until sanitizePayload)

    const form = useForm<ManifestFormValues>({
        resolver: zodResolver(manifestSchema),
        defaultValues: {
            manifest_type: "LINEHAUL",
            dispatch_date_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            status: "DRAFT",
            manifest_number: "",
            origin_hub: "", destination_hub: "",
            route_name: "",
            expected_arrival_date_time: "",
            remarks: "",

            driver_name: "", driver_cnic: "", driver_mobile: "",
            driver_license_no: "", driver_license_expiry: "",
            driver_address: "", driver_emergency_contact: "",

            vehicle_reg_no: "", vehicle_type: "",
            vehicle_make: "", vehicle_model: "", vehicle_year: "",
            engine_no: "", chassis_no: "",
            vehicle_insurance_expiry: "", tracker_id: "",
            carrier_name: "", carrier_phone: "",

            gd_number: "", gd_date: "",
            igm_number: "", ngm_number: "", index_number: "",
            bl_number: "", shipping_bill_number: "",
            container_no: "", container_size: "", container_type: "",
            seal_no: "",

            vessel_name: "", voyage_number: "",
            port_of_loading: "", port_of_discharge: "",

            pkg_count: 0, pkg_type: "",
            gross_weight: 0, net_weight: 0, volume_cbm: 0,
            commodity_description: "", hs_code: "",

            consignee_name: "", consignee_phone: "", consignee_address: "",
            shipper_name: "", shipper_phone: "",
            clearing_agent_name: "", clearing_agent_phone: "", clearing_agent_ntn: ""
        },
    });

    useEffect(() => {
        if (editId) {
            setIsEditMode(true);
            loadManifest(editId);
        }

        const params = new URLSearchParams(location.search);
        if (params.get("action") === "submit") {
            params.delete("action");
            navigate({ search: params.toString() }, { replace: true });

            setTimeout(() => {
                const storedUser = localStorage.getItem('demo_user');
                if (storedUser) {
                    form.handleSubmit((v) => handleSave(v, true))();
                }
            }, 800);
        }
    }, [editId, location.search]);

    const loadManifest = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("carrier_manifests")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            if (data) {
                const formattedDate = data.dispatch_date_time
                    ? format(new Date(data.dispatch_date_time), "yyyy-MM-dd'T'HH:mm")
                    : format(new Date(), "yyyy-MM-dd'T'HH:mm");

                const formattedArrival = data.expected_arrival_date_time
                    ? format(new Date(data.expected_arrival_date_time), "yyyy-MM-dd'T'HH:mm")
                    : "";

                const formattedGDDate = data.gd_date
                    ? format(new Date(data.gd_date), "yyyy-MM-dd")
                    : "";

                form.reset({
                    ...data,
                    dispatch_date_time: formattedDate,
                    expected_arrival_date_time: formattedArrival,
                    gd_date: formattedGDDate,
                    driver_name: data.driver_name || "",
                    driver_cnic: data.driver_cnic || "",
                    vehicle_reg_no: data.vehicle_reg_no || "",
                } as any);
            }
        } catch (error) {
            console.error("Error loading manifest:", error);
            toast.error("Failed to load manifest details");
        } finally {
            setLoading(false);
        }
    };

    const sanitizePayload = (values: any, useExtended: boolean = true) => {
        const clean: any = {};
        const allowedColumns = useExtended ? [...CORE_DB_COLUMNS, ...EXTENDED_DB_COLUMNS] : CORE_DB_COLUMNS;

        Object.keys(values).forEach(key => {
            if (allowedColumns.includes(key)) {
                if (values[key] === "") {
                    clean[key] = null;
                } else {
                    clean[key] = values[key];
                }
            } else {
                console.warn(`[Sanitizer] Removed unknown key: ${key}`);
            }
        });
        return clean;
    };

    const saveToSupabase = async (payload: any, id?: string | null) => {
        if (id) {
            const { error } = await supabase.from("carrier_manifests").update(payload).eq("id", id);
            if (error) throw error;
            return id;
        } else {
            const { data, error } = await supabase.from("carrier_manifests").insert(payload).select().single();
            if (error) throw error;
            return data.id;
        }
    };

    const handleSave = async (values: ManifestFormValues, isSubmit: boolean = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setLoading(true);

        try {
            let currentUser = authUser;
            if (!currentUser) {
                const storedUser = localStorage.getItem('demo_user');
                if (storedUser) {
                    currentUser = JSON.parse(storedUser);
                }
            }

            if (isSubmit && !currentUser) {
                toast.info("Please login to submit the manifest.");
                const currentPath = location.pathname + location.search + (location.search ? "&" : "?") + "action=submit";
                navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
                return;
            }

            // Validation: Require Vehicle Number & Driver Name on Submit
            if (isSubmit) {
                const missingFields = [];
                if (!values.vehicle_reg_no) missingFields.push("Vehicle Registration No");
                if (!values.driver_name) missingFields.push("Driver Name");

                if (missingFields.length > 0) {
                    toast.error(`${missingFields.join(" & ")} required to submit.`);
                    setLoading(false);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Ensure Created By is valid text or null
            let userId = currentUser?.id ? String(currentUser.id) : null;

            // Fallback for demo users
            if (!userId) {
                const storedUser = localStorage.getItem('demo_user');
                if (storedUser) {
                    userId = JSON.parse(storedUser).id;
                }
            }

            const rawPayload = {
                ...values,
                status: isSubmit ? "SUBMITTED" : (values.status || "DRAFT"),
                manifest_number: values.manifest_number || `MAN-${format(new Date(), "yyyyMMdd")}-${Math.floor(Math.random() * 1000)}`,
                created_by: userId,
                carrier_user_id: userId, // Add carrier_user_id for logged in users
                updated_at: new Date().toISOString(),
                submitted_by: isSubmit ? userId : null,
                submitted_at: isSubmit ? new Date().toISOString() : null,
                dispatch_date_time: values.dispatch_date_time ? new Date(values.dispatch_date_time).toISOString() : null,
                expected_arrival_date_time: values.expected_arrival_date_time ? new Date(values.expected_arrival_date_time).toISOString() : null,
                gd_date: values.gd_date ? new Date(values.gd_date).toISOString() : null,
                driver_license_expiry: values.driver_license_expiry ? new Date(values.driver_license_expiry).toISOString() : null,
                vehicle_insurance_expiry: values.vehicle_insurance_expiry ? new Date(values.vehicle_insurance_expiry).toISOString() : null,
            };

            let manifestId = editId;
            let saveSuccess = false;

            // Attempt 1: Full Save (Extended Fields)
            try {
                const payload = sanitizePayload(rawPayload, true);
                console.log("Attempting Full Save...", payload);
                manifestId = await saveToSupabase(payload, editId);
                saveSuccess = true;
            } catch (fullError: any) {
                console.warn("Full save failed, attempting minimal save...", fullError);

                // Check if error is related to missing columns
                if (fullError.message?.includes("Could not find the") || fullError.code === "42703") { // 42703 is undefined_column
                    // Attempt 2: Minimal Save (Core Fields Only)
                    const corePayload = sanitizePayload(rawPayload, false);
                    console.log("Attempting Minimal Save...", corePayload);
                    manifestId = await saveToSupabase(corePayload, editId);
                    saveSuccess = true;
                    toast.warning("Manifest saved with basic details only. Please ask admin to run migration script.");
                } else {
                    throw fullError; // Re-throw other errors (auth, etc.)
                }
            }

            if (saveSuccess) {
                toast.success(isSubmit ? "Manifest Submitted Successfully" : "Manifest Saved Successfully");
                if (manifestId) {
                    navigate(`/carrier/manifests/${manifestId}`);
                } else {
                    navigate("/carrier/manifests");
                }
            }

        } catch (error: any) {
            console.error("Error saving manifest:", error);
            if (error.message?.includes("JWT")) {
                toast.error("Session expired. Please login again.");
            } else if (error.message?.includes("Failed to fetch")) {
                toast.error("Network Error: Unable to connect to server. Please check your internet connection or URL configuration.");
            } else {
                toast.error(`Error: ${error.message || "Unable to save manifest"}`);
            }
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
            <div className="flex flex-col items-center justify-center border-b pb-6 space-y-2">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">KOHSAR LOGISTICS (PRIVATE) LIMITED</h1>
                    <p className="text-sm font-medium text-slate-500 italic">"KEEP THE LORD ON THE ROAD"</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/carrier/manifests")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">
                            {isEditMode ? "Edit Manifest" : "Create Carrier Manifest"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {isEditMode ? "Update details below" : "Fill minimal details to save draft"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={form.handleSubmit((v) => handleSave(v, false))}
                        disabled={loading}
                    >
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button
                        onClick={form.handleSubmit((v) => handleSave(v, true))}
                        disabled={loading}
                        className="bg-slate-900 text-white hover:bg-slate-800"
                    >
                        <Send className="mr-2 h-4 w-4" /> Submit Manifest
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-5 w-5 text-slate-500" /> Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="manifest_type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manifest Type *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || "LINEHAUL"}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="LINEHAUL">Linehaul</SelectItem>
                                            <SelectItem value="DELIVERY">Delivery</SelectItem>
                                            <SelectItem value="RTO">RTO</SelectItem>
                                            <SelectItem value="VENDOR">Vendor</SelectItem>
                                            <SelectItem value="CONTAINER">Container</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="dispatch_date_time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manifest Date *</FormLabel>
                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="manifest_number" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manifest Number (Auto)</FormLabel>
                                    <FormControl><Input placeholder="Auto-generated if empty" {...field} /></FormControl>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="origin_hub" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Origin Hub</FormLabel>
                                    <FormControl><Input placeholder="e.g. Lahore Hub" {...field} /></FormControl>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="destination_hub" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination Hub</FormLabel>
                                    <FormControl><Input placeholder="e.g. Karachi Port" {...field} /></FormControl>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="route_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Route Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. LHE-KHI Express" {...field} /></FormControl>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="expected_arrival_date_time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Arrival</FormLabel>
                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Accordion type="multiple" defaultValue={["driver", "vehicle", "customs", "packages"]} className="space-y-4">
                        <AccordionItem value="driver" className="border rounded-lg bg-white px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <User className="h-5 w-5 text-slate-500" /> Driver & Carrier
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="driver_name" render={({ field }) => (
                                    <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="driver_cnic" render={({ field }) => (
                                    <FormItem><FormLabel>CNIC</FormLabel><FormControl><Input placeholder="35202-..." {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="driver_mobile" render={({ field }) => (
                                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="driver_license_no" render={({ field }) => (
                                    <FormItem><FormLabel>License No</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="driver_license_expiry" render={({ field }) => (
                                    <FormItem><FormLabel>License Expiry</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="driver_emergency_contact" render={({ field }) => (
                                    <FormItem><FormLabel>Emergency Contact</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="driver_address" render={({ field }) => (
                                    <FormItem className="md:col-span-3"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <div className="col-span-full border-t pt-4 mt-2 mb-2"><h4 className="font-semibold text-sm text-slate-500">Carrier Info</h4></div>
                                <FormField control={form.control} name="carrier_name" render={({ field }) => (
                                    <FormItem><FormLabel>Carrier/Vendor Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="carrier_phone" render={({ field }) => (
                                    <FormItem><FormLabel>Carrier Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="vehicle" className="border rounded-lg bg-white px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Truck className="h-5 w-5 text-slate-500" /> Vehicle Details
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="vehicle_reg_no" render={({ field }) => (
                                    <FormItem><FormLabel>Registration No</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="vehicle_type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vehicle Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="TRUCK">Truck</SelectItem>
                                                <SelectItem value="VAN">Van</SelectItem>
                                                <SelectItem value="CONTAINER">Container</SelectItem>
                                                <SelectItem value="BIKE">Bike</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="vehicle_make" render={({ field }) => (
                                    <FormItem><FormLabel>Make</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="vehicle_model" render={({ field }) => (
                                    <FormItem><FormLabel>Model</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="vehicle_year" render={({ field }) => (
                                    <FormItem><FormLabel>Model Year</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="vehicle_insurance_expiry" render={({ field }) => (
                                    <FormItem><FormLabel>Insurance Expiry</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="engine_no" render={({ field }) => (
                                    <FormItem><FormLabel>Engine No</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="chassis_no" render={({ field }) => (
                                    <FormItem><FormLabel>Chassis No</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="tracker_id" render={({ field }) => (
                                    <FormItem><FormLabel>Tracking ID</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="customs" className="border rounded-lg bg-white px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Shield className="h-5 w-5 text-slate-500" /> Customs & Shipping
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
// No changes needed as inputs are already editable.
                                // The previous issue was likely perceived due to UI layout or missing values.
                                // I will ensure all GD fields are explicitly mapped and standard Inputs.

                                <FormField control={form.control} name="gd_number" render={({ field }) => (
                                    <FormItem><FormLabel>GD Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="gd_date" render={({ field }) => (
                                    <FormItem><FormLabel>GD Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="igm_number" render={({ field }) => (
                                    <FormItem><FormLabel>IGM / MGM Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="ngm_number" render={({ field }) => (
                                    <FormItem><FormLabel>NGM Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="index_number" render={({ field }) => (
                                    <FormItem><FormLabel>Index Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="bl_number" render={({ field }) => (
                                    <FormItem><FormLabel>BL Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="shipping_bill_number" render={({ field }) => (
                                    <FormItem><FormLabel>Shipping Bill No</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />

                                <div className="col-span-full border-t pt-4 mt-2 mb-2"><h4 className="font-semibold text-sm text-slate-500">Container Details</h4></div>

                                <FormField control={form.control} name="container_no" render={({ field }) => (
                                    <FormItem><FormLabel>Container No(s)</FormLabel><FormControl><Input placeholder="Comma separated" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="container_size" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="20FT">20FT</SelectItem>
                                                <SelectItem value="40FT">40FT</SelectItem>
                                                <SelectItem value="40HQ">40HQ</SelectItem>
                                                <SelectItem value="LCL">LCL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="container_type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="DRY">Dry</SelectItem>
                                                <SelectItem value="REEFER">Reefer</SelectItem>
                                                <SelectItem value="OPEN_TOP">Open Top</SelectItem>
                                                <SelectItem value="FLAT_RACK">Flat Rack</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="seal_no" render={({ field }) => (
                                    <FormItem><FormLabel>Seal Number(s)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />

                                <div className="col-span-full border-t pt-4 mt-2 mb-2"><h4 className="font-semibold text-sm text-slate-500">Maritime / Vessel</h4></div>
                                <FormField control={form.control} name="vessel_name" render={({ field }) => (
                                    <FormItem><FormLabel>Vessel Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="voyage_number" render={({ field }) => (
                                    <FormItem><FormLabel>Rotation / Voyage No</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="port_of_loading" render={({ field }) => (
                                    <FormItem><FormLabel>Port of Loading</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="port_of_discharge" render={({ field }) => (
                                    <FormItem><FormLabel>Port of Discharge</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="packages" className="border rounded-lg bg-white px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Package className="h-5 w-5 text-slate-500" /> Packages & Goods
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="pkg_count" render={({ field }) => (
                                    <FormItem><FormLabel>No. of Packages</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="pkg_type" render={({ field }) => (
                                    <FormItem><FormLabel>Package Type</FormLabel><FormControl><Input placeholder="Cartons, Pallets..." {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="gross_weight" render={({ field }) => (
                                    <FormItem><FormLabel>Gross Weight (KG)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="net_weight" render={({ field }) => (
                                    <FormItem><FormLabel>Net Weight (KG)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="volume_cbm" render={({ field }) => (
                                    <FormItem><FormLabel>Volume (CBM)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="hs_code" render={({ field }) => (
                                    <FormItem><FormLabel>HS Code</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="commodity_description" render={({ field }) => (
                                    <FormItem className="md:col-span-3"><FormLabel>Commodity Description</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="parties" className="border rounded-lg bg-white px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <User className="h-5 w-5 text-slate-500" /> Parties (Consignee / Shipper)
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="shipper_name" render={({ field }) => (
                                    <FormItem><FormLabel>Shipper Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="shipper_phone" render={({ field }) => (
                                    <FormItem><FormLabel>Shipper Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <div className="hidden md:block"></div>

                                <FormField control={form.control} name="consignee_name" render={({ field }) => (
                                    <FormItem><FormLabel>Consignee Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="consignee_phone" render={({ field }) => (
                                    <FormItem><FormLabel>Consignee Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="consignee_address" render={({ field }) => (
                                    <FormItem><FormLabel>Consignee Address</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />

                                <div className="col-span-full border-t pt-4 mt-2 mb-2"><h4 className="font-semibold text-sm text-slate-500">Creating Agent</h4></div>
                                <FormField control={form.control} name="clearing_agent_name" render={({ field }) => (
                                    <FormItem><FormLabel>Agent Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="clearing_agent_phone" render={({ field }) => (
                                    <FormItem><FormLabel>Agent Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="clearing_agent_ntn" render={({ field }) => (
                                    <FormItem><FormLabel>Agent NTN</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="remarks" className="border rounded-lg bg-white px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Package className="h-5 w-5 text-slate-500" /> Remarks & Notes
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <FormField control={form.control} name="remarks" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Any additional notes..." className="min-h-[100px]" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </form>
            </Form>
        </div>
    );
};

export default CreateManifest;
