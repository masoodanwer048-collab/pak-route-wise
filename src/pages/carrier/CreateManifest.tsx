import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth, MOCK_USERS } from "@/contexts/AuthContext";
import "leaflet/dist/leaflet.css";

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
    // Completely Disable Validations - Accept EVERYTHING as nullable/optional
    manifest_type: z.any().optional(),
    dispatch_date_time: z.any().optional(),
    manifest_number: z.any().optional(),
    origin_hub: z.any().optional(),
    destination_hub: z.any().optional(),
    status: z.any().optional(),
    route_name: z.any().optional(),
    expected_arrival_date_time: z.any().optional(),
    remarks: z.any().optional(),
    driver_name: z.any().optional(),
    driver_cnic: z.any().optional(),
    driver_mobile: z.any().optional(),
    driver_license_no: z.any().optional(),
    driver_license_expiry: z.any().optional(),
    driver_address: z.any().optional(),
    driver_emergency_contact: z.any().optional(),
    vehicle_reg_no: z.any().optional(),
    vehicle_type: z.any().optional(),
    vehicle_make: z.any().optional(),
    vehicle_model: z.any().optional(),
    vehicle_year: z.any().optional(),
    engine_no: z.any().optional(),
    chassis_no: z.any().optional(),
    vehicle_insurance_expiry: z.any().optional(),
    tracker_id: z.any().optional(),
    carrier_name: z.any().optional(),
    carrier_phone: z.any().optional(),
    gd_number: z.any().optional(),
    gd_date: z.any().optional(),
    igm_number: z.any().optional(),
    ngm_number: z.any().optional(),
    index_number: z.any().optional(),
    bl_number: z.any().optional(),
    shipping_bill_number: z.any().optional(),
    container_no: z.any().optional(),
    container_size: z.any().optional(),
    container_type: z.any().optional(),
    seal_no: z.any().optional(),
    vessel_name: z.any().optional(),
    voyage_number: z.any().optional(),
    port_of_loading: z.any().optional(),
    port_of_discharge: z.any().optional(),
    pkg_count: z.any().optional(),
    pkg_type: z.any().optional(),
    gross_weight: z.any().optional(),
    net_weight: z.any().optional(),
    volume_cbm: z.any().optional(),
    commodity_description: z.any().optional(),
    hs_code: z.any().optional(),
    consignee_name: z.any().optional(),
    consignee_phone: z.any().optional(),
    consignee_address: z.any().optional(),
    shipper_name: z.any().optional(),
    shipper_phone: z.any().optional(),
    clearing_agent_name: z.any().optional(),
    clearing_agent_phone: z.any().optional(),
    clearing_agent_ntn: z.any().optional(),
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

// --- Strict Schema Removed ---
// We no longer enforce ANY strict validation for submission.
// const strictManifestSchema = ... (removed)

