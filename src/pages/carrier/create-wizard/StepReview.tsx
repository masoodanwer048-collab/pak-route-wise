import { UseFormReturn } from "react-hook-form";
import { ManifestFormValues } from "./manifestSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const StepReview = ({ form }: { form: UseFormReturn<ManifestFormValues> }) => {
    const values = form.getValues();

    const InfoRow = ({ label, value }: { label: string, value?: string | number | null }) => (
        <div className="flex justify-between py-1 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-900">{value || '-'}</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-slate-800">Review & Submit</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route Info */}
                <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Route & Schedule</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Type" value={values.manifest_type} />
                        <InfoRow label="Route" value={`${values.origin_hub} ➔ ${values.destination_hub}`} />
                        <InfoRow label="Route Name" value={values.route_name} />
                        <InfoRow label="Dispatch Time" value={values.dispatch_date_time ? format(new Date(values.dispatch_date_time), 'PPp') : '-'} />
                    </CardContent>
                </Card>

                {/* Carrier Info */}
                <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Carrier & Driver</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Carrier" value={values.carrier_name} />
                        <InfoRow label="Driver" value={values.driver_name} />
                        <InfoRow label="CNIC" value={values.driver_cnic} />
                        <InfoRow label="Vehicle Reg" value={values.vehicle_reg_no} />
                        <InfoRow label="Make/Model" value={`${values.vehicle_make || ''} ${values.vehicle_model || ''}`} />
                    </CardContent>
                </Card>

                {/* Customs Info */}
                <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Customs & Cargo</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="GD Number" value={values.gd_number} />
                        <InfoRow label="Container" value={values.container_no} />
                        <InfoRow label="Seal No" value={values.seal_no} />
                        <InfoRow label="Line/Agent" value={values.clearing_agent_name} />
                        <InfoRow label="Commodity" value={values.commodity_description} />
                    </CardContent>
                </Card>

                {/* Ops Info */}
                <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Operations & Security</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                        <InfoRow label="Trip ID" value={values.trip_id} />
                        <InfoRow label="Security Status" value={values.security_check_status} />
                        <InfoRow label="Guard Name" value={values.security_guard_name} />
                        <InfoRow label="Est. Cost" value={values.carrier_cost ? `PKR ${values.carrier_cost}` : '-'} />
                        <InfoRow label="Shipments" value={values.shipment_ids?.length || 0} />
                    </CardContent>
                </Card>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 text-sm">
                <strong>Confirmation:</strong> By clicking Submit, I certify that all vehicle fitness checks, driver background verifications, and security protocols have been successfully completed.
            </div>
        </div>
    );
};

export default StepReview;
