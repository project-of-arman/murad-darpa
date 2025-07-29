
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherForm } from "@/components/admin/teachers/teacher-form";

export default async function NewTeacherPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন শিক্ষক যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <TeacherForm />
      </CardContent>
    </Card>
  );
}
