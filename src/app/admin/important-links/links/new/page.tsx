
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkForm } from "@/components/admin/important-links/link-form";
import { getPages } from "@/lib/page-data";

export default async function NewLinkPage({ searchParams }: { searchParams: { groupId: string }}) {
  const groupId = parseInt(searchParams.groupId, 10);
  const pages = await getPages();
  
  if (isNaN(groupId)) {
      return <p>Invalid Group ID</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন লিংক যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <LinkForm groupId={groupId} pages={pages} />
      </CardContent>
    </Card>
  );
}
