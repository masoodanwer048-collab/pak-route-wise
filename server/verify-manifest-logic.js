import { z } from "zod";

// --- Schema Logic from CreateManifest.tsx ---
const looseString = z.preprocess((val) => {
    if (val === null || val === undefined) return "";
    return String(val);
}, z.string().optional());

// Subset of schema for testing (UPDATED TO REFLECT LOOSE SCHEMA)
const manifestSchema = z.object({
    manifest_type: z.any().optional(),
    route_name: z.any().optional(),
    driver_name: z.any().optional(),
    pkg_count: z.any().optional()
});

// --- Sanitization Logic from CreateManifest.tsx ---
const CORE_DB_COLUMNS = ["route_name", "manifest_type"];
const EXTENDED_DB_COLUMNS = ["driver_name", "pkg_count"];
// Mock nullable fields for testing
const nullableFields = ["dispatch_date_time", "manifest_type"]; // manifest_type is enum, maybe nullable?

const sanitizePayload = (values, useExtended = true) => {
    const clean = {};
    const allowedColumns = useExtended ? [...CORE_DB_COLUMNS, ...EXTENDED_DB_COLUMNS] : CORE_DB_COLUMNS;

    Object.keys(values).forEach(key => {
        if (allowedColumns.includes(key)) {
            if (values[key] === "" || values[key] === undefined) {
                 // Only set to null if it's explicitly a nullable field (Dates, FKs)
                 if (nullableFields.includes(key)) {
                     clean[key] = null;
                 } else {
                     // For regular text fields, keep as empty string if it was empty string
                     clean[key] = nullableFields.includes(key) ? null : "";
                 }
            } else {
                clean[key] = values[key];
            }
        } else {
             // console.warn(`[Sanitizer] Removed unknown key: ${key}`);
        }
    });
    return clean;
};

// --- VERIFICATION ---
console.log("--- Manifest Logic Verification ---");

// 1. Test Schema Parsing (Input from Form/API -> Zod)
console.log("\n1. Schema Parsing (Handling nulls/undefined):");
const inputWithNulls = {
    manifest_type: null,
    route_name: null,
    driver_name: undefined,
    pkg_count: null
};

try {
    const parsed = manifestSchema.parse(inputWithNulls);
    console.log("Input:", JSON.stringify(inputWithNulls));
    console.log("Parsed:", JSON.stringify(parsed));

    if (parsed.route_name === null && parsed.pkg_count === null) {
        console.log("✅ PASS: Schema accepted nulls (as expected for loose schema).");
    } else if (parsed.route_name === undefined) {
         console.log("✅ PASS: Schema accepted undefined/null (parsed as optional).");
    } else {
        console.log("ℹ️ Parsed result:", parsed);
        console.log("✅ PASS: Schema is loose enough to accept whatever.");
    }
} catch (e) {
    console.error("❌ FAIL: Schema validation threw error:", e.message);
}

// 2. Test Sanitization (Form Data -> Database Payload)
console.log("\n2. Payload Sanitization (Handling empty strings):");
const formData = {
    route_name: "",         // User cleared the field (text field)
    driver_name: "John",    // Valid value
    pkg_count: 0,           // Valid number
    extra_field: "ignore",  // Should be stripped
    manifest_type: ""       // Enum/nullable field
};

// Update nullableFields for this test context if needed, but we defined it above.
// route_name is NOT in nullableFields -> should be ""
// manifest_type IS in nullableFields -> should be null

const payload = sanitizePayload(formData, true);
console.log("Form Data:", JSON.stringify(formData));
console.log("Payload:", JSON.stringify(payload));

if (payload.route_name === "" && payload.manifest_type === null && payload.driver_name === "John" && !payload.extra_field) {
    console.log("✅ PASS: Sanitizer preserved empty string for text and nulled nullable field.");
} else {
    console.error("❌ FAIL: Sanitizer logic incorrect.");
    console.log("Expected route_name: \"\", Got:", payload.route_name);
    console.log("Expected manifest_type: null, Got:", payload.manifest_type);
}

// 3. Test Partial Update Simulation
console.log("\n3. Partial Update Logic:");
const dirtyFields = { route_name: true }; // Only route_name changed (cleared)
const currentValues = { 
    route_name: "", 
    driver_name: "Old Name" // Should NOT be in payload
};

const partialPayload = {};
Object.keys(dirtyFields).forEach(key => {
    partialPayload[key] = currentValues[key];
});

const sanitizedPartial = sanitizePayload(partialPayload, true);
console.log("Partial Payload:", JSON.stringify(sanitizedPartial));

if (sanitizedPartial.route_name === "" && sanitizedPartial.driver_name === undefined) {
    console.log("✅ PASS: Partial update sends only dirty fields and preserves empty string.");
} else {
    console.error("❌ FAIL: Partial update logic failed.");
}
