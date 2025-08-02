
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
import { MoreHorizontal, Trash, Edit, Eye, PlusCircle } from "lucide-react";
import { StudentForAdmin, deleteStudent } from "@/lib/student-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toDataURL } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectRole } from "@/lib/redux/slices/user-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const STUDENTS_PER_PAGE = 10;

export const HeaderActions = () => {
    const userRole = useAppSelector(selectRole);
    if (userRole === 'visitor') return null;
    
    return (
         <Button asChild>
            <Link href="/admin/students/new">
              <PlusCircle className="mx-2 h-4 w-4" />
              <span className="hidden sm:flex">নতুন শিক্ষার্থী যোগ করুন</span>
            </Link>
          </Button>
    )
}


function StudentTable({ students }: { students: StudentForAdmin[]}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentForAdmin | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const { toast } = useToast();
  const userRole = useAppSelector(selectRole);


  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      (student.name_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (classFilter === "all" || student.class_name === classFilter)
    );
  }, [students, searchTerm, classFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, classFilter]);

  const totalPages = Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);

  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(
        (currentPage - 1) * STUDENTS_PER_PAGE,
        currentPage * STUDENTS_PER_PAGE
    );
  }, [filteredStudents, currentPage]);


  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteClick = (student: StudentForAdmin) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedStudent) {
      const result = await deleteStudent(selectedStudent.id);
      if (result.success) {
        toast({
          title: "শিক্ষার্থী মোছা হয়েছে",
          description: `"${selectedStudent.name_bn}" সফলভাবে মুছে ফেলা হয়েছে।`,
        });
      } else {
        toast({
          title: "ত্রুটি",
          description: result.error,
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <Input 
            placeholder="নাম বা রোল দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
        />
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সকল শ্রেণী</SelectItem>
            <SelectItem value="৬ষ্ঠ">৬ষ্ঠ</SelectItem>
            <SelectItem value="৭ম">৭ম</SelectItem>
            <SelectItem value="৮ম">৮ম</SelectItem>
            <SelectItem value="৯ম">৯ম</SelectItem>
            <SelectItem value="১০ম">১০ম</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Desktop View */}
      <div className="border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ছবি</TableHead>
              <TableHead>নাম</TableHead>
              <TableHead>রোল</TableHead>
              <TableHead>শ্রেণী</TableHead>
              <TableHead>বছর</TableHead>
              {userRole !== 'visitor' && <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? paginatedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                    <Image 
                        src={student.image ? toDataURL(student.image as Buffer) : "https://placehold.co/40x40.png"}
                        alt={student.name_bn}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                </TableCell>
                <TableCell className="font-medium">{student.name_bn}</TableCell>
                <TableCell>{student.roll}</TableCell>
                <TableCell>{student.class_name}</TableCell>
                <TableCell>{student.year}</TableCell>
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
                          <Link href={`/students/${student.roll}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            দেখুন
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/students/edit/${student.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            সম্পাদনা
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteClick(student)}
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
                <TableCell colSpan={userRole !== 'visitor' ? 6 : 5} className="text-center h-24">
                  কোনো শিক্ষার্থী পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedStudents.length > 0 ? paginatedStudents.map((student) => (
          <Card key={student.id}>
             <CardHeader>
              <div className="flex items-center gap-4">
                <Image 
                  src={student.image ? toDataURL(student.image as Buffer) : "https://placehold.co/40x40.png"}
                  alt={student.name_bn}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <CardTitle>{student.name_bn}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p><strong>রোল:</strong> {student.roll}</p>
              <p><strong>শ্রেণী:</strong> {student.class_name}</p>
              <p><strong>বছর:</strong> {student.year}</p>
            </CardContent>
             <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" asChild>
                  <Link href={`/students/${student.roll}`} target="_blank">দেখুন</Link>
              </Button>
              {userRole !== 'visitor' && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/students/edit/${student.id}`}>সম্পাদনা</Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(student)}>মুছুন</Button>
                </>
              )}
            </CardFooter>
          </Card>
        )) : (
          <div className="text-center text-muted-foreground py-8">
            কোনো শিক্ষার্থী পাওয়া যায়নি।
          </div>
        )}
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
            >
              পূর্ববর্তী
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
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
              এই শিক্ষার্থীর তথ্য স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো
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

export default StudentTable;
