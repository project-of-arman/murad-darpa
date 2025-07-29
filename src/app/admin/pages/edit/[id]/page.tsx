

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageForm } from "@/components/admin/pages/page-form";
import { getPageById } from "@/lib/page-data";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: { id: string } }) {
  const page = await getPageById(params.id);

  if (!page) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>পেজ সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <PageForm page={page} />
      </CardContent>
    </Card>
  );
}
