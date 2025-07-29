
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExamRoutines } from "@/lib/exam-routine-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ExamRoutineTable from "@/components/admin/exam-routine/exam-routine-table";

export default async function AdminExamRoutinePage() {
  const routines = await getExamRoutines();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>পরীক্ষার রুটিন ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/exam-routine/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন রুটিন যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ExamRoutineTable routines={routines} />
      </CardContent>
    </Card>
  );
}
