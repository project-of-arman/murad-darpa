
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStudents } from "@/lib/student-data";
import AttendanceManager from "@/components/admin/attendance/attendance-manager";
import AttendanceReport from "@/components/admin/attendance/attendance-report";
import { getAttendanceByDate } from "@/lib/actions/attendance-actions";
import { format } from 'date-fns';
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";
import { useEffect, useState } from "react";
import type { Student } from "@/lib/student-data";
import type { AttendanceReportRecord } from "@/lib/actions/attendance-actions";
import { useSearchParams } from "next/navigation";

export default function AttendancePage() {
    const userRole = useAppSelector(selectRole);
    const searchParams = useSearchParams();
    
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceReportRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const reportDate = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [students, records] = await Promise.all([
                getStudents(),
                getAttendanceByDate(reportDate)
            ]);
            setAllStudents(students);
            setAttendanceRecords(records);
            setLoading(false);
        }
        fetchData();
    }, [reportDate]);
    
    if(loading) {
        return <div>Loading...</div>
    }

    return (
        <Tabs defaultValue="report" className="w-full">
            {userRole !== 'visitor' && (
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="report">হাজিরা রিপোর্ট</TabsTrigger>
                    <TabsTrigger value="update">হাজিরা আপডেট</TabsTrigger>
                </TabsList>
            )}
            <TabsContent value="report">
                 <Card>
                    <CardHeader>
                        <CardTitle>শিক্ষার্থী হাজিরা রিপোর্ট</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AttendanceReport initialRecords={attendanceRecords} initialDate={reportDate} />
                    </CardContent>
                </Card>
            </TabsContent>
            {userRole !== 'visitor' && (
                <TabsContent value="update">
                    <Card>
                        <CardHeader>
                            <CardTitle>শিক্ষার্থী হাজিরা আপডেট করুন</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AttendanceManager allStudents={allStudents} />
                        </CardContent>
                    </Card>
                </TabsContent>
            )}
        </Tabs>
    );
}
