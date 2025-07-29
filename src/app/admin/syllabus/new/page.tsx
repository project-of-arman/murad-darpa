
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyllabusForm } from "@/components/admin/syllabus/syllabus-form";

export default async function NewSyllabusPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন সিলেবাস যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <SyllabusForm />
      </CardContent>
    </Card>
  );
}
