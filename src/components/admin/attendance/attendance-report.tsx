
'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { AttendanceReportRecord } from '@/lib/actions/attendance-actions';

const classOptions = ['all', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'];
const statusOptions = ['all', 'Present', 'Absent'];

export default function AttendanceReport({ initialRecords, initialDate }: { initialRecords: AttendanceReportRecord[], initialDate: string }) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(initialDate));
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const router = useRouter();
    const pathname = usePathname();

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            router.push(`${pathname}?date=${format(date, 'yyyy-MM-dd')}`);
        }
    };

    const filteredRecords = useMemo(() => {
        return initialRecords.filter(rec => 
            (selectedClass === 'all' || rec.class_name === selectedClass) &&
            (selectedStatus === 'all' || rec.status === selectedStatus)
        );
    }, [initialRecords, selectedClass, selectedStatus]);
    
    const presentCount = useMemo(() => filteredRecords.filter(r => r.status === 'Present').length, [filteredRecords]);
    const absentCount = useMemo(() => filteredRecords.filter(r => r.status === 'Absent').length, [filteredRecords]);

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
                        <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                </Popover>
                 <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="শ্রেণী নির্বাচন" /></SelectTrigger>
                    <SelectContent>
                        {classOptions.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'সকল শ্রেণী' : c}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="স্ট্যাটাস নির্বাচন" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">সকল</SelectItem>
                        <SelectItem value="Present">উপস্থিত</SelectItem>
                        <SelectItem value="Absent">অনুপস্থিত</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex gap-4 text-sm font-medium">
                <div>মোট: {filteredRecords.length}</div>
                <div className="text-green-600">উপস্থিত: {presentCount}</div>
                <div className="text-red-600">অনুপস্থিত: {absentCount}</div>
            </div>
            
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>রোল</TableHead>
                            <TableHead>নাম</TableHead>
                            <TableHead>শ্রেণী</TableHead>
                            <TableHead>স্ট্যাটাস</TableHead>
                            <TableHead>কারণ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.length > 0 ? filteredRecords.map(record => (
                             <TableRow key={record.id}>
                                <TableCell>{record.roll}</TableCell>
                                <TableCell>{record.student_name}</TableCell>
                                <TableCell>{record.class_name}</TableCell>
                                <TableCell>
                                    <Badge variant={record.status === 'Present' ? 'default' : 'destructive'}>
                                        {record.status === 'Present' ? 'উপস্থিত' : 'অনুপস্থিত'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{record.reason || '-'}</TableCell>
                             </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">এই তারিখে কোনো হাজিরা পাওয়া যায়নি।</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
