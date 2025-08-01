
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import type { Student } from '@/lib/student-data';
import { getStudentsWithAttendance, saveAttendance, StudentAttendanceRecord } from '@/lib/actions/attendance-actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


type AttendanceStatus = {
    [studentId: number]: {
        status: 'Present' | 'Absent';
        reason?: string;
    }
}

export default function AttendanceManager({ allStudents }: { allStudents: Student[] }) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedClass, setSelectedClass] = useState<string>('৬ষ্ঠ');
    const [attendance, setAttendance] = useState<AttendanceStatus>({});
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const classOptions = useMemo(() => {
        return ['৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'];
    }, []);

    const studentsInClass = useMemo(() => {
        return allStudents.filter(s => s.class_name === selectedClass);
    }, [allStudents, selectedClass]);

    useEffect(() => {
        async function fetchAttendance() {
            setLoading(true);
            const dateString = format(selectedDate, 'yyyy-MM-dd');
            const records = await getStudentsWithAttendance(dateString, selectedClass);
            
            const newAttendance: AttendanceStatus = {};
            records.forEach(rec => {
                newAttendance[rec.id] = {
                    status: rec.status || 'Present', // Default to present if no record
                    reason: rec.reason || ''
                };
            });
            setAttendance(newAttendance);
            setLoading(false);
        }
        fetchAttendance();
    }, [selectedDate, selectedClass]);
    
    const handleStatusChange = (studentId: number, status: 'Present' | 'Absent') => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleReasonChange = (studentId: number, reason: string) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], reason }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const result = await saveAttendance(dateString, attendance);

        if(result.success) {
            toast({ title: "সফল", description: "হাজিরা সফলভাবে সংরক্ষণ করা হয়েছে।" });
        } else {
            toast({ title: "ত্রুটি", description: result.error || "সংরক্ষণ করা যায়নি।", variant: "destructive" });
        }
        setIsSaving(false);
    }
    
    const AttendanceRowSkeleton = () => (
        <TableRow>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
            <TableCell><div className="flex gap-4"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-20" /></div></TableCell>
            <TableCell><Skeleton className="h-9 w-full" /></TableCell>
        </TableRow>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn("w-[280px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
                    </PopoverContent>
                </Popover>
                 <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="শ্রেণী নির্বাচন" /></SelectTrigger>
                    <SelectContent>
                        {classOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>রোল</TableHead>
                            <TableHead>নাম</TableHead>
                            <TableHead>স্ট্যাটাস</TableHead>
                            <TableHead>অনুপস্থিতির কারণ (যদি থাকে)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({length: 5}).map((_, i) => <AttendanceRowSkeleton key={i} />)
                        ) : (
                           studentsInClass.map(student => {
                                const studentAttendance = attendance[student.id] || { status: 'Present', reason: '' };
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.roll}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                value={studentAttendance.status}
                                                onValueChange={(value) => handleStatusChange(student.id, value as 'Present' | 'Absent')}
                                                className="flex gap-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Present" id={`present-${student.id}`} />
                                                    <Label htmlFor={`present-${student.id}`}>উপস্থিত</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Absent" id={`absent-${student.id}`} />
                                                    <Label htmlFor={`absent-${student.id}`}>অনুপস্থিত</Label>
                                                </div>
                                            </RadioGroup>
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                disabled={studentAttendance.status === 'Present'}
                                                value={studentAttendance.reason || ''}
                                                onChange={(e) => handleReasonChange(student.id, e.target.value)}
                                                placeholder="কারণ লিখুন..."
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                           })
                        )}
                        {!loading && studentsInClass.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">এই শ্রেণীতে কোনো শিক্ষার্থী নেই।</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading || isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'হাজিরা সংরক্ষণ করুন'}
                </Button>
            </div>
        </div>
    );
}

