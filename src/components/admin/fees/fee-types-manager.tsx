
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FeeType, saveFeeType, deleteFeeType } from "@/app/admin/fees/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const formSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  default_amount: z.coerce.number().min(0, "ডিফল্ট পরিমাণ আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

function FeeTypeForm({ feeType, onFinished }: { feeType?: FeeType, onFinished: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: feeType?.name || "",
      default_amount: feeType?.default_amount || 0,
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    const result = await saveFeeType(formData, feeType?.id);
    if (result.success) {
      toast({ title: "সফল!", description: `ফির প্রকার সফলভাবে ${feeType ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
      onFinished();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="name">নাম</Label><Input id="name" {...register("name")} />{errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="default_amount">ডিফল্ট পরিমাণ (টাকা)</Label><Input id="default_amount" type="number" step="0.01" {...register("default_amount")} />{errors.default_amount && <p className="text-sm font-medium text-destructive">{errors.default_amount.message}</p>}</div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="secondary">বাতিল</Button></DialogClose>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}</Button>
      </DialogFooter>
    </form>
  )
}

export default function FeeTypesManager({ initialFeeTypes }: { initialFeeTypes: FeeType[] }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState<number | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const onFormFinished = () => {
        setOpen(false);
        setEditOpen(null);
        router.refresh();
    }
    
     const handleDelete = async (id: number) => {
        const result = await deleteFeeType(id);
        if (result.success) {
            toast({ title: "সফল!", description: "ফির প্রকার সফলভাবে মোছা হয়েছে।" });
            router.refresh();
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন প্রকার যোগ করুন</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader><DialogTitle>নতুন ফির প্রকার</DialogTitle></DialogHeader>
                        <FeeTypeForm onFinished={onFormFinished} />
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>নাম</TableHead>
                            <TableHead>ডিফল্ট পরিমাণ</TableHead>
                            <TableHead className="text-right">অ্যাকশন</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialFeeTypes.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.default_amount}</TableCell>
                                <TableCell className="text-right">
                                     <Dialog open={editOpen === item.id} onOpenChange={(isOpen) => setEditOpen(isOpen ? item.id : null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader><DialogTitle>ফির প্রকার সম্পাদনা</DialogTitle></DialogHeader>
                                            <FeeTypeForm feeType={item} onFinished={onFormFinished} />
                                        </DialogContent>
                                    </Dialog>
                                    
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle><AlertDialogDescription>এই প্রকারটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">মুছুন</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

