
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStaff } from "@/lib/staff-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import StaffTable from "@/components/admin/staff/staff-table";
import { toDataURL } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";
import { useEffect, useState } from "react";
import type { Staff } from "@/lib/staff-data";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchAndProcessStaff() {
      const staffRaw = await getStaff();
      const processedStaff = staffRaw.map(s => ({
        ...s,
        image: s.image ? toDataURL(s.image as Buffer) : ''
      }));
      setStaff(processedStaff);
      setLoading(false);
    }
    fetchAndProcessStaff();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>কর্মচারী ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
          <Button asChild>
            <Link href="/admin/staff/new">
              <PlusCircle className="mx-2 h-4 w-4" />
                <span className="hidden sm:flex">নতুন কর্মচারী যোগ করুন</span>
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
         {loading ? <p>Loading staff...</p> : <StaffTable staff={staff} />}
      </CardContent>
    </Card>
  );
}
