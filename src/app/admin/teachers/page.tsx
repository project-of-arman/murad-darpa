
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeachers } from "@/lib/teacher-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import TeacherTable from "@/components/admin/teachers/teacher-table";
import { toDataURL } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";
import { useEffect, useState } from "react";
import type { Teacher } from "@/lib/teacher-data";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchAndProcessTeachers() {
      const teachersRaw = await getTeachers();
      const processedTeachers = teachersRaw.map(teacher => ({
          ...teacher,
          image: teacher.image ? toDataURL(teacher.image as Buffer) : '',
      }));
      setTeachers(processedTeachers);
      setLoading(false);
    }
    fetchAndProcessTeachers();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>শিক্ষক ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
            <Button asChild>
            <Link href="/admin/teachers/new">
                <PlusCircle className="mx-2 h-4 w-4" />
                <span className="hidden sm:flex">নতুন শিক্ষক যোগ করুন</span>
            </Link>
            </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? <p>Loading teachers...</p> : <TeacherTable teachers={teachers} />}
      </CardContent>
    </Card>
  );
}
