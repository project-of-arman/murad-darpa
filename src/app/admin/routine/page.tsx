
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoutines, Routine } from "@/lib/routine-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import RoutineTable from "@/components/admin/routine/routine-table";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";
import { useEffect, useState } from "react";

export default function AdminRoutinePage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchRoutines() {
        setLoading(true);
        const data = await getRoutines();
        setRoutines(data);
        setLoading(false);
    }
    fetchRoutines();
  }, []);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>রুটিন ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
            <Button asChild>
            <Link href="/admin/routine/new">
                <PlusCircle className="mx-2 h-4 w-4" />
            <span className="hidden sm:flex"> নতুন পিরিয়ড যোগ করুন</span>
            </Link>
            </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? <p>লোড হচ্ছে...</p> : <RoutineTable routines={routines} userRole={userRole} />}
      </CardContent>
    </Card>
  );
}
