import * as z from "zod";

export const manifestSchema = z.object({
    // A) Internal Manifest Fields (Minimal Required)
    manifest_number: z.string().optional(),
    manifest_type: z.enum(["LINEHAUL", "DELIVERY", "RTO", "VENDOR", "CONTAINER"]).default("LINEHAUL"),

    // Date is handled by created_at in DB, but if we want a manual dispatch date:
    dispatch_date_time: z.string().optional(),

    // All other fields are OPTIONAL
    status: z.enum(["DRAFT", "LOADING", "READY_FOR_HANDOVER", "HANDED_OVER", "IN_TRANSIT", "RECEIVED", "CLOSED", "CANCELLED", "REOPENED", "SUBMITTED"]).optional(),

    // Route
    origin_hub: z.string().optional(),
    destination_hub: z.string().optional(),
    route_name: z.string().optional(),
    route_code: z.string().optional(),

    // Carrier
    carrier_type: z.enum(["OWN_FLEET", "VENDOR", "BUS_CARGO", "AIR", "3PL", "SHIPPING_LINE"]).optional(),
    carrier_name: z.string().optional(),
    carrier_phone: z.string().optional(),

    // Driver
    driver_name: z.string().optional(),
    driver_cnic: z.string().optional(), // No strict regex blocking
    driver_mobile: z.string().optional(),
    driver_license_no: z.string().optional(),
    driver_license_expiry: z.string().optional(),
    helper_name: z.string().optional(),

    // Vehicle
    vehicle_reg_no: z.string().optional(),
    vehicle_make: z.string().optional(),
    vehicle_model: z.string().optional(),
    vehicle_color: z.string().optional(),

    engine_no: z.string().optional(),
    chassis_no: z.string().optional(),
    fitness_expiry: z.string().optional(),
    vehicle_insurance_expiry: z.string().optional(),

    odometer_start: z.coerce.number().optional(),
    fuel_level_start: z.coerce.number().optional(),
    vehicle_capacity_weight: z.coerce.number().optional(),

    // Customs
    gd_number: z.string().optional(),
    gd_date: z.string().optional(),
    igm_number: z.string().optional(),
    bl_number: z.string().optional(),
    container_no: z.string().optional(),
    container_size: z.string().optional(),
    seal_no: z.string().optional(),

    pkg_count: z.coerce.number().optional(),
    gross_weight: z.coerce.number().optional(),
    commodity_description: z.string().optional(),

    clearing_agent_name: z.string().optional(),
    consignee_name: z.string().optional(),

    // Security/Ops
    trip_id: z.string().optional(),
    departure_gate: z.string().optional(),
    dispatch_shift: z.string().optional(),
    security_check_status: z.string().optional(),
    security_guard_name: z.string().optional(),
    police_escort_required: z.boolean().default(false),

    // Financial
    carrier_cost: z.coerce.number().optional(),
    fuel_cost: z.coerce.number().optional(),
    toll_charges: z.coerce.number().optional(),

    // Linking
    shipment_ids: z.array(z.string()).default([]),
});

export type ManifestFormValues = z.infer<typeof manifestSchema>;

export const defaultManifestValues: Partial<ManifestFormValues> = {
    manifest_type: "LINEHAUL",
    status: "DRAFT",
    police_escort_required: false,
    shipment_ids: [],
    // Initialize with empty strings to avoid uncontrolled inputs
    origin_hub: "",
    destination_hub: "",
    carrier_name: "",
    driver_name: "",
    vehicle_reg_no: "",
};
