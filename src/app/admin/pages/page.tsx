

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPages } from "@/lib/page-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import PageTable from "@/components/admin/pages/page-table";

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>পেজ ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/pages/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন পেজ যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <PageTable pages={pages} />
      </CardContent>
    </Card>
  );
}
