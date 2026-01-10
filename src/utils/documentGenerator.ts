import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ShippingDocument } from '@/hooks/useDocuments';

// Extend jsPDF interface to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
}

export const generatePDF = (doc: ShippingDocument) => {
    const isPL = doc.type === 'packing_list';
    const title = isPL ? 'PACKING LIST' : doc.type === 'bl' ? 'BILL OF LADING' : doc.type === 'awb' ? 'AIR WAYBILL' : 'SHIPPING DOCUMENT';

    const pdf = new jsPDF() as jsPDFWithAutoTable;

    // Header
    pdf.setFontSize(20);
    pdf.text(title, 105, 15, { align: 'center' });

    pdf.setFontSize(10);
    pdf.text(`Document No: ${doc.documentNumber}`, 14, 25);
    pdf.text(`Date: ${doc.issueDate}`, 14, 30);

    // Parties
    pdf.autoTable({
        startY: 35,
        head: [['Shipper', 'Consignee', 'Notify Party']],
        body: [[
            doc.shipper,
            doc.consignee,
            doc.notifyParties?.join('\n') || 'Same as Consignee'
        ]],
        theme: 'grid',
        styles: { fontSize: 9 },
    });

    // Transport Details
    pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 10,
        head: [['Vessel/Vehicle', 'Voyage', 'Port of Loading', 'Port of Discharge']],
        body: [[
            doc.vesselFlightTruck,
            doc.voyageFlightNo,
            doc.pol || doc.origin,
            doc.pod || doc.destination
        ]],
        theme: 'grid',
        styles: { fontSize: 9 },
    });

    // Cargo Details
    const cargoHeader = [
        ['Marks & Numbers / Container No.', 'Description of Goods', 'Packages', 'Gross Weight', 'Measurement']
    ];

    const marks = doc.cargoType === 'FCL'
        ? doc.containers?.join('\n')
        : doc.marksAndNumbers || 'N/A';

    const cargoBody = [[
        marks,
        doc.description + (doc.hsCode ? `\n\nHS Code: ${doc.hsCode}` : ''),
        doc.packages,
        doc.weight,
        doc.volume
    ]];

    pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 10,
        head: cargoHeader,
        body: cargoBody,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: { 1: { cellWidth: 80 } } // Description column wider
    });

    // Footer / Remarks
    const finalY = pdf.lastAutoTable.finalY + 10;
    pdf.text('Remarks:', 14, finalY);
    pdf.setFont('helvetica', 'italic');
    pdf.text(doc.remarks || 'No specific remarks.', 14, finalY + 5);

    pdf.setFont('helvetica', 'normal');
    pdf.text('Freight Terms: ' + doc.freightTerms.toUpperCase(), 14, finalY + 15);

    pdf.save(`${doc.documentNumber}_${doc.type}.pdf`);
};

export const generateExcel = (doc: ShippingDocument) => {
    const data = [
        ['Document Type', doc.type.toUpperCase().replace('_', ' ')],
        ['Document Number', doc.documentNumber],
        ['Status', doc.status],
        ['Issue Date', doc.issueDate],
        [''], // Empty row
        ['Shipper', doc.shipper],
        ['Consignee', doc.consignee],
        ['Notify Parties', doc.notifyParties?.join(', ')],
        [''],
        ['Vessel/Vehicle', doc.vesselFlightTruck],
        ['Voyage', doc.voyageFlightNo],
        ['Origin/POL', doc.pol || doc.origin],
        ['Destination/POD', doc.pod || doc.destination],
        [''],
        ['Cargo Type', doc.cargoType],
        ['Marks / Containers', doc.cargoType === 'FCL' ? doc.containers?.join(', ') : doc.marksAndNumbers],
        ['Description', doc.description],
        ['HS Code', doc.hsCode || 'N/A'],
        ['Packages', doc.packages],
        ['Weight', doc.weight],
        ['Volume', doc.volume],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Document Details");
    XLSX.writeFile(wb, `${doc.documentNumber}_${doc.type}.xlsx`);
};
