
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommitteeForm } from "@/components/admin/committee/committee-form";
import { getCommitteeMemberById } from "@/lib/committee-data";
import { notFound } from "next/navigation";
import { toDataURL } from "@/lib/utils";
import type { CommitteeMember } from "@/lib/committee-data";

export default async function EditCommitteeMemberPage({ params }: { params: { id: string } }) {
  const memberData = await getCommitteeMemberById(params.id);

  if (!memberData) {
    notFound();
  }
  
  const member: CommitteeMember = {
      ...memberData,
      image: memberData.image ? toDataURL(memberData.image as Buffer) : ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>সদস্যের তথ্য সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <CommitteeForm member={member} />
      </CardContent>
    </Card>
  );
}
