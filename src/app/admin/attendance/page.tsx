
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getStudents } from "@/lib/student-data";
import AttendanceManager from "@/components/admin/attendance/attendance-manager";

export default async function AttendancePage() {
    const allStudents = await getStudents();
    
    // We pass all students to the client component, which will handle filtering.
    // This is simpler than making new server requests for each filter change.
    return (
        <Card>
            <CardHeader>
                <CardTitle>শিক্ষার্থী হাজিরা</CardTitle>
            </CardHeader>
            <CardContent>
                <AttendanceManager allStudents={allStudents} />
            </CardContent>
        </Card>
    );
}
