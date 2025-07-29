
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentForm } from "@/components/admin/students/student-form";

export default async function NewStudentPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন শিক্ষার্থী যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <StudentForm />
      </CardContent>
    </Card>
  );
}
