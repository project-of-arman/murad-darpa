
'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { FeeCollection, FeeType } from "@/app/admin/fees/actions";
import { deleteFeeCollection } from "@/app/admin/fees/actions";
import { Student } from '@/lib/student-data';
import AddFeeCollectionDialog from './add-fee-collection-dialog';

const ITEMS_PER_PAGE = 10;

export default function FeeCollectionsManager({ initialCollections, students, feeTypes, selectedClass }: { initialCollections: FeeCollection[], students: Student[], feeTypes: FeeType[], selectedClass: string }) {
    const [collections, setCollections] = useState(initialCollections);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const classOptions = ['all', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'];

    const filteredCollections = useMemo(() => {
        return collections.filter(c =>
            c.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.roll.includes(searchTerm) ||
            c.fee_type_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [collections, searchTerm]);

    const paginatedCollections = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCollections.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCollections, currentPage]);

    const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);

    const handleClassChange = (className: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (className === 'all') {
            params.delete('class');
        } else {
            params.set('class', className);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleDelete = async (id: number) => {
        const result = await deleteFeeCollection(id);
        if (result.success) {
            toast({ title: "সফল!", description: "পেমেন্ট সফলভাবে মোছা হয়েছে।" });
            router.refresh(); // This will re-fetch data on the server and update the component
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                     <Input 
                        placeholder="শিক্ষার্থী বা ফি দিয়ে খুঁজুন..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-xs"
                    />
                    <Select value={selectedClass} onValueChange={handleClassChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="শ্রেণী নির্বাচন" />
                        </SelectTrigger>
                        <SelectContent>
                            {classOptions.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'সকল শ্রেণী' : c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <AddFeeCollectionDialog students={students} feeTypes={feeTypes} />
            </div>
            
             <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>শিক্ষার্থীর নাম</TableHead>
                            <TableHead>রোল</TableHead>
                            <TableHead>শ্রেণী</TableHead>
                            <TableHead>ফির প্রকার</TableHead>
                            <TableHead>পরিমাণ</TableHead>
                            <TableHead>মাস/বছর</TableHead>
                            <TableHead>পেমেন্টের তারিখ</TableHead>
                            <TableHead className="text-right">অ্যাকশন</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCollections.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.student_name}</TableCell>
                                <TableCell>{item.roll}</TableCell>
                                <TableCell>{item.class_name}</TableCell>
                                <TableCell>{item.fee_type_name}</TableCell>
                                <TableCell>{item.amount_paid}</TableCell>
                                <TableCell>{item.month ? `${item.month}, ${item.year}`: 'N/A'}</TableCell>
                                <TableCell>{new Date(item.payment_date).toLocaleDateString('bn-BD')}</TableCell>
                                <TableCell className="text-right">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle><AlertDialogDescription>এই পেমেন্টটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">মুছে ফেলুন</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        পূর্ববর্তী
                    </Button>
                    <span className="text-sm">পৃষ্ঠা {currentPage} এর {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        পরবর্তী
                    </Button>
                </div>
            )}
        </div>
    );
}

