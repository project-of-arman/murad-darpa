
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { Routine, deleteRoutine } from "@/lib/routine-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { CardFooter } from "@/components/ui/card";

const ITEMS_PER_PAGE = 10;
const classes = ["all", "৬ষ্ঠ শ্রেণী", "৭ম শ্রেণী", "৮ম শ্রেণী", "৯ম শ্রেণী", "১০ম শ্রেণী"];
const days = ["all", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];

export default function RoutineTable({ routines }: { routines: Routine[] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [classFilter, setClassFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const { toast } = useToast();

  const filteredRoutines = useMemo(() => {
    return routines.filter(
      (r) =>
        (classFilter === "all" || r.class_name === classFilter) &&
        (dayFilter === "all" || r.day_of_week === dayFilter)
    );
  }, [routines, classFilter, dayFilter]);
  
  const totalPages = Math.ceil(filteredRoutines.length / ITEMS_PER_PAGE);

  const paginatedRoutines = filteredRoutines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleFilterChange = () => {
    setCurrentPage(1);
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteClick = (routine: Routine) => {
    setSelectedRoutine(routine);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRoutine) {
      const result = await deleteRoutine(selectedRoutine.id);
      if (result.success) {
        toast({
          title: "পিরিয়ড মোছা হয়েছে",
          description: "পিরিয়ডটি সফলভাবে মুছে ফেলা হয়েছে।",
        });
      } else {
        toast({
          title: "ত্রুটি",
          description: result.error,
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
      setSelectedRoutine(null);
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
          <Select value={classFilter} onValueChange={value => { setClassFilter(value); handleFilterChange(); }}>
                <SelectTrigger>
                  <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'সকল শ্রেণী' : c}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select value={dayFilter} onValueChange={value => { setDayFilter(value); handleFilterChange(); }}>
                <SelectTrigger>
                  <SelectValue placeholder="দিন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(d => <SelectItem key={d} value={d}>{d === 'all' ? 'সকল দিন' : d}</SelectItem>)}
                </SelectContent>
            </Select>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>শ্রেণী</TableHead>
              <TableHead>দিন</TableHead>
              <TableHead>পিরিয়ড</TableHead>
              <TableHead>বিষয়</TableHead>
              <TableHead>শিক্ষক</TableHead>
              <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoutines.length > 0 ? paginatedRoutines.map((routine) => (
              <TableRow key={routine.id}>
                <TableCell>{routine.class_name}</TableCell>
                <TableCell>{routine.day_of_week}</TableCell>
                <TableCell>{routine.period}</TableCell>
                <TableCell>{routine.subject}</TableCell>
                <TableCell>{routine.teacher_name}</TableCell>
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
                        <Link href={`/admin/routine/edit/${routine.id}`}>
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
      
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between pt-4 px-0">
          <span className="text-sm text-muted-foreground">
            পৃষ্ঠা {currentPage} এর {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              size="sm"
            >
              পূর্ববর্তী
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              size="sm"
            >
              পরবর্তী
            </Button>
          </div>
        </CardFooter>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই পিরিয়ডটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো
              যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
