

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetForm } from "@/components/admin/sidebar/widget-form";
import { getSidebarWidgetById } from "@/lib/sidebar-data";
import { notFound } from "next/navigation";
import { getPages } from "@/lib/page-data";

export default async function EditSidebarWidgetPage({ params }: { params: { id: string } }) {
  const [widget, pages] = await Promise.all([
    getSidebarWidgetById(params.id),
    getPages()
  ]);

  if (!widget) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>উইজেট সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <WidgetForm widget={widget} pages={pages} />
      </CardContent>
    </Card>
  );
}
