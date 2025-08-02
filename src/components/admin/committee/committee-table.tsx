
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
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
import { MoreHorizontal, Trash, Edit, Eye } from "lucide-react";
import { CommitteeMember, deleteCommitteeMember } from "@/lib/committee-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";

const ITEMS_PER_PAGE = 10;

export default function CommitteeTable({ members }: { members: CommitteeMember[] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const userRole = useAppSelector(selectRole);

  const filteredMembers = useMemo(() => {
    return members.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const paginatedMembers = useMemo(() => {
    return filteredMembers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
  }, [filteredMembers, currentPage]);


  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleDeleteClick = (person: CommitteeMember) => {
    setSelectedMember(person);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedMember) {
      const result = await deleteCommitteeMember(selectedMember.id);
      if (result.success) {
        toast({ title: "সদস্য মোছা হয়েছে", description: `"${selectedMember.name}" সফলভাবে মুছে ফেলা হয়েছে।` });
        router.refresh();
      } else {
        toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
      }
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Input 
            placeholder="নাম বা পদবি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
        />
      </div>
      {/* Desktop View */}
      <div className="border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ছবি</TableHead>
              <TableHead>নাম</TableHead>
              <TableHead>পদবি</TableHead>
              <TableHead>অবস্থান</TableHead>
              {userRole !== 'visitor' && <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.length > 0 ? paginatedMembers.map((person) => (
              <TableRow key={person.id}>
                <TableCell>
                    <Image 
                        src={person.image || "https://placehold.co/40x40.png"}
                        alt={person.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                </TableCell>
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell>{person.role}</TableCell>
                <TableCell>{person.sort_order}</TableCell>
                {userRole !== 'visitor' && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">মেনু খুলুন</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/committee`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            দেখুন
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/committee/edit/${person.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            সম্পাদনা
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteClick(person)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          মুছুন
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={userRole !== 'visitor' ? 5 : 4} className="text-center h-24">
                  কোনো সদস্য পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedMembers.length > 0 ? paginatedMembers.map((person) => (
          <Card key={person.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Image 
                  src={person.image || "https://placehold.co/40x40.png"}
                  alt={person.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <CardTitle>{person.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>পদবি:</strong> {person.role}</p>
              <p><strong>অবস্থান:</strong> {person.sort_order}</p>
            </CardContent>
            {userRole !== 'visitor' && (
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/committee/edit/${person.id}`}>সম্পাদনা</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(person)}>মুছুন</Button>
              </CardFooter>
            )}
          </Card>
        )) : (
          <div className="text-center text-muted-foreground py-8">
            কোনো সদস্য পাওয়া যায়নি।
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between pt-4 px-0">
          <span className="text-sm text-muted-foreground">
            পৃষ্ঠা {currentPage} এর {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>পূর্ববর্তী</Button>
            <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>পরবর্তী</Button>
          </div>
        </CardFooter>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>এই সদস্যের তথ্য স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো যাবে না।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">মুছে ফেলুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
