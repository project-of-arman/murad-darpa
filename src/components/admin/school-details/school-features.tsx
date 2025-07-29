
"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash, BookOpen } from "lucide-react";
import { SchoolFeature } from "@/lib/school-data";
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
import { saveSchoolFeature, deleteSchoolFeature } from "@/lib/school-data";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  icon: z.string().min(1, "আইকন আবশ্যক"),
  description: z.string().min(1, "বিবরণ আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

function FeatureForm({ feature, onFinished }: { feature?: SchoolFeature, onFinished: () => void }) {
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: feature?.title || "",
      icon: feature?.icon || "BookOpen",
      description: feature?.description || "",
    },
  });

  const predefinedIcons = [
    'History', 'Target', 'BookOpen', 'Award', 'Users', 'Building', 'GraduationCap', 'ShieldCheck', 'Library', 'FlaskConical', 'Computer', 'Music', 'Paintbrush', 'Map', 'Bus', 'Lightbulb'
  ];

  async function onSubmit(values: FormValues) {
    const result = await saveSchoolFeature(values, feature?.id);
    if (result.success) {
      toast({ title: "সফল!", description: `বৈশিষ্ট্য সফলভাবে ${feature ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
      onFinished();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }
  
  const IconComponent = ({ name }: { name: string }) => {
    const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
    return Icon ? <Icon className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
  };

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
                         <div className="flex items-center gap-2">
                           <IconComponent name={field.value} />
                           <span>{field.value}</span>
                         </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                        {predefinedIcons.map(iconKey => (
                            <SelectItem key={iconKey} value={iconKey}>
                               <div className="flex items-center gap-2">
                                    <IconComponent name={iconKey} />
                                    <span>{iconKey}</span>
                               </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
        {errors.icon && <p className="text-sm font-medium text-destructive">{errors.icon.message}</p>}
      </div>
      <div className="space-y-2"><Label htmlFor="description">বিবরণ</Label><Textarea id="description" {...register("description")} />{errors.description && <p className="text-sm font-medium text-destructive">{errors.description.message}</p>}</div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}</Button>
    </form>
  )
}


export default function SchoolFeatures({ features }: { features: SchoolFeature[] }) {
    const [open, setOpen] = useState(false);
    const [editItemId, setEditItemId] = useState<number | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const onFormFinished = () => {
        setOpen(false);
        setEditItemId(null);
        router.refresh();
    }
    
    const handleDelete = async (id: number) => {
        const result = await deleteSchoolFeature(id);
        if (result.success) {
            toast({ title: "সফল!", description: "বৈশিষ্ট্য সফলভাবে মোছা হয়েছে।" });
            router.refresh();
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    };
    
    const IconComponent = ({ name }: { name: string }) => {
        const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
        return Icon ? <Icon className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />;
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> নতুন বৈশিষ্ট্য যোগ করুন</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>নতুন বৈশিষ্ট্য</DialogTitle></DialogHeader>
                        <FeatureForm onFinished={onFormFinished} />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>আইকন</TableHead>
                            <TableHead>শিরোনাম</TableHead>
                            <TableHead className="text-right">অ্যাকশন</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {features.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <IconComponent name={item.icon} />
                                        <span>{item.icon}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell className="text-right">
                                     <Dialog open={editItemId === item.id} onOpenChange={(isOpen) => setEditItemId(isOpen ? item.id : null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>বৈশিষ্ট্য সম্পাদনা করুন</DialogTitle></DialogHeader>
                                            <FeatureForm feature={item} onFinished={onFormFinished} />
                                        </DialogContent>
                                    </Dialog>
                                    
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle><AlertDialogDescription>এই বৈশিষ্ট্যটি স্থায়ীভাবে মুছে ফেলা হবে।</AlertDialogDescription></AlertDialogHeader>
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
