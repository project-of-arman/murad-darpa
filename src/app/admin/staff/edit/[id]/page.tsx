
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffForm } from "@/components/admin/staff/staff-form";
import { getStaffById } from "@/lib/staff-data";
import { notFound } from "next/navigation";
import { toDataURL } from "@/lib/utils";
import type { Staff } from "@/lib/staff-data";

export default async function EditStaffPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }
  const staffMemberData = await getStaffById(id);

  if (!staffMemberData) {
    notFound();
  }

  const staffMember: Staff = {
      ...staffMemberData,
      image: staffMemberData.image ? toDataURL(staffMemberData.image as Buffer) : ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>কর্মচারীর তথ্য সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <StaffForm staff={staffMember} />
      </CardContent>
    </Card>
  );
}
