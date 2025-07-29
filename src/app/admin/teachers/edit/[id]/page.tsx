
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherForm } from "@/components/admin/teachers/teacher-form";
import { getTeacherById } from "@/lib/teacher-data";
import { notFound } from "next/navigation";
import { toDataURL } from "@/lib/utils";
import { Teacher } from "@/lib/teacher-data";

export default async function EditTeacherPage({ params }: { params: { id: string } }) {
  const teacherData = await getTeacherById(params.id);

  if (!teacherData) {
    notFound();
  }

  // Convert buffer to data URL before passing to client component
  const teacher: Teacher = {
      ...teacherData,
      image: teacherData.image ? toDataURL(teacherData.image as Buffer) : ''
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>শিক্ষকের তথ্য সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <TeacherForm teacher={teacher} />
      </CardContent>
    </Card>
  );
}
