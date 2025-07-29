
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImportantLinkGroups } from "@/lib/important-links-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import LinkGroupList from "@/components/admin/important-links/link-group-list";

export default async function AdminImportantLinksPage() {
  const linkGroups = await getImportantLinkGroups();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>গুরুত্বপূর্ণ লিংক ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/important-links/groups/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন গ্রুপ যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <LinkGroupList groups={linkGroups} />
      </CardContent>
    </Card>
  );
}

