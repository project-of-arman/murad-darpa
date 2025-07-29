"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getSchoolInfo, SchoolInfo } from "@/lib/school-data";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type PrintableData = {
    [key: string]: any;
};

interface PrintableViewProps {
    title: string;
    data: PrintableData;
    onBack: () => void;
}

const keyToLabelMap: Record<string, string> = {
    studentNameEn: "Name of pupil (In capital letters)",
    studentNameBn: "শিক্ষার্থীর নাম (বাংলা)",
    applyingForClass: "Admission sought for Class",
    dob: "Date of Birth",
    gender: "Gender",
    religion: "Religion",
    bloodGroup: "Blood group",
    presentAddress: "Residential Address",
    permanentAddress: "Permanent Address",
    fatherNameEn: "Father's Name",
    fatherNameBn: "পিতার নাম (বাংলা)",
    fatherNid: "Father's NID",
    fatherMobile: "Father's Mobile",
    motherNameEn: "Mother's Name",
    motherNameBn: "মাতার নাম (বাংলা)",
    motherNid: "Mother's NID",
    motherMobile: "Mother's Mobile",
    previousSchool: "Name of the previous school",
    birthCertNo: "Birth Certificate No",
};

const FormRow = ({ label, value }: { label: string, value: string | undefined | null }) => (
    <div className="flex items-end">
        <span className="text-sm font-medium w-48 shrink-0">{label}</span>
        <span className="text-sm font-semibold border-b border-b-gray-400 border-dashed w-full ml-2 pb-0.5">{value || ''}</span>
    </div>
);

const FormRowGrid = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">{children}</div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-bold uppercase tracking-wider text-black bg-gray-200 px-2 py-1 my-4">{children}</h3>
);

export default function PrintableView({ title, data, onBack }: PrintableViewProps) {
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

                <div id="printable-area" className="bg-white p-8 border border-gray-400 text-gray-800">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold uppercase tracking-widest">{title}</h2>
                    </div>

                    <div className="flex justify-between items-start mb-4 border-y-4 border-black py-2">
                        <div className="space-y-1 text-sm">
                            <p><strong>Form No:</strong> ..............</p>
                            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</p>
                            <p><strong>Admission No:</strong> ..............</p>
                        </div>
                         {schoolInfo && (
                            <div className="flex flex-col items-center">
                                <Image 
                                    src={schoolInfo.logo_url} 
                                    alt="School Logo" 
                                    width={60} 
                                    height={60} 
                                    className="object-contain"
                                />
                                <p className="text-lg font-bold">{schoolInfo.name}</p>
                            </div>
                         )}
                        <div className="border-2 border-black p-1 w-32 h-40 flex items-center justify-center relative">
                            {data.studentPhoto ? (
                                <Image src={data.studentPhoto} alt="Student Photo" layout="fill" className="object-cover" />
                            ) : (
                                <p className="text-xs text-center text-gray-500">Affix passport size photo of the student</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <SectionTitle>Student's Profile</SectionTitle>
                        <FormRow label={keyToLabelMap.studentNameEn} value={data.studentNameEn} />
                        <FormRow label={keyToLabelMap.studentNameBn} value={data.studentNameBn} />

                        <FormRowGrid>
                            <FormRow label={keyToLabelMap.applyingForClass} value={data.applyingForClass} />
                            <FormRow label="Academic Year:" value={new Date().getFullYear().toString()} />
                        </FormRowGrid>
                        <FormRowGrid>
                            <FormRow label={keyToLabelMap.dob} value={new Date(data.dob).toLocaleDateString('en-GB')} />
                            <FormRow label={keyToLabelMap.birthCertNo} value={data.birthCertNo} />
                        </FormRowGrid>
                         <FormRowGrid>
                            <FormRow label={keyToLabelMap.gender} value={data.gender} />
                            <FormRow label={keyToLabelMap.religion} value={data.religion} />
                        </FormRowGrid>
                         <FormRowGrid>
                            <FormRow label={keyToLabelMap.bloodGroup} value={data.bloodGroup} />
                            <div></div>
                        </FormRowGrid>
                        <FormRow label={keyToLabelMap.presentAddress} value={data.presentAddress} />
                        <FormRow label={keyToLabelMap.permanentAddress} value={data.permanentAddress} />


                        <SectionTitle>Parent's Profile</SectionTitle>
                        <FormRow label={keyToLabelMap.fatherNameEn} value={data.fatherNameEn} />
                        <FormRow label={keyToLabelMap.fatherNameBn} value={data.fatherNameBn} />
                        <FormRowGrid>
                           <FormRow label={keyToLabelMap.fatherNid} value={data.fatherNid} />
                           <FormRow label={keyToLabelMap.fatherMobile} value={data.fatherMobile} />
                        </FormRowGrid>
                        
                        <FormRow label={keyToLabelMap.motherNameEn} value={data.motherNameEn} />
                        <FormRow label={keyToLabelMap.motherNameBn} value={data.motherNameBn} />
                        <FormRowGrid>
                           <FormRow label={keyToLabelMap.motherNid} value={data.motherNid} />
                           <FormRow label={keyToLabelMap.motherMobile} value={data.motherMobile} />
                        </FormRowGrid>
                        
                        <SectionTitle>Previous Academic Record</SectionTitle>
                         <FormRow label={keyToLabelMap.previousSchool} value={data.previousSchool} />

                    </div>

                    <div className="mt-24 flex justify-between items-center text-sm print-signature">
                        <div className="text-center pt-2 border-t border-gray-500">
                            <p>Guardian's Signature</p>
                        </div>
                        <div className="text-center pt-2 border-t border-gray-500">
                            <p>Headmaster's Signature</p>
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
                           font-size: 10pt; /* Smaller font for printing */
                        }
                        .non-printable {
                            display: none;
                        }
                        .print-signature {
                            display: flex !important;
                        }
                         h2 { font-size: 18pt !important; }
                         h3 { font-size: 11pt !important; }
                         .text-sm { font-size: 10pt !important; }
                    }
                    @page {
                        size: A4;
                        margin: 0.5in;
                    }
                `}</style>
            </div>
        </div>
    );
