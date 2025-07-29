
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as ResultsTableFooter } from "@/components/ui/table";
import { Search, Printer, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { getResultByRollAndClass, StudentResult } from '@/lib/results-data';


export default function ResultsPage() {
    const [roll, setRoll] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [studentResult, setStudentResult] = useState<StudentResult | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handlePrint = () => {
        window.print();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roll || !selectedClass) {
            toast({
                title: 'ত্রুটি',
                description: 'অনুগ্রহ করে রোল এবং শ্রেণী নির্বাচন করুন।',
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);
        try {
            const result = await getResultByRollAndClass(roll, selectedClass);

            if (result) {
                setStudentResult(result);
            } else {
                toast({
                    title: 'কোনো ফলাফল পাওয়া যায়নি',
                    description: 'আপনার প্রদত্ত তথ্যের জন্য কোনো ফলাফল নেই।',
                    variant: 'destructive'
                });
                setStudentResult(null);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'ত্রুটি',
                description: 'ফলাফল আনতে একটি সমস্যা হয়েছে।',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    if (studentResult) {
        return (
            <div className="bg-white py-12 sm:py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                     <div className="mb-8 flex justify-between items-center non-printable">
                        <Button variant="outline" onClick={() => setStudentResult(null)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            ফিরে যান
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            প্রিন্ট করুন
                        </Button>
                    </div>

                    <div id="printable-area">
                        <Card className="shadow-lg border-primary/20 print:shadow-none print:border-none">
                            <CardHeader className="text-center space-y-2 border-b pb-4">
                                <div className="flex justify-center">
                                    <Image src="https://placehold.co/80x80.png" alt="School Logo" width={80} height={80} data-ai-hint="school logo" />
                                </div>
                                <h1 className="text-3xl font-bold text-primary font-headline">মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়</h1>
                                <p className="text-muted-foreground">House #1, Road #1, Block #A, Mirpur, Dhaka-1216</p>
                                <CardTitle className="text-xl pt-2 bg-primary/10 text-primary font-headline rounded-md p-2">একাডেমিক ট্রান্সক্রিপ্ট</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                               <div className="space-y-4 text-sm mb-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
                                        <div><span className="font-semibold">শিক্ষার্থীর নাম:</span> {studentResult.name}</div>
                                        <div><span className="font-semibold">শ্রেণী:</span> {studentResult.class_name}</div>
                                        <div><span className="font-semibold">রোল নং:</span> {studentResult.roll}</div>
                                        <div><span className="font-semibold">পিতার নাম:</span> {studentResult.father_name}</div>
                                        <div><span className="font-semibold">মাতার নাম:</span> {studentResult.mother_name}</div>
                                        <div><span className="font-semibold">গ্রুপ:</span> {studentResult.group_name}</div>
                                        <div className="md:col-span-2"><span className="font-semibold">পরীক্ষা:</span> {studentResult.exam_name}</div>
                                    </div>
                               </div>

                                <div className="mt-6">
                                     <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                            <TableHead>বিষয়</TableHead>
                                            <TableHead className="text-center">মার্ক</TableHead>
                                            <TableHead className="text-center">গ্রেড</TableHead>
                                            <TableHead className="text-right">জিপিএ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {studentResult.subjects.map((subject, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{subject.name}</TableCell>
                                                <TableCell className="text-center">{subject.marks ?? 'N/A'}</TableCell>
                                                <TableCell className="text-center">{subject.grade}</TableCell>
                                                <TableCell className="text-right">{subject.gpa}</TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                        <ResultsTableFooter>
                                             <TableRow className="bg-muted/50 font-bold">
                                                <TableCell colSpan={3} className="text-right">মোট জিপিএ:</TableCell>
                                                <TableCell className="text-right">{studentResult.final_gpa}</TableCell>
                                             </TableRow>
                                        </ResultsTableFooter>
                                    </Table>
                                </div>
                                <div className="mt-8 flex justify-between items-center text-sm">
                                    <p><span className="font-semibold">ফলাফল:</span> <span className="font-bold text-green-600">{studentResult.status}</span></p>
                                    <div className="text-center">
                                        <p className="border-t border-dashed w-32 pt-1">প্রধান শিক্ষক</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                     <style jsx global>{`
                        @media print {
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
                            }
                            .non-printable {
                                display: none;
                            }
                        }
                        @page {
                            size: auto;
                            margin: 0.5in;
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4 flex justify-center">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary font-headline">ফলাফল অনুসন্ধান</h1>
                        <p className="text-muted-foreground mt-2">আপনার পরীক্ষার ফলাফল দেখতে নিচের ফর্মটি পূরণ করুন</p>
                    </div>

                    <Card className="shadow-lg border-primary/20">
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle className="text-xl text-primary font-headline text-center">ফলাফল দেখুন</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="class">শ্রেণী</Label>
                                    <Select onValueChange={setSelectedClass} value={selectedClass} required>
                                        <SelectTrigger id="class">
                                            <SelectValue placeholder="আপনার শ্রেণী নির্বাচন করুন" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="৬ষ্ঠ">৬ষ্ঠ শ্রেণী</SelectItem>
                                            <SelectItem value="৭ম">৭ম শ্রেণী</SelectItem>
                                            <SelectItem value="৮ম">৮ম শ্রেণী</SelectItem>
                                            <SelectItem value="৯ম">৯ম শ্রেণী</SelectItem>
                                            <SelectItem value="১০ম">১০ম শ্রেণী</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="roll">রোল নম্বর</Label>
                                    <Input
                                        id="roll"
                                        type="number"
                                        placeholder="আপনার রোল নম্বর লিখুন"
                                        value={roll}
                                        onChange={(e) => setRoll(e.target.value)}
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                    {loading ? 'অনুসন্ধান চলছে...' : <><Search className="mr-2 h-5 w-5" />ফলাফল দেখুন</>}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
