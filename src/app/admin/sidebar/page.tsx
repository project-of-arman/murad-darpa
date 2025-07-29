
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSidebarWidgets } from "@/lib/sidebar-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import SidebarWidgetList from "@/components/admin/sidebar/sidebar-widget-list";

export default async function AdminSidebarPage() {
  const widgets = await getSidebarWidgets();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>সাইডবার ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/sidebar/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন উইজেট যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <SidebarWidgetList widgets={widgets} />
      </CardContent>
    </Card>
  );
}
