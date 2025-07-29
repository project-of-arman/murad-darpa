
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamRoutineForm } from "@/components/admin/exam-routine/exam-routine-form";

export default async function NewExamRoutinePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন পরীক্ষার রুটিন যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <ExamRoutineForm />
      </CardContent>
    </Card>
  );
}
