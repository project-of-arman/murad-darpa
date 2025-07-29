
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotices } from "@/lib/notice-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import NoticeTable from "@/components/admin/notices/notice-table";

export default async function AdminNoticesPage() {
  const notices = await getNotices();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>নোটিশ ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/notices/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন নোটিশ যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <NoticeTable notices={notices} />
      </CardContent>
    </Card>
  );
}
