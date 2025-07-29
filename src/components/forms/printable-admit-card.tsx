
"use client";

import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getSchoolInfo, SchoolInfo } from "@/lib/school-data";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import type { ExamRoutine } from "@/lib/exam-routine-data";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

type AdmitCardData = {
    studentName: string;
    fatherName: string;
    motherName: string;
    village: string;
    className: string;
    rollNo: string;
    session: string;
    examName: string;
    mobile: string;
};

interface PrintableAdmitCardProps {
    data: AdmitCardData;
    routine: ExamRoutine[];
    onBack: () => void;
}


export default function PrintableAdmitCard({ data, routine, onBack }: PrintableAdmitCardProps) {
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchoolInfo() {
            setLoading(true);
            const info = await getSchoolInfo();
            setSchoolInfo(info);
            setLoading(false);
        }
        fetchSchoolInfo();
    }, []);
    
    const handlePrint = () => {
        window.print();
    };

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

                <div id="printable-area" className="bg-white p-6 border-2 border-black text-black font-body">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="text-center space-y-2 border-b-2 border-black pb-4">
                            <div className="flex justify-center">
                                {schoolInfo && <Image src={schoolInfo.logo_url} alt="School Logo" width={80} height={80} data-ai-hint="school logo" />}
                            </div>
                            <h1 className="text-3xl font-bold text-black font-headline">{schoolInfo?.name}</h1>
                            <p className="text-black">{schoolInfo?.address}</p>
                            <CardTitle className="text-xl pt-2 text-black font-headline rounded-md p-2 border-2 border-black inline-block mt-2">
                                প্রবেশপত্র - {data.examName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-base my-6">
                                <p><span className="font-semibold">শিক্ষার্থীর নাম:</span> {data.studentName}</p>
                                <p><span className="font-semibold">রোল নং:</span> {data.rollNo}</p>
                                <p><span className="font-semibold">পিতার নাম:</span> {data.fatherName}</p>
                                <p><span className="font-semibold">মাতার নাম:</span> {data.motherName}</p>
                                <p><span className="font-semibold">শ্রেণী:</span> {data.className}</p>
                                <p><span className="font-semibold">সেশন:</span> {data.session}</p>
                            </div>
                            
                            <h3 className="font-bold text-center my-4">পরীক্ষার সময়সূচী</h3>
                            <Table className="border-2 border-black">
                                <TableHeader className="border-2 border-black">
                                    <TableRow>
                                        <TableHead className="font-bold border-r-2 border-black">তারিখ ও দিন</TableHead>
                                        <TableHead className="font-bold border-r-2 border-black">বিষয়</TableHead>
                                        <TableHead className="font-bold text-center">সময়</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {routine.map((item) => (
                                        <TableRow key={item.id} className="border-b-2 border-black">
                                            <TableCell className="border-r-2 border-black">
                                                {new Date(item.exam_date).toLocaleDateString('bn-BD', { day: '2-digit', month: '2-digit', year: 'numeric' })} <br />
                                                {new Date(item.exam_date).toLocaleDateString('bn-BD', { weekday: 'long' })}
                                            </TableCell>
                                            <TableCell className="font-medium border-r-2 border-black">{item.subject}</TableCell>
                                            <TableCell className="text-center">
                                                {new Date(`1970-01-01T${item.start_time}`).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' })}
                                                {' - '}
                                                {new Date(`1970-01-01T${item.end_time}`).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-20 flex justify-end items-center text-base">
                                <div className="text-center">
                                    <p className="border-t border-gray-500 px-8 pt-1">(প্রধান শিক্ষকের স্বাক্ষর)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <style jsx global>{`
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        body * { visibility: hidden; }
                        #printable-area, #printable-area * { visibility: visible; }
                        #printable-area { position: absolute; left: 0; top: 0; width: 100%; font-size: 12pt; padding: 0 !important; border: none !important; }
                        .non-printable { display: none; }
                        table, th, td { border: 1px solid black !important; }
                        .border-b-2.border-black { border-bottom-width: 2px !important; border-color: black !important; }
                        .border-2.border-black { border-width: 2px !important; border-color: black !important; }
                        .border-r-2.border-black { border-right-width: 2px !important; border-color: black !important; }
                    }
                    @page { size: A4; margin: 0.7in; }
                `}</style>
            </div>
        </div>
    );
}
