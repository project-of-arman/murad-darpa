
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkGroupForm } from "@/components/admin/important-links/link-group-form";
import { getLinkGroupById } from "@/lib/important-links-data";
import { notFound } from "next/navigation";

export default async function EditLinkGroupPage({ params }: { params: { id: string } }) {
  const group = await getLinkGroupById(params.id);

  if (!group) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>লিংক গ্রুপ সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <LinkGroupForm group={group} />
      </CardContent>
    </Card>
  );
}
