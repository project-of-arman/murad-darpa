
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import UserTable from "@/components/admin/users/user-table";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ব্যবহারকারী ব্যবস্থাপনা</CardTitle>
        <Button asChild>
          <Link href="/admin/users/new">
            <PlusCircle className="mx-2 h-4 w-4" />
            <span className="hidden sm:flex">নতুন ব্যবহারকারী যোগ করুন</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <UserTable users={users} />
      </CardContent>
    </Card>
  );
}
