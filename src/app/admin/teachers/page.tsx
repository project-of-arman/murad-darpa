
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeachers } from "@/lib/teacher-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import TeacherTable from "@/components/admin/teachers/teacher-table";
import { toDataURL } from "@/lib/utils";

export default async function AdminTeachersPage() {
  const teachersRaw = await getTeachers();
  const teachers = teachersRaw.map(teacher => ({
      ...teacher,
      image: teacher.image ? toDataURL(teacher.image as Buffer) : '',
  }));


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>শিক্ষক ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/teachers/new">
            <PlusCircle className="mx-2 h-4 w-4" />
               <span className="hidden sm:flex">নতুন শিক্ষক যোগ করুন</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <TeacherTable teachers={teachers} />
      </CardContent>
    </Card>
  );
}
