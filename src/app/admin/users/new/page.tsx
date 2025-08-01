
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/admin/users/user-form";

export default function NewUserPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন ব্যবহারকারী তৈরি করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <UserForm />
      </CardContent>
    </Card>
  );
}
