
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLinkForm } from "@/components/admin/nav-manager/nav-link-form";
import { getNavLinks } from "@/lib/nav-data";

export default async function NewNavLinkPage({ searchParams }: { searchParams: { parent_id?: string } }) {
  const parentId = searchParams.parent_id ? parseInt(searchParams.parent_id) : undefined;
  const allLinks = await getNavLinks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন নেভিগেশন লিংক যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <NavLinkForm allLinks={allLinks} parentId={parentId} />
      </CardContent>
    </Card>
  );
}
