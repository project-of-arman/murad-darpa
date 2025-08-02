
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSyllabuses, Syllabus } from "@/lib/syllabus-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import SyllabusTable from "@/components/admin/syllabus/syllabus-table";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";
import { useEffect, useState } from "react";

export default function AdminSyllabusPage() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchSyllabuses() {
        setLoading(true);
        const data = await getSyllabuses();
        setSyllabuses(data);
        setLoading(false);
    }
    fetchSyllabuses();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>সিলেবাস ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
            <Button asChild>
                <Link href="/admin/syllabus/new">
                    <PlusCircle className="mx-2 h-4 w-4" />
                <span className="hidden sm:flex">  নতুন সিলেবাস যোগ করুন</span>
                </Link>
            </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? <p>লোড হচ্ছে...</p> : <SyllabusTable syllabuses={syllabuses} userRole={userRole} />}
      </CardContent>
    </Card>
  );
}
