
"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { ImportantDate } from "@/lib/admission-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { saveImportantDate, deleteImportantDate } from "@/lib/actions/admission-guidelines-actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const formSchema = z.object({
  label: z.string().min(1, "লেবেল আবশ্যক"),
  date_value: z.string().min(1, "তারিখ আবশ্যক"),
  sort_order: z.coerce.number().int(),
});

type FormValues = z.infer<typeof formSchema>;

function DateForm({ date, onFinished }: { date?: ImportantDate, onFinished: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: date?.label || "",
      date_value: date?.date_value || "",
      sort_order: date?.sort_order || 0,
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    const result = await saveImportantDate(formData, date?.id);
    if (result.success) {
      toast({ title: "সফল!", description: `তারিখ সফলভাবে ${date ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
      onFinished();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="label">লেবেল</Label><Input id="label" {...register("label")} />{errors.label && <p className="text-sm font-medium text-destructive">{errors.label.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="date_value">তারিখ</Label><Input id="date_value" {...register("date_value")} />{errors.date_value && <p className="text-sm font-medium text-destructive">{errors.date_value.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="sort_order">অবস্থান (Sort Order)</Label><Input id="sort_order" type="number" {...register("sort_order")} />{errors.sort_order && <p className="text-sm font-medium text-destructive">{errors.sort_order.message}</p>}</div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}</Button>
    </form>
  )
}


export default function ImportantDates({ dates }: { dates: ImportantDate[] }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const onFormFinished = () => {
        setOpen(false);
        router.refresh();
    }
    
     const handleDelete = async (id: number) => {
        const result = await deleteImportantDate(id);
        if (result.success) {
            toast({ title: "সফল!", description: "তারিখ সফলভাবে মোছা হয়েছে।" });
            router.refresh();
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };
    const { toast } = useToast();

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন তারিখ যোগ করুন</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>নতুন তারিখ যোগ করুন</DialogTitle></DialogHeader>
                        <DateForm onFinished={onFormFinished} />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>লেবেল</TableHead>
                            <TableHead>তারিখ</TableHead>
                            <TableHead>অবস্থান</TableHead>
                            <TableHead className="text-right">অ্যাকশন</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dates.map((date) => (
                            <TableRow key={date.id}>
                                <TableCell>{date.label}</TableCell>
                                <TableCell>{date.date_value}</TableCell>
                                <TableCell>{date.sort_order}</TableCell>
                                <TableCell className="text-right">
                                     <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>তারিখ সম্পাদনা করুন</DialogTitle></DialogHeader>
                                            <DateForm date={date} onFinished={() => {
                                                const closeButton = document.querySelector('[aria-label="Close"]');
                                                if(closeButton instanceof HTMLElement) closeButton.click();
                                                router.refresh();
                                            }} />
                                        </DialogContent>
                                    </Dialog>
                                    
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle><AlertDialogDescription>এই তারিখটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(date.id)} className="bg-destructive hover:bg-destructive/90">মুছুন</AlertDialogAction>
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

