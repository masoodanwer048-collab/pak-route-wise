import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { InspectionCase } from '@/types/examination';
import { mockEvidenceItems, mockChecklistItems } from '@/data/mockExaminations';

interface ExportOptions {
    includeLogo?: boolean;
    includeEvidence?: boolean;
    includeFindings?: boolean;
    includeProgress?: boolean;
}

// Build report data from inspection case
export function buildReportData(inspectionCase: InspectionCase) {
    const evidence = mockEvidenceItems.filter((e) => e.case_id === inspectionCase.case_id);
    const checklist = mockChecklistItems.filter((c) => c.case_id === inspectionCase.case_id);

    return {
        // Header
        reportTitle: `Inspection Report — ${inspectionCase.case_number}`,
        generatedAt: format(new Date(), 'dd MMM yyyy, HH:mm'),

        // Case details
        caseInfo: {
            caseNumber: inspectionCase.case_number,
            status: inspectionCase.status,
            priority: inspectionCase.priority,
            gdNumber: inspectionCase.gd_number,
            container: inspectionCase.container_number,
            blNumber: inspectionCase.bl_number,
        },

        // Parties
        parties: {
            importer: inspectionCase.importer_name,
            assignedTo: inspectionCase.assigned_inspector || 'Not Assigned',
            createdBy: inspectionCase.created_by,
        },

        // Schedule & Location
        schedule: {
            terminal: inspectionCase.terminal_location,
            bay: inspectionCase.inspection_bay,
            scheduledDate: inspectionCase.scheduled_date
                ? format(new Date(inspectionCase.scheduled_date), 'dd MMM yyyy')
                : 'Not scheduled',
            scheduledTime: inspectionCase.scheduled_time || '',
        },

        // Progress
        progress: {
            percentage: inspectionCase.progress_pct,
            currentTask: inspectionCase.current_task,
            startedAt: inspectionCase.started_at
                ? format(new Date(inspectionCase.started_at), 'dd MMM yyyy, HH:mm')
                : null,
            completedAt: inspectionCase.completed_at
                ? format(new Date(inspectionCase.completed_at), 'dd MMM yyyy, HH:mm')
                : null,
            elapsedTime: inspectionCase.elapsed_time_mins,
        },

        // Findings
        findings: {
            summary: inspectionCase.findings_summary || 'No findings recorded yet',
            holdReason: inspectionCase.hold_reason,
            complianceStatus: inspectionCase.compliance_status,
        },

        // Evidence
        evidence: evidence.map((e) => ({
            fileName: e.file_name,
            category: e.category,
            uploadedBy: e.uploaded_by,
            uploadedAt: format(new Date(e.uploaded_at), 'dd MMM, HH:mm'),
            caption: e.caption,
        })),

        // Checklist
        checklist: checklist.map((c) => ({
            sequence: c.sequence,
            taskName: c.task_name,
            status: c.status,
            resultValue: c.result_value,
            notes: c.notes,
        })),
    };
}

