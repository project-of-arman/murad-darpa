
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentForm } from "@/components/admin/students/student-form";
import { getStudentForAdmin } from "@/lib/student-data";
import { notFound } from "next/navigation";

export default async function EditStudentPage({ params }: { params: { id: string } }) {
  const student = await getStudentForAdmin(params.id);

  if (!student) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>শিক্ষার্থীর তথ্য সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <StudentForm student={student} />
      </CardContent>
    </Card>
  );
}
