import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";

// Define strict type for rows coming from DB
type Manifest = Database['public']['Tables']['carrier_manifests']['Row'];

export const generateManifestPDF = (manifest: Manifest) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Helper for aligned text
    const rightText = (text: string, y: number, fontSize: number = 10) => {
        doc.setFontSize(fontSize);
        doc.text(text, pageWidth - 14, y, { align: "right" });
    };

    const centerText = (text: string, y: number, fontSize: number = 10) => {
        doc.setFontSize(fontSize);
        doc.text(text, pageWidth / 2, y, { align: "center" });
    };

    // --- 1. Header & Branding ---
    // Logo
    // Logo - Removed by user request
    // try {
    //     const logoUrl = '/kohesar_logo.png';
    //     const img = new Image();
    //     img.src = logoUrl;
    //     doc.addImage(img, 'PNG', 14, 10, 40, 20); // x, y, width, height
    // } catch (e) {
    //     console.warn("Logo not loaded for PDF");
    // }

    // Company Title - Removed by user request
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    // centerText("KOHSAR LOGISTICS (PRIVATE) LIMITED", 20, 16); 

    // Tagline - Keeping for now unless requested, or maybe remove if it looks weird alone.
    // User only said 'company title', but usually removing the title makes the tagline look orphaned.
    // I will comment out the title.
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    centerText("KEEP THE LORD ON THE ROAD", 26, 10);

    doc.setLineWidth(0.5);
    doc.line(14, 35, pageWidth - 14, 35); // Adjusted line position

    // Document Title
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.text("CARRIER MANIFEST", 14, 45); // Adjusted Y

    // Meta Info
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Manifest #: ${manifest.manifest_number}`, 14, 53);
    doc.text(`Type: ${manifest.manifest_type || 'N/A'}`, 14, 59);

    rightText(`Status: ${manifest.status}`, 53);
    rightText(`Date: ${manifest.dispatch_date_time ? format(new Date(manifest.dispatch_date_time), 'dd MMM yyyy') : format(new Date(), 'dd MMM yyyy')}`, 59);

    let startY = 65;

    // Helper to filter empty rows
    const cleanBody = (rows: (string | undefined | null)[][]) => {
        return rows.filter(row => row[1] && row[1] !== '-' && row[1] !== 'undefined' && row[1] !== '');
    };

    // --- 2. Logistics & Route Section ---
    const logisticsBody = cleanBody([
        ['Origin Hub', manifest.origin_hub],
        ['Destination Hub', manifest.destination_hub],
        ['Dispatch Time', manifest.dispatch_date_time ? format(new Date(manifest.dispatch_date_time), 'PPpp') : '-'],
        ['Expected Arrival', manifest.expected_arrival_date_time ? format(new Date(manifest.expected_arrival_date_time), 'PPpp') : '-'],
        ['Route Name', manifest.route_name],
    ]);

    if (logisticsBody.length > 0) {
        autoTable(doc, {
            startY: startY,
            head: [['Logistics & Route Information', '']],
            body: logisticsBody,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80], fontSize: 11, fontStyle: 'bold' },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
            styles: { fontSize: 10, cellPadding: 2 }
        });
        startY = (doc as any).lastAutoTable.finalY + 5;
    }

    // --- 3. Vehicle & Driver ---
    const vehicleBody = cleanBody([
        ['Registration No', manifest.vehicle_reg_no],
        ['Vehicle Type', manifest.vehicle_type],
        ['Make / Model', `${manifest.vehicle_make || ''} ${manifest.vehicle_model || ''}`.trim()],
        ['Model Year', manifest.vehicle_year],
        ['Engine No', manifest.engine_no],
        ['Chassis No', manifest.chassis_no],
        ['Insurance Expiry', manifest.vehicle_insurance_expiry ? format(new Date(manifest.vehicle_insurance_expiry), 'dd MMM yyyy') : '-'],
        ['Tracker ID', manifest.tracker_id],
        ['Driver Name', manifest.driver_name],
        ['Driver CNIC', manifest.driver_cnic],
        ['Driver Mobile', manifest.driver_mobile],
        ['License No', manifest.driver_license_no],
        ['License Expiry', manifest.driver_license_expiry ? format(new Date(manifest.driver_license_expiry), 'dd MMM yyyy') : '-'],
        ['Emergency Contact', manifest.driver_emergency_contact],
        ['Driver Address', manifest.driver_address],
    ]);

    if (vehicleBody.length > 0) {
        autoTable(doc, {
            startY: startY,
            head: [['Vehicle & Driver Details', '']],
            body: vehicleBody,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
        });
        startY = (doc as any).lastAutoTable.finalY + 5;
    }

    // --- 4. Customs & Cargo ---
    const customsBody = cleanBody([
        ['GD Number', manifest.gd_number],
        ['GD Date', manifest.gd_date ? format(new Date(manifest.gd_date), 'dd MMM yyyy') : '-'],
        ['IGM Number', manifest.igm_number],
        ['NGM Number', manifest.ngm_number],
        ['Index Number', manifest.index_number],
        ['BL Number', manifest.bl_number],
        ['Shipping Bill No', manifest.shipping_bill_number],
        ['Vessel Name', manifest.vessel_name],
        ['Voyage Number', manifest.voyage_number],
        ['Port of Loading', manifest.port_of_loading],
        ['Port of Discharge', manifest.port_of_discharge],
        ['Container No(s)', manifest.container_no],
        ['Container Size', manifest.container_size],
        ['Container Type', manifest.container_type],
        ['Seal Number(s)', manifest.seal_no],
        ['Package Count', manifest.pkg_count?.toString()],
        ['Package Type', manifest.pkg_type],
        ['HS Code', manifest.hs_code],
        ['Gross Weight', manifest.gross_weight ? `${manifest.gross_weight} kg` : '-'],
        ['Net Weight', manifest.net_weight ? `${manifest.net_weight} kg` : '-'],
        ['Volume', manifest.volume_cbm ? `${manifest.volume_cbm} CBM` : '-'],
        ['Commodity', manifest.commodity_description],
        ['Clearing Agent', manifest.clearing_agent_name],
        ['Agent Phone', manifest.clearing_agent_phone],
        ['Agent NTN', manifest.clearing_agent_ntn],
        ['Consignee Name', manifest.consignee_name],
        ['Consignee Phone', manifest.consignee_phone],
        ['Consignee Address', manifest.consignee_address],
        ['Shipper Name', manifest.shipper_name],
        ['Shipper Phone', manifest.shipper_phone],
        ['Shipper Address', manifest.shipper_address],
        ['Remarks', manifest.remarks],
    ]);

    if (customsBody.length > 0) {
        autoTable(doc, {
            startY: startY,
            head: [['Customs & Cargo Specification', '']],
            body: customsBody,
            theme: 'grid',
            headStyles: { fillColor: [192, 57, 43] }, // Red for customs
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
        });
        startY = (doc as any).lastAutoTable.finalY + 5;
    }

    // --- 5. Signatures ---
    const finalY = (doc as any).lastAutoTable.finalY + 30;

    // Ensure we don't go off page
    if (finalY > 250) {
        doc.addPage();
        startY = 20;
    } else {
        startY = finalY;
    }

    doc.setFontSize(10);
    doc.setTextColor(0);

    const sigY = startY;

    doc.text("_______________________", 14, sigY);
    doc.text("Prepared By", 14, sigY + 5);

    doc.text("_______________________", 80, sigY);
    doc.text("Driver / Carrier", 80, sigY + 5);

    doc.text("_______________________", 150, sigY);
    doc.text("Receiving Officer", 150, sigY + 5);

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${totalPages} - Generated by KOHESAR LOGISTICS System`, pageWidth / 2, 290, { align: 'center' });
    }

    doc.save(`Manifest_${manifest.manifest_number}.pdf`);
};
