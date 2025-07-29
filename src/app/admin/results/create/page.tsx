
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultForm } from "@/components/admin/results/result-form";
import { getStudents } from "@/lib/student-data";

export default async function CreateResultPage() {
  const students = await getStudents();

  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন ফলাফল তৈরি করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <ResultForm students={students} />
      </CardContent>
    </Card>
  );
}
