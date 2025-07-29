

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetForm } from "@/components/admin/sidebar/widget-form";
import { getPages } from "@/lib/page-data";

export default async function NewSidebarWidgetPage() {
  const pages = await getPages();
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন উইজেট যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <WidgetForm pages={pages}/>
      </CardContent>
    </Card>
  );
}
