
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavLinks } from "@/lib/nav-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import NavLinkTable from "@/components/admin/nav-manager/nav-link-table";

export default async function AdminNavManagerPage() {
  const navLinks = await getNavLinks();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>নেভিগেশন মেনু ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/nav-manager/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন লিংক যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <NavLinkTable navLinks={navLinks} />
      </CardContent>
    </Card>
  );
}
