
"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { AdmissionGuideline } from "@/lib/admission-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { saveGuideline, deleteGuideline } from "@/lib/actions/admission-guidelines-actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import RichTextEditor from '@/components/admin/pages/rich-text-editor';
import * as LucideIcons from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const iconNames = Object.keys(LucideIcons).filter(k => typeof LucideIcons[k as keyof typeof LucideIcons] === 'object');

const educationIcons = [
    { value: 'UserCheck', label: 'যোগ্যতা' },
    { value: 'FileSignature', label: 'আবেদন' },
    { value: 'ListChecks', label: 'কাগজপত্র' },
    { value: 'Pencil', label: 'পরীক্ষা' },
    { value: 'Banknote', label: 'ফি/বেতন' },
    { value: 'BookOpen', label: 'বই' },
    { value: 'Calendar', label: 'তারিখ' },
    { value: 'Award', label: 'পুরস্কার' },
    { value: 'GraduationCap', label: 'শিক্ষা' },
];


const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  icon: z.string().optional(),
  content: z.string().optional(),
  sort_order: z.coerce.number().int(),
});

type FormValues = z.infer<typeof formSchema>;

function GuidelineForm({ guideline, onFinished }: { guideline?: AdmissionGuideline, onFinished: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: guideline?.title || "",
      icon: guideline?.icon || "FileText",
      content: guideline?.content || "",
      sort_order: guideline?.sort_order || 0,
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value?.toString() || "");
    });
    
    const result = await saveGuideline(formData, guideline?.id);
    if (result.success) {
      toast({ title: "সফল!", description: `নির্দেশনা সফলভাবে ${guideline ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
      onFinished();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="title">শিরোনাম</Label><Input id="title" {...register("title")} />{errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}</div>
      <div className="space-y-2">
        <Label htmlFor="icon">আইকন</Label>
        <Controller
            name="icon"
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="আইকন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        {educationIcons.map(icon => {
                            const IconComponent = LucideIcons[icon.value as keyof typeof LucideIcons] as React.ElementType;
                            return (
                                <SelectItem key={icon.value} value={icon.value}>
                                   <div className="flex items-center gap-2">
                                        {IconComponent && <IconComponent className="h-4 w-4" />}
                                        <span>{icon.label} ({icon.value})</span>
                                   </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            )}
        />
        {errors.icon && <p className="text-sm font-medium text-destructive">{errors.icon.message}</p>}
      </div>
      <div className="space-y-2"><Label htmlFor="content">বিবরণ</Label><Controller name="content" control={control} render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} />}/>{errors.content && <p className="text-sm font-medium text-destructive">{errors.content.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="sort_order">অবস্থান (Sort Order)</Label><Input id="sort_order" type="number" {...register("sort_order")} />{errors.sort_order && <p className="text-sm font-medium text-destructive">{errors.sort_order.message}</p>}</div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}</Button>
    </form>
  )
}


export default function Guidelines({ guidelines }: { guidelines: AdmissionGuideline[] }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState<number | null>(null);
    const router = useRouter();

    const onFormFinished = () => {
        setOpen(false);
        setEditOpen(null);
        router.refresh();
    }
    
     const handleDelete = async (id: number) => {
        const result = await deleteGuideline(id);
        if (result.success) {
            toast({ title: "সফল!", description: "নির্দেশনা সফলভাবে মোছা হয়েছে।" });
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
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন নির্দেশনা যোগ করুন</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader><DialogTitle>নতুন নির্দেশনা যোগ করুন</DialogTitle></DialogHeader>
                        <GuidelineForm onFinished={onFormFinished} />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>শিরোনাম</TableHead>
                            <TableHead>আইকন</TableHead>
                            <TableHead>অবস্থান</TableHead>
                            <TableHead className="text-right">অ্যাকশন</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {guidelines.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.icon}</TableCell>
                                <TableCell>{item.sort_order}</TableCell>
                                <TableCell className="text-right">
                                     <Dialog open={editOpen === item.id} onOpenChange={(isOpen) => setEditOpen(isOpen ? item.id : null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[625px]">
                                            <DialogHeader><DialogTitle>নির্দেশনা সম্পাদনা করুন</DialogTitle></DialogHeader>
                                            <GuidelineForm guideline={item} onFinished={onFormFinished} />
                                        </DialogContent>
                                    </Dialog>
                                    
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle><AlertDialogDescription>এই নির্দেশনাটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription></AlertDialogHeader>
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