const CreateManifest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit");
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { user: authUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<string>("DRAFT"); // Track existing status

    // ... (rest of the code remains the same until sanitizePayload)

    const form = useForm<ManifestFormValues>({
        resolver: zodResolver(manifestSchema),
        mode: "onSubmit", // Only validate on submit, not on change
        reValidateMode: "onSubmit", // Only revalidate on submit
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
            console.log("Loading manifest data for ID:", id);
            const { data: rawData, error } = await supabase
                .from("carrier_manifests")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }

            if (rawData) {
                const data = rawData as any;
                console.log("Manifest Data Loaded:", data);

                const safeStr = (val: any) => (val === null || val === undefined) ? "" : String(val);
                const safeNum = (val: any) => (val === null || val === undefined || val === "") ? 0 : Number(val);

                const formattedDate = data.dispatch_date_time
                    ? format(new Date(data.dispatch_date_time), "yyyy-MM-dd'T'HH:mm")
                    : format(new Date(), "yyyy-MM-dd'T'HH:mm");

                const formattedArrival = data.expected_arrival_date_time
                    ? format(new Date(data.expected_arrival_date_time), "yyyy-MM-dd'T'HH:mm")
                    : "";

                const formattedGDDate = data.gd_date
                    ? format(new Date(data.gd_date), "yyyy-MM-dd")
                    : "";

                const formattedLicenseExpiry = data.driver_license_expiry
                    ? format(new Date(data.driver_license_expiry), "yyyy-MM-dd")
                    : "";

                const formattedInsuranceExpiry = data.vehicle_insurance_expiry
                    ? format(new Date(data.vehicle_insurance_expiry), "yyyy-MM-dd")
                    : "";

                // Explicitly map EVERY field to ensure no nulls slip through
                const safeData: ManifestFormValues = {
                    manifest_type: (data.manifest_type as any) || "LINEHAUL",
                    dispatch_date_time: formattedDate,
                    status: (data.status as any) || "DRAFT",
                    
                    manifest_number: safeStr(data.manifest_number),
                    origin_hub: safeStr(data.origin_hub),
                    destination_hub: safeStr(data.destination_hub),
                    route_name: safeStr(data.route_name),
                    expected_arrival_date_time: formattedArrival,
                    remarks: safeStr(data.remarks),

                    // Driver
                    driver_name: safeStr(data.driver_name),
                    driver_cnic: safeStr(data.driver_cnic),
                    driver_mobile: safeStr(data.driver_mobile),
                    driver_license_no: safeStr(data.driver_license_no),
                    driver_license_expiry: formattedLicenseExpiry,
                    driver_address: safeStr(data.driver_address),
                    driver_emergency_contact: safeStr(data.driver_emergency_contact),

                    // Vehicle
                    vehicle_reg_no: safeStr(data.vehicle_reg_no),
                    vehicle_type: safeStr(data.vehicle_type),
                    vehicle_make: safeStr(data.vehicle_make),
                    vehicle_model: safeStr(data.vehicle_model),
                    vehicle_year: safeStr(data.vehicle_year),
                    engine_no: safeStr(data.engine_no),
                    chassis_no: safeStr(data.chassis_no),
                    vehicle_insurance_expiry: formattedInsuranceExpiry,
                    tracker_id: safeStr(data.tracker_id),
                    carrier_name: safeStr(data.carrier_name),
                    carrier_phone: safeStr(data.carrier_phone),

                    // Customs
                    gd_number: safeStr(data.gd_number),
                    gd_date: formattedGDDate,
                    igm_number: safeStr(data.igm_number),
                    ngm_number: safeStr(data.ngm_number),
                    index_number: safeStr(data.index_number),
                    bl_number: safeStr(data.bl_number),
                    shipping_bill_number: safeStr(data.shipping_bill_number),
                    container_no: safeStr(data.container_no),
                    container_size: safeStr(data.container_size),
                    container_type: safeStr(data.container_type),
                    seal_no: safeStr(data.seal_no),

                    // Maritime
                    vessel_name: safeStr(data.vessel_name),
                    voyage_number: safeStr(data.voyage_number),
                    port_of_loading: safeStr(data.port_of_loading),
                    port_of_discharge: safeStr(data.port_of_discharge),

                    // Cargo
                    pkg_count: safeNum(data.pkg_count),
                    pkg_type: safeStr(data.pkg_type),
                    gross_weight: safeNum(data.gross_weight),
                    net_weight: safeNum(data.net_weight),
                    volume_cbm: safeNum(data.volume_cbm),
                    commodity_description: safeStr(data.commodity_description),
                    hs_code: safeStr(data.hs_code),

                    // Parties
                    consignee_name: safeStr(data.consignee_name),
                    consignee_phone: safeStr(data.consignee_phone),
                    consignee_address: safeStr(data.consignee_address),
                    shipper_name: safeStr(data.shipper_name),
                    shipper_phone: safeStr(data.shipper_phone),
                    clearing_agent_name: safeStr(data.clearing_agent_name),
                    clearing_agent_phone: safeStr(data.clearing_agent_phone),
                    clearing_agent_ntn: safeStr(data.clearing_agent_ntn),
                };
                
                setCurrentStatus(data.status || "DRAFT");
                console.log("Resetting form with Safe Data:", safeData);
                form.reset(safeData);
            } else {
                console.warn("No data found for ID:", id);
                toast.error("Manifest not found or access denied.");
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
        // Fields that SHOULD be null if empty (Dates, FKs, Enums that are optional)
        const nullableFields = [
            "dispatch_date_time", "expected_arrival_date_time", "gd_date",
            "driver_license_expiry", "vehicle_insurance_expiry",
            "submitted_at", "submitted_by", "created_by", "updated_by", "carrier_user_id"
        ];

        Object.keys(values).forEach(key => {
            if (allowedColumns.includes(key)) {
                if (values[key] === "" || values[key] === undefined) {
                    // Only set to null if it's explicitly a nullable field (Dates, FKs)
                    if (nullableFields.includes(key)) {
                        clean[key] = null;
                    } else {
                        // For regular text fields, keep as empty string if it was empty string
                        // But if it was undefined, we might want to ignore it? 
                        // Actually, if it's undefined in 'values', it means it wasn't passed.
                        // But here we are iterating Object.keys(values).
                        // So if values[key] is undefined, it exists as a key with undefined value.
                        // We'll treat undefined as null for nullable fields, or empty string for others?
                        // Safest is:
                        clean[key] = nullableFields.includes(key) ? null : "";
                    }
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
            // ... (Auth Logic) ...
            if (!currentUser) {
                const storedUser = localStorage.getItem('demo_user');
                if (storedUser) {
                    currentUser = JSON.parse(storedUser);
                }
            }

            // Validation: Minimal safety for submission (Session check only)
            if (isSubmit && !currentUser) {
                toast.info("Please login to submit the manifest.");
                const currentPath = location.pathname + location.search + (location.search ? "&" : "?") + "action=submit";
                navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
                return;
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

            // --- FK SAFETY FIX ---
            const isMockUser = Object.values(MOCK_USERS).some(u => u.id === userId);
            const safeCarrierUserId = isMockUser ? null : userId;

            // --- STRICT VALIDATION FOR NEW SUBMISSIONS REMOVED ---
            // We now allow submission of ANY payload, even with empty fields.
            /*
            if (isSubmit && currentStatus !== "SUBMITTED") {
                 const validationResult = strictManifestSchema.safeParse(values);
                 if (!validationResult.success) {
                     // ...
                 }
            }
            */

            // --- PARTIAL UPDATE LOGIC ---
            // If editing, try to only send changed fields to prevent overwriting missing data with nulls
            // BUT: If the user explicitly cleared a field, we MUST send null.
            // Our sanitizePayload handles "" -> null.
            // So we need to construct a payload that includes:
            // 1. All DIRTY fields (what user touched)
            // 2. REQUIRED system fields (updated_at, etc.)
            // 3. If NOT dirty, do not include in payload (so Supabase ignores it)

            let payloadToSanitize: any = {};

            if (editId && Object.keys(form.formState.dirtyFields).length > 0) {
                console.log("Partial Update Mode. Dirty fields:", form.formState.dirtyFields);
                
                // Copy dirty values
                Object.keys(form.formState.dirtyFields).forEach((key) => {
                    const k = key as keyof ManifestFormValues;
                    payloadToSanitize[k] = values[k];
                });

                // Always include system fields for update
                payloadToSanitize.updated_at = new Date().toISOString();
                if (isSubmit) {
                    payloadToSanitize.status = "SUBMITTED";
                    payloadToSanitize.submitted_by = userId;
                    payloadToSanitize.submitted_at = new Date().toISOString();
                } else {
                    // If just saving draft, keep existing status unless changed
                    if (form.formState.dirtyFields.status) {
                        payloadToSanitize.status = values.status;
                    }
                }
                
                // If specific critical fields are dirty, ensure dependencies are met?
                // For now, trust the dirty tracking.

            } else {
                // Full Save (New Record OR No Dirty tracking available/reliable)
                // Or user didn't change anything but clicked save (maybe to submit)
                console.log("Full Update Mode.");
                payloadToSanitize = {
                    ...values,
                    status: isSubmit ? "SUBMITTED" : (values.status || "DRAFT"),
                    manifest_number: values.manifest_number || `MAN-${format(new Date(), "yyyyMMdd")}-${Math.floor(Math.random() * 1000)}`,
                    created_by: safeCarrierUserId,
                    carrier_user_id: safeCarrierUserId,
                    updated_at: new Date().toISOString(),
                    submitted_by: isSubmit ? userId : null,
                    submitted_at: isSubmit ? new Date().toISOString() : null,
                    dispatch_date_time: values.dispatch_date_time ? new Date(values.dispatch_date_time).toISOString() : null,
                    expected_arrival_date_time: values.expected_arrival_date_time ? new Date(values.expected_arrival_date_time).toISOString() : null,
                    gd_date: values.gd_date ? new Date(values.gd_date).toISOString() : null,
                    driver_license_expiry: values.driver_license_expiry ? new Date(values.driver_license_expiry).toISOString() : null,
                    vehicle_insurance_expiry: values.vehicle_insurance_expiry ? new Date(values.vehicle_insurance_expiry).toISOString() : null,
                };
            }

            let manifestId = editId;
            let saveSuccess = false;

            // Use the payloadToSanitize
            try {
                // If partial, useExtended should probably be true to allow all columns, 
                // but sanitizePayload filters by DB columns anyway.
                const payload = sanitizePayload(payloadToSanitize, true);
                
                console.log("Saving Payload...", payload);
                manifestId = await saveToSupabase(payload, editId);
                saveSuccess = true;
            } catch (fullError: any) {
                console.warn("Save failed", fullError);
                if (fullError.message?.includes("Could not find the") || fullError.code === "42703") {
                     // Fallback for missing columns (mostly for Full Save scenarios)
                     // For Partial Save, this is less likely unless we try to update a missing column
                    const corePayload = sanitizePayload(payloadToSanitize, false);
                    manifestId = await saveToSupabase(corePayload, editId);
                    saveSuccess = true;
                } else {
                    throw fullError;
                }
            }
            // ...

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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">KOHESAR LOGISTICS (PRIVATE) LIMITED</h1>
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
                                    <FormLabel>Manifest Type</FormLabel>
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
                                    {/* <FormMessage /> */}
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="dispatch_date_time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manifest Date</FormLabel>
                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                    {/* <FormMessage /> */}
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
                                    <FormControl><Input placeholder="e.g. Karachi Hub" {...field} /></FormControl>
                                    {/* <FormMessage /> */}
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="destination_hub" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination Hub</FormLabel>
                                    <FormControl><Input placeholder="e.g. Torkham Port" {...field} /></FormControl>
                                    {/* <FormMessage /> */}
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="route_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Route Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. KHI-LHE Express" {...field} /></FormControl>
                                    {/* <FormMessage /> */}
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
