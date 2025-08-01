
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import type { AdminAccount } from "@/lib/actions/auth-actions";
import { deleteUser } from "@/lib/actions/auth-actions";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

export default function UserTable({ users }: { users: AdminAccount[] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminAccount | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
  }, [filteredUsers, currentPage]);


  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteClick = (user: AdminAccount) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      const result = await deleteUser(selectedUser.id);
      if (result.success) {
        toast({ title: "User Deleted", description: `User "${selectedUser.username}" has been deleted.` });
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Input 
            placeholder="ইউজারনেম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="max-w-sm"
        />
      </div>
      {/* Desktop View */}
      <div className="border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ইউজারনেম</TableHead>
              <TableHead>ইমেইল</TableHead>
              <TableHead>ফোন</TableHead>
              <TableHead>ভূমিকা</TableHead>
              <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/edit/${user.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteClick(user)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  কোনো ব্যবহারকারী পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Mobile View */}
       <div className="md:hidden space-y-4">
        {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
            <Card key={user.id}>
                <CardHeader className="p-4">
                    <CardTitle className="text-base">{user.username}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm space-y-1">
                    <p><strong>ইমেইল:</strong> {user.email}</p>
                    <p><strong>ফোন:</strong> {user.phone}</p>
                    <p><strong>ভূমিকা:</strong> <Badge variant="secondary">{user.role}</Badge></p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-2 pt-0 border-t">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users/edit/${user.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user)}>Delete</Button>
                </CardFooter>
            </Card>
        )) : (
            <div className="text-center text-muted-foreground py-8">
                কোনো ব্যবহারকারী পাওয়া যায়নি।
            </div>
        )}
       </div>
      
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between pt-4 px-0">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
            <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </CardFooter>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the user account.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