// Generate PDF Report
export async function generatePDF(inspectionCase: InspectionCase, options: ExportOptions) {
    const data = buildReportData(inspectionCase);
    const doc = new jsPDF();

    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Header with logo (if included)
    if (options.includeLogo) {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Kohesar Logistics', margin, y);
        y += 10;
    }

    // Report title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.reportTitle, margin, y);
    y += 10;

    // Generated date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${data.generatedAt}`, margin, y);
    y += 15;

    // Case Information Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Case Information', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const caseLines = [
        `Case Number: ${data.caseInfo.caseNumber}`,
        `Status: ${data.caseInfo.status.toUpperCase()}`,
        `Priority: ${data.caseInfo.priority.toUpperCase()}`,
        `GD Number: ${data.caseInfo.gdNumber}`,
        `Container: ${data.caseInfo.container}`,
        `BL Number: ${data.caseInfo.blNumber}`,
    ];
    caseLines.forEach((line) => {
        doc.text(line, margin, y);
        y += 6;
    });
    y += 5;

    // Parties
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Parties Involved', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Importer: ${data.parties.importer}`, margin, y);
    y += 6;
    doc.text(`Assigned Inspector: ${data.parties.assignedTo}`, margin, y);
    y += 6;
    doc.text(`Created By: ${data.parties.createdBy}`, margin, y);
    y += 10;

    // Schedule & Location
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Schedule & Location', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Terminal: ${data.schedule.terminal || 'TBD'}`, margin, y);
    y += 6;
    if (data.schedule.bay) {
        doc.text(`Bay: ${data.schedule.bay}`, margin, y);
        y += 6;
    }
    doc.text(`Scheduled: ${data.schedule.scheduledDate} ${data.schedule.scheduledTime}`, margin, y);
    y += 10;

    // Progress (if included)
    if (options.includeProgress && data.progress.percentage > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Progress', margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Completion: ${data.progress.percentage}%`, margin, y);
        y += 6;
        doc.text(`Current Task: ${data.progress.currentTask}`, margin, y);
        y += 6;
        if (data.progress.elapsedTime) {
            doc.text(`Elapsed Time: ${data.progress.elapsedTime} minutes`, margin, y);
            y += 6;
        }
        y += 5;
    }

    // Findings (if included)
    if (options.includeFindings && data.findings.summary) {
        // Check if new page needed
        if (y > 240) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Findings', margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const findingsText = doc.splitTextToSize(data.findings.summary, contentWidth);
        doc.text(findingsText, margin, y);
        y += (findingsText.length * 6) + 5;

        if (data.findings.holdReason) {
            doc.setFont('helvetica', 'bold');
            doc.text('Hold Reason:', margin, y);
            y += 6;
            doc.setFont('helvetica', 'normal');
            const holdText = doc.splitTextToSize(data.findings.holdReason, contentWidth);
            doc.text(holdText, margin, y);
            y += (holdText.length * 6) + 5;
        }
    }

    // Evidence (if included)
    if (options.includeEvidence && data.evidence.length > 0) {
        if (y > 220) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Evidence (${data.evidence.length} files)`, margin, y);
        y += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        data.evidence.forEach((ev, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.text(`${index + 1}. ${ev.fileName}`, margin + 5, y);
            y += 5;
            doc.text(`   Category: ${ev.category} | Uploaded: ${ev.uploadedAt} by ${ev.uploadedBy}`, margin + 5, y);
            y += 5;
            if (ev.caption) {
                const captionText = doc.splitTextToSize(`   ${ev.caption}`, contentWidth - 10);
                doc.text(captionText, margin + 5, y);
                y += (captionText.length * 5) + 2;
            }
            y += 3;
        });
    }

    // Footer on every page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
            `Page ${i} of ${pageCount} | Printed: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`,
            margin,
            doc.internal.pageSize.getHeight() - 10
        );
    }

    // Save PDF
    doc.save(`Inspection_Report_${inspectionCase.case_number}_${format(new Date(), 'yyyyMMdd')}.pdf`);
}

// Generate Excel Report
export async function generateExcel(inspectionCase: InspectionCase, options: ExportOptions) {
    const data = buildReportData(inspectionCase);
    const workbook = XLSX.utils.book_new();

    // Case Info Sheet
    const caseData = [
        ['Inspection Report', data.reportTitle],
        ['Generated', data.generatedAt],
        [],
        ['Case Number', data.caseInfo.caseNumber],
        ['Status', data.caseInfo.status],
        ['Priority', data.caseInfo.priority],
        ['GD Number', data.caseInfo.gdNumber],
        ['Container', data.caseInfo.container],
        ['BL Number', data.caseInfo.blNumber],
        [],
        ['Importer', data.parties.importer],
        ['Assigned Inspector', data.parties.assignedTo],
        ['Created By', data.parties.createdBy],
        [],
        ['Terminal', data.schedule.terminal || 'TBD'],
        ['Bay', data.schedule.bay || 'N/A'],
        ['Scheduled Date', data.schedule.scheduledDate],
        ['Scheduled Time', data.schedule.scheduledTime],
    ];

    if (options.includeProgress) {
        caseData.push(
            [],
            ['Progress', `${data.progress.percentage}%`],
            ['Current Task', data.progress.currentTask]
        );
    }

    if (options.includeFindings) {
        caseData.push(
            [],
            ['Findings', data.findings.summary]
        );
        if (data.findings.holdReason) {
            caseData.push(['Hold Reason', data.findings.holdReason]);
        }
    }

    const caseSheet = XLSX.utils.aoa_to_sheet(caseData);
    XLSX.utils.book_append_sheet(workbook, caseSheet, 'Case Info');

    // Evidence Sheet (if included)
    if (options.includeEvidence && data.evidence.length > 0) {
        const evidenceData = [
            ['File Name', 'Category', 'Uploaded By', 'Uploaded At', 'Caption'],
            ...data.evidence.map((e) => [
                e.fileName,
                e.category,
                e.uploadedBy,
                e.uploadedAt,
                e.caption || '',
            ]),
        ];
        const evidenceSheet = XLSX.utils.aoa_to_sheet(evidenceData);
        XLSX.utils.book_append_sheet(workbook, evidenceSheet, 'Evidence');
    }

    // Checklist Sheet (if included)
    if (options.includeProgress && data.checklist.length > 0) {
        const checklistData = [
            ['#', 'Task', 'Status', 'Result', 'Notes'],
            ...data.checklist.map((c) => [
                c.sequence,
                c.taskName,
                c.status,
                c.resultValue || '',
                c.notes || '',
            ]),
        ];
        const checklistSheet = XLSX.utils.aoa_to_sheet(checklistData);
        XLSX.utils.book_append_sheet(workbook, checklistSheet, 'Checklist');
    }

    // Write file
    XLSX.writeFile(
        workbook,
        `Inspection_Report_${inspectionCase.case_number}_${format(new Date(), 'yyyyMMdd')}.xlsx`
    );
}

// Generate CSV Report
export async function generateCSV(inspectionCase: InspectionCase, options: ExportOptions) {
    const data = buildReportData(inspectionCase);

    const rows = [
        ['Inspection Report', data.reportTitle],
        ['Generated', data.generatedAt],
        [],
        ['Field', 'Value'],
        ['Case Number', data.caseInfo.caseNumber],
        ['Status', data.caseInfo.status],
        ['Priority', data.caseInfo.priority],
        ['GD Number', data.caseInfo.gdNumber],
        ['Container', data.caseInfo.container],
        ['BL Number', data.caseInfo.blNumber],
        ['Importer', data.parties.importer],
        ['Assigned Inspector', data.parties.assignedTo],
        ['Terminal', data.schedule.terminal || 'TBD'],
        ['Scheduled', `${data.schedule.scheduledDate} ${data.schedule.scheduledTime}`],
    ];

    if (options.includeProgress) {
        rows.push(['Progress', `${data.progress.percentage}%`]);
    }

    if (options.includeFindings) {
        rows.push(['Findings', data.findings.summary]);
    }

    // Convert to CSV string
    const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Inspection_Report_${inspectionCase.case_number}_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
}

// Generate JSON Export
export async function generateJSON(inspectionCase: InspectionCase, options: ExportOptions) {
    const data = buildReportData(inspectionCase);

    const jsonData = {
        reportTitle: data.reportTitle,
        generatedAt: data.generatedAt,
        caseInfo: data.caseInfo,
        parties: data.parties,
        schedule: data.schedule,
        ...(options.includeProgress && { progress: data.progress, checklist: data.checklist }),
        ...(options.includeFindings && { findings: data.findings }),
        ...(options.includeEvidence && { evidence: data.evidence }),
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Inspection_Report_${inspectionCase.case_number}_${format(new Date(), 'yyyyMMdd')}.json`;
    link.click();
}
