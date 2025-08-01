
'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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

export default function FeeCollectionsManager({ initialCollections, students, feeTypes, selectedClass, userRole }: { initialCollections: FeeCollection[], students: Student[], feeTypes: FeeType[], selectedClass: string, userRole: 'admin' | 'moderator' | 'visitor' }) {
    const [collections, setCollections] = useState(initialCollections);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const classOptions = ['all', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'];

    const filteredCollections = useMemo(() => {
        return initialCollections.filter(c =>
            c.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.roll.includes(searchTerm) ||
            c.fee_type_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [initialCollections, searchTerm]);

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
                {userRole !== 'visitor' && <AddFeeCollectionDialog students={students} feeTypes={feeTypes} />}
            </div>
            
            {/* Desktop View */}
            <div className="border rounded-md hidden md:block">
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
                            {userRole !== 'visitor' && <TableHead className="text-right">অ্যাকশন</TableHead>}
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
                                {userRole !== 'visitor' && (
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
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedCollections.map((item) => (
                    <Card key={item.id}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">{item.student_name}</CardTitle>
                        </CardHeader>
                         <CardContent className="p-4 pt-0 text-sm space-y-1">
                            <p><strong>রোল:</strong> {item.roll} - {item.class_name}</p>
                            <p><strong>ফির প্রকার:</strong> {item.fee_type_name}</p>
                            <p><strong>পরিমাণ:</strong> {item.amount_paid} টাকা</p>
                            <p><strong>মাস/বছর:</strong> {item.month ? `${item.month}, ${item.year}`: 'প্রযোজ্য নয়'}</p>
                            <p><strong>পেমেন্টের তারিখ:</strong> {new Date(item.payment_date).toLocaleDateString('bn-BD')}</p>
                        </CardContent>
                        {userRole !== 'visitor' && (
                        <CardFooter className="p-4 pt-0 flex justify-end">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm"><Trash className="mr-2 h-4 w-4" />মুছুন</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle><AlertDialogDescription>এই পেমেন্টটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">মুছে ফেলুন</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                        )}
                    </Card>
                ))}
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
