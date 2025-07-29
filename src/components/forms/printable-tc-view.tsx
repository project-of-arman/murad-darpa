
"use client";

import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getSchoolInfo, SchoolInfo } from "@/lib/school-data";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import type { TransferCertificateData } from "@/app/(site)/forms/transfer-certificate-apply/actions";

interface PrintableViewProps {
    data: TransferCertificateData;
    onBack: () => void;
}

const TextRow = ({ children }: { children: React.ReactNode }) => (
    <p className="leading-relaxed">{children}</p>
)

export default function PrintableTCView({ data, onBack }: PrintableViewProps) {
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        async function fetchSchoolInfo() {
            setLoading(true);
            const info = await getSchoolInfo();
            setSchoolInfo(info);
            setLoading(false);
        }
        
        setCurrentDate(new Date().toLocaleDateString('bn-BD'));
        fetchSchoolInfo();
    }, []);
    
    const handlePrint = () => {
        window.print();
    };

    const reasons = [
        'অভিভাবকের অভিপ্রায়',
        'বাসস্থান পরিবর্তন',
        'উন্নত প্রতিষ্ঠানে ভর্তি',
        'শারীরিক অসুস্থতা',
        'বিবিধ'
    ];
    const reasonPrefixes = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];


    if (loading) {
        return (
             <div className="bg-white py-12 sm:py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white py-12 sm:py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8 flex justify-between items-center non-printable">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        প্রিন্ট করুন
                    </Button>
                </div>

                <div id="printable-area" className="bg-white p-8 border border-black text-black font-body">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold underline">বিদ্যালয় পরিত্যাগের ছাড়পত্র</h2>
                    </div>

                    <div className="flex justify-between mb-8 text-base">
                        <p>ক্রমিক নং- ..........................</p>
                        <p>তারিখঃ {currentDate} খ্রি.</p>
                    </div>

                    <div className="text-base space-y-6">
                        <p className="leading-relaxed">
                            এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <span className="font-semibold">{data.studentName}</span>, 
                            পিতা: <span className="font-semibold">{data.fatherName}</span>, 
                            মাতা: <span className="font-semibold">{data.motherName}</span>, 
                            ডাকঘর: <span className="font-semibold">{data.post_office}</span>, 
                            উপজেলাঃ <span className="font-semibold">{data.upazila}</span>, 
                            জেলাঃ <span className="font-semibold">{data.district}</span>। 
                            সে {schoolInfo?.name}-এর <span className="font-semibold">{data.className}</span> শ্রেণির একজন নিয়মিত ছাত্র/ছাত্রী ছিল। তার শ্রেণি রোল নং <span className="font-semibold">{data.rollNo}</span>। 
                            সে অত্র প্রতিষ্ঠানে <span className="font-semibold">{data.session}</span> শিক্ষাবর্ষে শ্রেণিতে অধ্যয়ন করেছে। তার নিকট প্রতিষ্ঠানের কোনো বেতন ও অন্যান্য পাওনাদি নেই।
                        </p>
                        <p className="leading-relaxed">
                            বিদ্যালয়ে অধ্যয়নকালে সে কোনো নিয়মশৃঙ্খলা পরিপন্থি ও রাষ্ট্রবিরোধী কোন কাজে জড়িত নয়। আমি তার ভবিষ্যত জীবনের সাফল্য কামনা করি।
                        </p>
                    </div>
                    
                    <div className="mt-8 text-base">
                        <h3 className="font-bold underline">বিদ্যালয় পরিত্যাগের কারণঃ</h3>
                        <div className="pl-4 mt-2 space-y-1">
                             {reasons.map((reason, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-4 h-4 border border-black flex items-center justify-center">
                                        {data.reason === reason && <span className="text-black font-bold">✓</span>}
                                    </div>
                                    <span>{reasonPrefixes[index]}) {reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="mt-24 flex justify-end items-center text-base print-signature">
                        <div className="text-center">
                            <p className="border-t border-gray-500 px-4 pt-1">(প্রধান শিক্ষকের স্বাক্ষর)</p>
                            <p className="font-semibold">{schoolInfo?.name}</p>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    @media print {
                        body {
                           -webkit-print-color-adjust: exact;
                           print-color-adjust: exact;
                        }
                        body * {
                           visibility: hidden;
                        }
                        #printable-area, #printable-area * {
                           visibility: visible;
                        }
                        #printable-area {
                           position: absolute;
                           left: 0;
                           top: 0;
                           width: 100%;
                           font-size: 12pt;
                           padding: 0 !important;
                           border: none !important;
                        }
                        .non-printable {
                            display: none;
                        }
                    }
                    @page {
                        size: A4;
                        margin: 1in;
                    }
                `}</style>
            </div>
        </div>
    );
}
