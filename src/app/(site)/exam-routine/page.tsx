
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getExamRoutines, ExamRoutine } from '@/lib/exam-routine-data';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const RoutineSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
    </Card>
);


export default function ExamRoutinePage() {
  const [routines, setRoutines] = useState<ExamRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedExam, setSelectedExam] = useState("all");

  useEffect(() => {
    async function fetchRoutines() {
      setLoading(true);
      const data = await getExamRoutines();
      setRoutines(data);
      setLoading(false);
    }
    fetchRoutines();
  }, []);

  const availableClasses = useMemo(() => ['all', ...Array.from(new Set(routines.map(r => r.class_name)))], [routines]);
  const availableExams = useMemo(() => ['all', ...Array.from(new Set(routines.map(r => r.exam_name)))], [routines]);

  const filteredRoutines = useMemo(() => {
    return routines.filter(r => 
        (selectedClass === 'all' || r.class_name === selectedClass) &&
        (selectedExam === 'all' || r.exam_name === selectedExam)
    );
  }, [routines, selectedClass, selectedExam]);
  
  const groupedRoutines = useMemo(() => {
    return filteredRoutines.reduce((acc, routine) => {
        const key = `${routine.exam_name} - ${routine.class_name}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(routine);
        return acc;
    }, {} as Record<string, ExamRoutine[]>);
  }, [filteredRoutines]);

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 non-printable">
          <h1 className="text-4xl font-bold text-primary font-headline">পরীক্ষার রুটিন</h1>
          <p className="text-muted-foreground mt-2">আপনার পরীক্ষার সময়সূচী দেখুন</p>
        </div>

        <Card className="shadow-lg border-primary/20 non-printable mb-8">
            <CardHeader>
                <CardTitle className="text-lg">ফিল্টার</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger><SelectValue placeholder="শ্রেণী নির্বাচন করুন" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">সকল শ্রেণী</SelectItem>
                        {availableClasses.slice(1).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger><SelectValue placeholder="পরীক্ষা নির্বাচন করুন" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">সকল পরীক্ষা</SelectItem>
                        {availableExams.slice(1).map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        <div className="flex justify-end mb-4 non-printable">
            <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                প্রিন্ট করুন
            </Button>
        </div>

        <div id="printable-area" className="space-y-8">
            {loading ? <RoutineSkeleton /> : Object.keys(groupedRoutines).length > 0 ? (
                Object.entries(groupedRoutines).map(([groupTitle, routines]) => (
                    <Card key={groupTitle} className="shadow-lg border-primary/20 print:shadow-none print:border">
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary font-headline text-center">{groupTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table className="border">
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="font-bold">তারিখ ও দিন</TableHead>
                                            <TableHead className="font-bold">বিষয়</TableHead>
                                            <TableHead className="font-bold text-center">সময়</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {routines.map((routine) => (
                                            <TableRow key={routine.id}>
                                                <TableCell>
                                                    {new Date(routine.exam_date).toLocaleDateString('bn-BD', { day: '2-digit', month: '2-digit', year: 'numeric' })} <br />
                                                    {new Date(routine.exam_date).toLocaleDateString('bn-BD', { weekday: 'long' })}
                                                </TableCell>
                                                <TableCell className="font-medium">{routine.subject}</TableCell>
                                                <TableCell className="text-center">
                                                    {new Date(`1970-01-01T${routine.start_time}`).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' })}
                                                    {' - '}
                                                    {new Date(`1970-01-01T${routine.end_time}`).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-center text-muted-foreground py-12">কোনো রুটিন পাওয়া যায়নি।</p>
            )}
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
