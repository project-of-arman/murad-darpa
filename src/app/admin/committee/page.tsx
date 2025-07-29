
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommitteeMembers } from "@/lib/committee-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import CommitteeTable from "@/components/admin/committee/committee-table";
import { toDataURL } from "@/lib/utils";

export default async function AdminCommitteePage() {
  const membersRaw = await getCommitteeMembers();
  const members = membersRaw.map(member => ({
      ...member,
      image: member.image ? toDataURL(member.image as Buffer) : '',
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>কমিটি ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/committee/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন সদস্য যোগ করুন
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <CommitteeTable members={members} />
      </CardContent>
    </Card>
  );
}
