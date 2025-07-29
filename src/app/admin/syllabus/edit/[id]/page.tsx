
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyllabusForm } from "@/components/admin/syllabus/syllabus-form";
import { getSyllabusById } from "@/lib/syllabus-data";
import { notFound } from "next/navigation";

export default async function EditSyllabusPage({ params }: { params: { id: string } }) {
  const syllabus = await getSyllabusById(params.id);

  if (!syllabus) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>সিলেবাস সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <SyllabusForm syllabus={syllabus} />
      </CardContent>
    </Card>
  );
}
