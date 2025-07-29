
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoticeForm } from "@/components/admin/notices/notice-form";
import { getNoticeById } from "@/lib/notice-data";

export default async function NewNoticePage() {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন নোটিশ তৈরি করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <NoticeForm />
      </CardContent>
    </Card>
  );
}
