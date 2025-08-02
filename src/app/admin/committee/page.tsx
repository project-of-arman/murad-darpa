
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommitteeMembers, CommitteeMember } from "@/lib/committee-data";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import CommitteeTable from "@/components/admin/committee/committee-table";
import { toDataURL } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";

export default function AdminCommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useAppSelector(selectRole);

  useEffect(() => {
    async function fetchAndProcessMembers() {
      const membersRaw = await getCommitteeMembers();
      const processedMembers = membersRaw.map(member => ({
        ...member,
        image: member.image ? toDataURL(member.image as Buffer) : '',
      }));
      setMembers(processedMembers);
      setLoading(false);
    }
    fetchAndProcessMembers();
  }, []);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>কমিটি ব্যবস্থাপনা</CardTitle>
        {userRole !== 'visitor' && (
          <Button asChild>
            <Link href="/admin/committee/new">
              <PlusCircle className="mx-2 h-4 w-4" />
              <span className="hidden sm:flex">নতুন সদস্য যোগ করুন</span>
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? <p>Loading...</p> : <CommitteeTable members={members} />}
      </CardContent>
    </Card>
  );
}
