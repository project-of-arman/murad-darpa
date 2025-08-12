

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers, getLoggedInUser } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import UserTable from "@/components/admin/users/user-table";
import { cookies } from 'next/headers';

type AdminUsersPageProps = {}

export default async function AdminUsersPage({}: AdminUsersPageProps) {
  const users = await getAllUsers();
  
  // This is a placeholder for getting the current user's role.
  // In a real app, you would get this from the session.
  const userRole = 'admin';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ব্যবহারকারী ব্যবস্থাপনা</CardTitle>
        {userRole === 'admin' && (
          <Button asChild>
            <Link href="/admin/users/new">
              <PlusCircle className="mx-2 h-4 w-4" />
              <span className="hidden sm:flex">নতুন ব্যবহারকারী যোগ করুন</span>
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <UserTable users={users} userRole={userRole} />
      </CardContent>
    </Card>
  );
}
