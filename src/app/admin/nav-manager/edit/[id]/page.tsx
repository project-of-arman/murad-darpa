
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLinkForm } from "@/components/admin/nav-manager/nav-link-form";
import { getNavLinkById, getNavLinks } from "@/lib/nav-data";
import { notFound } from "next/navigation";

export default async function EditNavLinkPage({ params }: { params: { id: string } }) {
  const [link, allLinks] = await Promise.all([
      getNavLinkById(params.id),
      getNavLinks()
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
        <NavLinkForm link={link} allLinks={allLinks} />
      </CardContent>
    </Card>
  );
}
