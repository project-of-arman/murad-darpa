
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
import { ExamRoutine, deleteExamRoutine } from "@/lib/exam-routine-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function ExamRoutineTable({ routines }: { routines: ExamRoutine[] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<ExamRoutine | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const filteredRoutines = useMemo(() => {
    return routines.filter(r =>
      r.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [routines, searchTerm]);

  const totalPages = Math.ceil(filteredRoutines.length / ITEMS_PER_PAGE);

  const paginatedRoutines = useMemo(() => {
    return filteredRoutines.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
  }, [filteredRoutines, currentPage]);


  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  
  const handleDeleteClick = (routine: ExamRoutine) => {
    setSelectedRoutine(routine);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRoutine) {
      const result = await deleteExamRoutine(selectedRoutine.id);
      if (result.success) {
        toast({ title: "রুটিন মোছা হয়েছে", description: `রুটিনটি সফলভাবে মুছে ফেলা হয়েছে।` });
        router.refresh();
      } else {
        toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
      }
      setIsDeleteDialogOpen(false);
      setSelectedRoutine(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Input 
            placeholder="শ্রেণী, পরীক্ষা বা বিষয় দিয়ে খুঁজুন..."
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
              <TableHead>শ্রেণী</TableHead>
              <TableHead>পরীক্ষা</TableHead>
              <TableHead>বিষয়</TableHead>
              <TableHead>তারিখ</TableHead>
              <TableHead>সময়</TableHead>
              <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoutines.length > 0 ? paginatedRoutines.map((routine) => (
              <TableRow key={routine.id}>
                <TableCell>{routine.class_name}</TableCell>
                <TableCell>{routine.exam_name}</TableCell>
                <TableCell>{routine.subject}</TableCell>
                <TableCell>{new Date(routine.exam_date).toLocaleDateString('bn-BD')}</TableCell>
                <TableCell>{routine.start_time.substring(0,5)} - {routine.end_time.substring(0,5)}</TableCell>
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
                        <Link href={`/admin/exam-routine/edit/${routine.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          সম্পাদনা
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteClick(routine)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        মুছুন
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  কোনো রুটিন পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
       {/* Mobile View */}
       <div className="md:hidden space-y-4">
        {paginatedRoutines.length > 0 ? paginatedRoutines.map((routine) => (
            <Card key={routine.id}>
                <CardHeader>
                    <CardTitle>{routine.subject}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>শ্রেণী:</strong> {routine.class_name}</p>
                    <p><strong>পরীক্ষা:</strong> {routine.exam_name}</p>
                    <p><strong>তারিখ:</strong> {new Date(routine.exam_date).toLocaleDateString('bn-BD')}</p>
                    <p><strong>সময়:</strong> {routine.start_time.substring(0,5)} - {routine.end_time.substring(0,5)}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/exam-routine/edit/${routine.id}`}>সম্পাদনা</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(routine)}>মুছুন</Button>
                </CardFooter>
            </Card>
        )) : (
            <div className="text-center text-muted-foreground py-8">
                 কোনো রুটিন পাওয়া যায়নি।
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
            <AlertDialogDescription>এই রুটিনটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription>
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

