
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommitteeForm } from "@/components/admin/committee/committee-form";

export default function NewCommitteeMemberPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন সদস্য যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <CommitteeForm />
      </CardContent>
    </Card>
  );
}
