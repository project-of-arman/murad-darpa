
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/admin/users/user-form";
import { getUserById } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ব্যবহারকারীর তথ্য সম্পাদনা করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <UserForm user={user} />
      </CardContent>
    </Card>
  );
}
