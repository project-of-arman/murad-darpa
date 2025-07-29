
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultForm } from "@/components/admin/results/result-form";
import { getResultForEdit } from "@/lib/actions/results-actions";
import { getStudents } from "@/lib/student-data";
import { notFound } from "next/navigation";

export default async function EditResultPage({ params }: { params: { id: string } }) {
  const resultId = parseInt(params.id, 10);
  const [result, students] = await Promise.all([
    getResultForEdit(resultId),
    getStudents()
  ]);

  if (!result) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ফলাফল সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <ResultForm students={students} result={result} />
      </CardContent>
    </Card>
  );
}
