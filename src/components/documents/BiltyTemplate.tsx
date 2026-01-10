import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface BiltyProps {
    data: {
        grNumber: string;
        date: string;
        vehicleNo: string;
        driverName: string;
        driverMobile: string;
        driverCNIC: string;
        from: string;
        to: string;
        sender: { name: string; address: string; phone: string };
        receiver: { name: string; address: string; phone: string };
        items: {
            qty: number;
            description: string;
            packing: string;
            weight: number;
            chargedWeight: number;
            rate: string;
        }[];
        totals: {
            qty: number;
            freight: number;
            biltyCharges: number;
            labor: number;
            other: number;
            total: number;
            totalInWords: string;
        };
        paymentType: "Paid" | "ToPay" | "TBB";
    };
}

const BiltyTemplate: React.FC<BiltyProps> = ({ data }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore event listeners
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" /> Print Bilty
                </Button>
            </div>

            <div ref={printRef} className="bg-white p-8 border border-gray-300 text-black font-sans print:p-0 print:border-none" dir="rtl">
                <style>
                    {`
                        @media print {
                            @page { size: A4; margin: 10mm; }
                            body { -webkit-print-color-adjust: exact; }
                            .print-hidden { display: none; }
                        }
                        .urdu-font { font-family: 'Noto Nastaliq Urdu', 'Arial', sans-serif; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid black; padding: 4px 8px; text-align: right; }
                        .no-border { border: none !important; }
                    `}
                </style>

                {/* Header */}
                <div className="text-center mb-6 border-b-2 border-black pb-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-left text-sm">
                            <span className="font-bold">Bilty / G.R. No:</span> {data.grNumber}
                        </div>
                        <h1 className="text-3xl font-bold urdu-font">بلٹی / رسید مال</h1>
                        <div className="text-right text-sm">
                            <span className="font-bold">تاریخ:</span> {data.date}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold uppercase mb-1">[Pak Route Wise Logistics]</h2>
                    <p className="urdu-font text-sm">ہیڈ آفس: [پتہ، دکان نمبر، شہر] | فون نمبر: 92-300-1234567+</p>
                    <p className="urdu-font text-sm">شاخ: [برانچ کا پتہ اگر ہے] | ای میل: [email@example.com]</p>
                </div>

                {/* Driver & Route Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 urdu-font text-sm">
                    <div className="border border-black p-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div><span className="font-bold">گاڑی نمبر:</span> {data.vehicleNo}</div>
                            <div><span className="font-bold">ڈرائیور کا نام:</span> {data.driverName}</div>
                            <div><span className="font-bold">ڈرائیور موبائل:</span> {data.driverMobile}</div>
                            <div><span className="font-bold">ڈرائیور شناختی کارڈ:</span> {data.driverCNIC}</div>
                        </div>
                    </div>
                    <div className="border border-black p-2 flex flex-col justify-center">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold">کہاں سے (From):</span>
                            <span>{data.from}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">کہاں تک (To):</span>
                            <span>{data.to}</span>
                        </div>
                    </div>
                </div>

                {/* Party Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 urdu-font">
                    <div className="border border-black p-2">
                        <h3 className="font-bold border-b border-black mb-2 text-center bg-gray-100">مال بھیجنے والا (Sender)</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex"><span className="w-16 font-bold">نام:</span> {data.sender.name}</div>
                            <div className="flex"><span className="w-16 font-bold">پتہ:</span> {data.sender.address}</div>
                            <div className="flex"><span className="w-16 font-bold">فون:</span> {data.sender.phone}</div>
                        </div>
                    </div>
                    <div className="border border-black p-2">
                        <h3 className="font-bold border-b border-black mb-2 text-center bg-gray-100">مال وصول کرنے والا (Receiver)</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex"><span className="w-16 font-bold">نام:</span> {data.receiver.name}</div>
                            <div className="flex"><span className="w-16 font-bold">پتہ:</span> {data.receiver.address}</div>
                            <div className="flex"><span className="w-16 font-bold">فون:</span> {data.receiver.phone}</div>
                        </div>
                    </div>
                </div>

                {/* Goods Table */}
                <div className="mb-6 urdu-font">
                    <h3 className="font-bold mb-2">تفصیلِ مال (Goods Description)</h3>
                    <table>
                        <thead>
                            <tr className="bg-gray-100 text-sm">
                                <th className="w-16 text-center">تعداد نگ</th>
                                <th>تفصیل / آئٹم کا نام</th>
                                <th className="w-24 text-center">پیکنگ کی قسم</th>
                                <th className="w-24 text-center">اصل وزن (Kg)</th>
                                <th className="w-24 text-center">چارج شدہ وزن</th>
                                <th className="w-20 text-center">ریٹ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">{item.qty}</td>
                                    <td>{item.description}</td>
                                    <td className="text-center">{item.packing}</td>
                                    <td className="text-center">{item.weight}</td>
                                    <td className="text-center">{item.chargedWeight}</td>
                                    <td className="text-center">{item.rate}</td>
                                </tr>
                            ))}
                            {/* Empty rows filler */}
                            {[...Array(Math.max(0, 3 - data.items.length))].map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 font-bold">
                                <td className="text-center">{data.totals.qty}</td>
                                <td colSpan={5} className="text-left pl-4">کل تعداد</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-2 gap-6 mb-6 urdu-font">
                    {/* Amounts */}
                    <div className="text-sm">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <th className="text-right bg-gray-50">کرایہ (Freight)</th>
                                    <td className="text-left">{data.totals.freight.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th className="text-right bg-gray-50">بلٹی چارجز</th>
                                    <td className="text-left">{data.totals.biltyCharges.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th className="text-right bg-gray-50">ہمالی / مزدوری</th>
                                    <td className="text-left">{data.totals.labor.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th className="text-right bg-gray-50">دیگر اخراجات</th>
                                    <td className="text-left">{data.totals.other.toLocaleString()}</td>
                                </tr>
                                <tr className="border-t-2 border-black">
                                    <th className="text-right font-bold text-lg">ٹوٹل رقم</th>
                                    <td className="text-left font-bold text-lg">{data.totals.total.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-2 text-right text-xs">
                            <strong>ٹوٹل رقم (الفاظ میں):</strong> {data.totals.totalInWords}
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="border border-black p-4 text-sm">
                        <h4 className="font-bold underline mb-3 text-center">ادائیگی کی حیثیت</h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.paymentType === "Paid"} readOnly className="h-4 w-4" />
                                <span>ادا شدہ (Paid) - بھیجنے والے نے دیا</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.paymentType === "ToPay"} readOnly className="h-4 w-4" />
                                <span>ٹو پے (To Pay) - وصول کرنے والا دے گا</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.paymentType === "TBB"} readOnly className="h-4 w-4" />
                                <span>اکاؤنٹ (TBB) - کھاتے میں</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <div className="text-xs border-t border-black pt-2 mb-8 urdu-font text-justify leading-tight">
                    <h4 className="font-bold mb-1">شرائط و ضوابط (Terms & Conditions)</h4>
                    <p>1. <strong>مال بذمہ مالک:</strong> راستے میں مال کی چوری، آگ لگنے، بارش یا کسی حادثے کی صورت میں ٹرانسپورٹ کمپنی ذمہ دار نہ ہوگی۔ انشورنس خود کروائیں۔</p>
                    <p>2. <strong>دعویٰ (Claim):</strong> مال کی وصولی کے بعد کوئی دعویٰ قبول نہیں کیا جائے گا۔ براہ کرم مال وصول کرتے وقت وزن اور نگینہ چیک کر لیں۔</p>
                    <p>3. <strong>غیر قانونی اشیاء:</strong> مال میں کوئی بھی غیر قانونی چیز (منشیات، دھماکہ خیز مواد) شامل نہیں ہے۔ اگر ہوئی تو تمام تر ذمہ داری مال بھیجنے والے پر ہوگی۔</p>
                    <p>4. <strong>ڈیمرج (Demurrage):</strong> مال پہنچنے کے 3 دن کے اندر وصول کر لیں، بصورت دیگر گودام کا کرایہ (ڈیمرج) فی دن کے حساب سے چارج کیا جائے گا۔</p>
                    <p>5. <strong>ناقص مال:</strong> گلنے سڑنے والی اشیاء (سبزی، پھل وغیرہ) کے خراب ہونے کی ذمہ داری کمپنی پر نہ ہوگی۔</p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-8 text-center pt-8 mt-4 urdu-font text-sm">
                    <div className="border-t border-black pt-2">دستخط بھیجنے والا</div>
                    <div className="border-t border-black pt-2">دستخط وصول کنندہ</div>
                    <div className="border-t border-black pt-2">مہر و دستخط ٹرانسپورٹر</div>
                </div>

                {/* Footer Notes */}
                <div className="mt-8 text-xs text-center text-gray-500 urdu-font border-t border-gray-200 pt-2">
                    <p>White: Receiver Copy | Yellow: Driver Copy | Pink: Office Copy</p>
                    <p className="mt-1">سافٹ ویئر کے ذریعے تیار کردہ - Pak Route Wise Solutions</p>
                </div>
            </div>
        </div>
    );
};

export default BiltyTemplate;
