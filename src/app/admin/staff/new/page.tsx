
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffForm } from "@/components/admin/staff/staff-form";

export default async function NewStaffPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন কর্মচারী যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <StaffForm />
      </CardContent>
    </Card>
  );
}
