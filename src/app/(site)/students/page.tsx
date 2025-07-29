
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStudents, Student } from '@/lib/student-data';

const STUDENTS_PER_PAGE = 5;

export default function StudentsPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [classFilter, setClassFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
        setLoading(true);
        const students = await getStudents();
        setAllStudents(students);
        setLoading(false);
    }
    fetchStudents();
  }, []);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(allStudents.map(s => s.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => 
      (classFilter === "all" || student.class_name === classFilter) &&
      (genderFilter === "all" || student.gender === genderFilter) &&
      (yearFilter === "all" || student.year.toString() === yearFilter) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [classFilter, genderFilter, yearFilter, searchTerm, allStudents]);

  const totalPages = Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + STUDENTS_PER_PAGE);
  }, [currentPage, filteredStudents]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [classFilter, genderFilter, yearFilter, searchTerm]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">আমাদের শিক্ষার্থী</h1>
          <p className="text-muted-foreground mt-2">প্রতিষ্ঠানের সকল শিক্ষার্থীদের তালিকা</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>ফিল্টার</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <Input 
                placeholder="নাম দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সকল শ্রেণী</SelectItem>
                  <SelectItem value="১০ম">১০ম শ্রেণী</SelectItem>
                  <SelectItem value="৯ম">৯ম শ্রেণী</SelectItem>
                  <SelectItem value="৮ম">৮ম শ্রেণী</SelectItem>
                  <SelectItem value="৭ম">৭ম শ্রেণী</SelectItem>
                  <SelectItem value="৬ষ্ঠ">৬ষ্ঠ শ্রেণী</SelectItem>
                </SelectContent>
              </Select>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সকল</SelectItem>
                  <SelectItem value="ছেলে">ছেলে</SelectItem>
                  <SelectItem value="মেয়ে">মেয়ে</SelectItem>
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="বছর নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সকল বছর</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>রোল নং</TableHead>
                  <TableHead>নাম</TableHead>
                  <TableHead>শ্রেণী</TableHead>
                  <TableHead>লিঙ্গ</TableHead>
                  <TableHead>বছর</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            লোড হচ্ছে...
                        </TableCell>
                    </TableRow>
                ) : paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.roll}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.class_name}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell>
                        <Button asChild variant="link">
                            <Link href={`/students/${student.roll}`}>বিস্তারিত</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      কোনো শিক্ষার্থী পাওয়া যায়নি।
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="flex items-center justify-between pt-4">
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
        </Card>
      </div>
    </div>
  );
}
