
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoticeForm } from "@/components/admin/notices/notice-form";
import { getNoticeById } from "@/lib/notice-data";
import { notFound } from "next/navigation";

export default async function EditNoticePage({ params }: { params: { id: string } }) {
  const notice = await getNoticeById(params.id);

  if (!notice) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>নোটিশ সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <NoticeForm notice={notice} />
      </CardContent>
    </Card>
  );
}
