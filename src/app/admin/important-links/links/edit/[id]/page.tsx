
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkForm } from "@/components/admin/important-links/link-form";
import { getLinkById } from "@/lib/important-links-data";
import { getPages } from "@/lib/page-data";
import { notFound } from "next/navigation";

export default async function EditLinkPage({ params }: { params: { id: string } }) {
  const [link, pages] = await Promise.all([
    getLinkById(params.id),
    getPages()
  ]);

  if (!link) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>লিংক সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <LinkForm link={link} groupId={link.group_id} pages={pages} />
      </CardContent>
    </Card>
  );
}
