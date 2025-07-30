

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLinkForm } from "@/components/admin/nav-manager/nav-link-form";
import { getNavLinkById, getNavLinks } from "@/lib/nav-data";
import { notFound } from "next/navigation";
import { getPages } from "@/lib/page-data";

export default async function EditNavLinkPage({ params }: { params: { id: string } }) {
  const [link, allLinks, pages] = await Promise.all([
      getNavLinkById(params.id),
      getNavLinks(),
      getPages()
  ]);

  if (!link) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>নেভিগেশন লিংক সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <NavLinkForm link={link} allLinks={allLinks} pages={pages} parentId={link.parent_id || undefined} />
      </CardContent>
    </Card>
  );
}
