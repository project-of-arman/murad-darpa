
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamRoutineForm } from "@/components/admin/exam-routine/exam-routine-form";
import { getExamRoutineById } from "@/lib/exam-routine-data";
import { notFound } from "next/navigation";

export default async function EditExamRoutinePage({ params }: { params: { id: string } }) {
  const routine = await getExamRoutineById(params.id);

  if (!routine) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>পরীক্ষার রুটিন সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <ExamRoutineForm routine={routine} />
      </CardContent>
    </Card>
  );
}
