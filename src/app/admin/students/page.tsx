
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllStudentsForAdmin } from "@/lib/student-data";
import Link from "next/link";
import { CloudCog, PlusCircle } from "lucide-react";
import StudentTable from "@/components/admin/students/student-table";
import { toDataURL } from "@/lib/utils";

type AdminStudentsPageProps = {
  userRole?: 'admin' | 'moderator' | 'visitor';
}

export default async function AdminStudentsPage({ userRole }: AdminStudentsPageProps) {
  const studentsRaw = await getAllStudentsForAdmin();

  const students = studentsRaw.map(student => ({
      ...student,
      image: student.image ? toDataURL(student.image as Buffer) : null,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>শিক্ষার্থী ব্যবস্থাপনা</CardTitle>
        <StudentTable.HeaderActions />
      </CardHeader>
      <CardContent>
        <StudentTable students={students} />
      </CardContent>
    </Card>
  );
}
