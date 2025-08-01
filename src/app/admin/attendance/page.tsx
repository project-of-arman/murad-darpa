
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStudents } from "@/lib/student-data";
import AttendanceManager from "@/components/admin/attendance/attendance-manager";
import AttendanceReport from "@/components/admin/attendance/attendance-report";
import { getAttendanceByDate } from "@/lib/actions/attendance-actions";
import { format } from 'date-fns';

type AttendancePageProps = {
    searchParams: { date?: string };
    userRole: 'admin' | 'moderator' | 'visitor';
}

export default async function AttendancePage({ searchParams, userRole }: AttendancePageProps) {
    const allStudents = await getStudents();
    const reportDate = searchParams.date || format(new Date(), 'yyyy-MM-dd');
    const attendanceRecords = await getAttendanceByDate(reportDate);
    
    return (
        <Tabs defaultValue="report" className="w-full">
            <TabsList className={userRole === 'visitor' ? "hidden" : "grid w-full grid-cols-2"}>
                <TabsTrigger value="report">হাজিরা রিপোর্ট</TabsTrigger>
                <TabsTrigger value="update">হাজিরা আপডেট</TabsTrigger>
            </TabsList>
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
