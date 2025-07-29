
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, Eye } from "lucide-react";
import { ContactSubmission, deleteContactSubmission } from "@/lib/contact-data";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function FeedbackTable({ submissions }: { submissions: ContactSubmission[] }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [submissions, searchTerm]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);

  const paginatedSubmissions = useMemo(() => {
    return filteredSubmissions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
  }, [filteredSubmissions, currentPage]);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteClick = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDeleteDialogOpen(true);
  };
  
  const handleViewClick = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (selectedSubmission) {
      const result = await deleteContactSubmission(selectedSubmission.id);
      if (result.success) {
        toast({ title: "বার্তা মোছা হয়েছে", description: "বার্তাটি সফলভাবে মুছে ফেলা হয়েছে।" });
        router.refresh();
      } else {
        toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
      }
      setIsDeleteDialogOpen(false);
      setSelectedSubmission(null);
    }
  };

  const ViewDialog = ({ submission }: { submission: ContactSubmission }) => (
      <Dialog open={isViewDialogOpen && selectedSubmission?.id === submission.id} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{submission.subject}</DialogTitle></DialogHeader>
            <div>
                <p><strong>নাম:</strong> {submission.name}</p>
                <p><strong>ইমেইল:</strong> {submission.email}</p>
                <p><strong>তারিখ:</strong> {new Date(submission.created_at).toLocaleString('bn-BD')}</p>
                <div className="mt-4 pt-4 border-t">
                    <p>{submission.message}</p>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )


  return (
    <>
      <div className="mb-4">
        <Input 
            placeholder="নাম, ইমেইল বা বিষয় দিয়ে খুঁজুন..."
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
              <TableHead>নাম</TableHead>
              <TableHead>ইমেইল</TableHead>
              <TableHead>বিষয়</TableHead>
              <TableHead>তারিখ</TableHead>
              <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubmissions.length > 0 ? paginatedSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.subject}</TableCell>
                <TableCell>{new Date(submission.created_at).toLocaleDateString('bn-BD')}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewClick(submission)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClick(submission)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  কোনো মতামত পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
       {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedSubmissions.length > 0 ? paginatedSubmissions.map((submission) => (
            <Card key={submission.id}>
                <CardHeader>
                    <CardTitle>{submission.subject}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>নাম:</strong> {submission.name}</p>
                    <p><strong>ইমেইল:</strong> {submission.email}</p>
                    <p><strong>তারিখ:</strong> {new Date(submission.created_at).toLocaleDateString('bn-BD')}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewClick(submission)}>বিস্তারিত দেখুন</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(submission)}>মুছুন</Button>
                </CardFooter>
            </Card>
        )) : (
            <div className="text-center text-muted-foreground py-8">
                কোনো মতামত পাওয়া যায়নি।
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
      
      {selectedSubmission && <ViewDialog submission={selectedSubmission}/>}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>এই বার্তাটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription>
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
