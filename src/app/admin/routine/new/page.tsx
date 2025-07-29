
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoutineForm } from "@/components/admin/routine/routine-form";

export default async function NewRoutinePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন পিরিয়ড যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <RoutineForm />
      </CardContent>
    </Card>
  );
}
