
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoutineForm } from "@/components/admin/routine/routine-form";
import { getRoutineById } from "@/lib/routine-data";
import { notFound } from "next/navigation";

export default async function EditRoutinePage({ params }: { params: { id: string } }) {
  const routine = await getRoutineById(params.id);

  if (!routine) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>পিরিয়ড সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <RoutineForm routine={routine} />
      </CardContent>
    </Card>
  );
}
