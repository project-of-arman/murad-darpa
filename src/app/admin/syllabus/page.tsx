

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSyllabuses, Syllabus } from "@/lib/syllabus-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import SyllabusTable from "@/components/admin/syllabus/syllabus-table";

export default async function AdminSyllabusPage() {
  const syllabuses = await getSyllabuses();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>সিলেবাস ব্যবস্থাপনা</CardTitle>
        <Button asChild>
            <Link href="/admin/syllabus/new">
                <PlusCircle className="mx-2 h-4 w-4" />
            <span className="hidden sm:flex">  নতুন সিলেবাস যোগ করুন</span>
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <SyllabusTable syllabuses={syllabuses} />
      </CardContent>
    </Card>
  );
}
