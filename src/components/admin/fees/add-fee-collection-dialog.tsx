
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { saveFeeCollection, FeeType } from "@/app/admin/fees/actions";
import { Student } from "@/lib/student-data";
import { PlusCircle } from "lucide-react";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const formSchema = z.object({
  student_id: z.string().min(1, "শিক্ষার্থী আবশ্যক"),
  fee_type_id: z.string().min(1, "ফির প্রকার আবশ্যক"),
  amount_paid: z.coerce.number().min(0.01, "পরিমাণ আবশ্যক"),
  payment_date: z.string().min(1, "পেমেন্টের তারিখ আবশ্যক"),
  month: z.string().optional(),
  year: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddFeeCollectionDialog({ students, feeTypes }: { students: Student[], feeTypes: FeeType[] }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        payment_date: new Date().toISOString().split('T')[0],
        year: currentYear.toString(),
    }
  });

  const selectedFeeTypeId = watch('fee_type_id');

  const onFeeTypeChange = (feeTypeId: string) => {
    setValue('fee_type_id', feeTypeId);
    const selectedFee = feeTypes.find(ft => ft.id.toString() === feeTypeId);
    if (selectedFee) {
        setValue('amount_paid', selectedFee.default_amount);
    }
  };

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value?.toString() || "");
    });
    
    const result = await saveFeeCollection(formData);
    if (result.success) {
      toast({ title: "সফল!", description: "পেমেন্ট সফলভাবে যোগ করা হয়েছে।" });
      setOpen(false);
      router.refresh();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4"/> নতুন পেমেন্ট</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>নতুন পেমেন্ট যোগ করুন</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>শিক্ষার্থী</Label>
                <Controller name="student_id" control={control} render={({field}) => (
                     <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="শিক্ষার্থী নির্বাচন করুন"/></SelectTrigger>
                        <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name} (রোল: {s.roll})</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.student_id && <p className="text-sm font-medium text-destructive">{errors.student_id.message}</p>}
            </div>
             <div className="space-y-2">
                <Label>ফির প্রকার</Label>
                 <Controller name="fee_type_id" control={control} render={({field}) => (
                    <Select onValueChange={onFeeTypeChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="ফির প্রকার নির্বাচন করুন"/></SelectTrigger>
                        <SelectContent>{feeTypes.map(ft => <SelectItem key={ft.id} value={ft.id.toString()}>{ft.name}</SelectItem>)}</SelectContent>
                    </Select>
                 )} />
                {errors.fee_type_id && <p className="text-sm font-medium text-destructive">{errors.fee_type_id.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="amount_paid">টাকার পরিমাণ</Label>
                <Input id="amount_paid" type="number" step="0.01" {...register("amount_paid")} />
                {errors.amount_paid && <p className="text-sm font-medium text-destructive">{errors.amount_paid.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="payment_date">পেমেন্টের তারিখ</Label>
                <Input id="payment_date" type="date" {...register("payment_date")} />
                {errors.payment_date && <p className="text-sm font-medium text-destructive">{errors.payment_date.message}</p>}
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>মাস (ঐচ্ছিক)</Label>
                    <Controller name="month" control={control} render={({field}) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="মাস"/></SelectTrigger>
                            <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label>বছর (ঐচ্ছিক)</Label>
                    <Controller name="year" control={control} render={({field}) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="বছর"/></SelectTrigger>
                            <SelectContent>{years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    )} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">বাতিল</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
