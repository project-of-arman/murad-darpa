

"use client";

import { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash, Eye, CheckCircle, XCircle } from "lucide-react";
import { getSubmissionDetails, updateSubmissionStatus, deleteSubmission } from "@/lib/actions/forms-actions";
import type { FormSubmission, FormConfig } from "@/lib/config/forms-config";
import { useToast } from "@/hooks/use-toast";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;


function ViewSubmissionDialog({ formType, submissionId }: { formType: string; submissionId: number; }) {
  const [details, setDetails] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    if (open && !details) {
      setLoading(true);
      const submissionDetails = await getSubmissionDetails(formType, submissionId);
      setDetails(submissionDetails);
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>আবেদনের বিস্তারিত</DialogTitle></DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {loading && <p>Loading...</p>}
          {details ? (
            <div className="space-y-4">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 border-b pb-2">
                  <dt className="font-semibold capitalize text-sm">{key.replace(/_/g, ' ')}</dt>
                  <dd className="col-span-2 text-sm">
                    {typeof value === 'string' && (value.startsWith('data:image') || value.startsWith('http')) ? (
                      <Image src={value} alt={key} width={100} height={100} className="rounded-md object-cover" />
                    ) : (
                      String(value ?? 'N/A')
                    )}
                  </dd>
                </div>
              ))}
            </div>
          ) : !loading && <p>No details found.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function FormsTable({ formType, submissions, config }: { formType: string; submissions: FormSubmission[]; config: FormConfig }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const primaryColumn = useMemo(() => config.columns.find(c => c.isPrimary)?.key || config.columns[0]?.key || 'id', [config]);

  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) return submissions;
    return submissions.filter(s =>
      String(s[primaryColumn] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [submissions, searchTerm, primaryColumn]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);

  const paginatedSubmissions = useMemo(() => {
    return filteredSubmissions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
  }, [filteredSubmissions, currentPage]);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteClick = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSubmission) {
      const result = await deleteSubmission(formType, selectedSubmission.id);
      if (result.success) {
        toast({ title: "আবেদন মোছা হয়েছে", description: "আবেদনটি সফলভাবে মুছে ফেলা হয়েছে।" });
        router.refresh();
      } else {
        toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
      }
      setIsDeleteDialogOpen(false);
      setSelectedSubmission(null);
    }
  };
  
   const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
        const result = await updateSubmissionStatus(formType, id, status);
        if (result.success) {
            toast({ title: "স্ট্যাটাস আপডেট হয়েছে", description: `আবেদনটি সফলভাবে ${status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'} হয়েছে।` });
            router.refresh();
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };
    
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const renderCellContent = (value: any) => {
    if (value instanceof Date) {
      return value.toLocaleDateString('bn-BD');
    }
    return value;
  }

  return (
    <>
      <div className="mb-4">
        <Input 
            placeholder={`${primaryColumn.replace(/_/g, ' ')} দিয়ে খুঁজুন...`}
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="max-w-sm"
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-[100px] text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubmissions.length > 0 ? paginatedSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                {config.columns.map(col => (
                    <TableCell key={col.key}>
                      {col.key === 'status' ? (
                          <Badge variant={getStatusVariant(submission[col.key])}>{submission[col.key]}</Badge>
                      ) : (
                        renderCellContent(submission[col.key])
                      )}
                    </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                      <ViewSubmissionDialog formType={formType} submissionId={submission.id} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-7 w-7 p-0">
                            <span className="sr-only">মেনু খুলুন</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onSelect={() => handleStatusUpdate(submission.id, 'approved')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              অনুমোদন করুন
                           </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusUpdate(submission.id, 'rejected')}>
                              <XCircle className="mr-2 h-4 w-4" />
                              প্রত্যাখ্যান করুন
                           </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleDeleteClick(submission)}
                            className="text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            মুছুন
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="text-center h-24">
                  কোনো আবেদন পাওয়া যায়নি।
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
            <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>পূর্ববর্তী</Button>
            <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>পরবর্তী</Button>
          </div>
        </CardFooter>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>এই আবেদনটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো যাবে না।</AlertDialogDescription>
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
