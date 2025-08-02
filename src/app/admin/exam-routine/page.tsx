
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExamRoutines, ExamRoutine } from "@/lib/exam-routine-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ExamRoutineTable from "@/components/admin/exam-routine/exam-routine-table";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";

export default function AdminExamRoutinePage() {
  const [routines, setRoutines] = useState<ExamRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchRoutines() {
        setLoading(true);
        const data = await getExamRoutines();
        setRoutines(data);
        setLoading(false);
    }
    fetchRoutines();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>পরীক্ষার রুটিন ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
            <Button asChild>
            <Link href="/admin/exam-routine/new">
                <PlusCircle className="mx-2 h-4 w-4" />
            <span className="hidden sm:flex"> নতুন রুটিন যোগ করুন</span>
            </Link>
            </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? <p>লোড হচ্ছে...</p> : <ExamRoutineTable routines={routines} userRole={userRole} />}
      </CardContent>
    </Card>
  );
}
