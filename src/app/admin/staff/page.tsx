
"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStaff } from "@/lib/staff-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import StaffTable from "@/components/admin/staff/staff-table";
import { toDataURL } from "@/lib/utils";
import type { Staff } from "@/lib/staff-data";

export default async function AdminStaffPage() {
  const staffRaw = await getStaff();
  const staff = staffRaw.map(s => ({
    ...s,
    image: s.image ? toDataURL(s.image as Buffer) : ''
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>কর্মচারী ব্যবস্থাপনা</CardTitle>
          <Button asChild>
            <Link href="/admin/staff/new">
              <PlusCircle className="mx-2 h-4 w-4" />
                <span className="hidden sm:flex">নতুন কর্মচারী যোগ করুন</span>
            </Link>
          </Button>
      </CardHeader>
      <CardContent>
         <StaffTable staff={staff} />
      </CardContent>
    </Card>
  );
}
