
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoutines } from "@/lib/routine-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import RoutineTable from "@/components/admin/routine/routine-table";

export default async function AdminRoutinePage() {
  const routines = await getRoutines();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>রুটিন ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/routine/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন পিরিয়ড যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <RoutineTable routines={routines} />
      </CardContent>
    </Card>
  );
}
