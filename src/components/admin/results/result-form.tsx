
"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Student } from "@/lib/student-data";
import { Result, SubjectGrade, saveResult } from "@/lib/actions/results-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

const subjectGradeSchema = z.object({
  subject_name: z.string().min(1, 'আবশ্যক'),
  marks: z.string().optional(),
  grade: z.string().min(1, 'আবশ্যক'),
  gpa: z.string().min(1, 'আবশ্যক'),
});

const resultFormSchema = z.object({
  student_id: z.coerce.number({invalid_type_error: "শিক্ষার্থী আবশ্যক"}).min(1, "শিক্ষার্থী আবশ্যক"),
  exam_name: z.string().min(1, "পরীক্ষার নাম আবশ্যক"),
  year: z.coerce.number().min(2000, "বছর আবশ্যক"),
  final_gpa: z.string().min(1, "চূড়ান্ত GPA আবশ্যক"),
  status: z.enum(['Promoted', 'Failed']),
  subjects: z.array(subjectGradeSchema).min(1, "কমপক্ষে একটি বিষয় যোগ করুন।"),
});

type FormValues = z.infer<typeof resultFormSchema>;

type ResultFormProps = {
    students: Student[];
    result?: (Result & { subjects: SubjectGrade[] }) | null;
}

export function ResultForm({ students, result }: ResultFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    
    const { register, handleSubmit, control, formState: { errors, isSubmitting, isValid } } = useForm<FormValues>({
        resolver: zodResolver(resultFormSchema),
        defaultValues: {
            student_id: result?.student_id || undefined,
            exam_name: result?.exam_name || "",
            year: result?.year || new Date().getFullYear(),
            final_gpa: result?.final_gpa || "",
            status: result?.status || 'Promoted',
            subjects: result?.subjects.map(s => ({...s})) || [],
        },
        mode: 'onChange' // Validate on change to enable button
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subjects",
    });

  async function onSubmit(values: FormValues) {
    const apiResult = await saveResult(values, result?.id);

    if (apiResult.success) {
        toast({ title: "সফল!", description: `ফলাফল সফলভাবে ${result ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
        router.push('/admin/results');
        router.refresh();
    } else {
        toast({ title: "ত্রুটি", description: apiResult.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader><CardTitle>সাধারণ তথ্য</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>শিক্ষার্থী</Label>
                    <Controller
                        name="student_id"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={!!result}>
                                <SelectTrigger>
                                <SelectValue placeholder="শিক্ষার্থী নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                {students.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name} (রোল: {s.roll})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.student_id && <p className="text-sm font-medium text-destructive">{errors.student_id.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="exam_name">পরীক্ষার নাম</Label>
                    <Input id="exam_name" placeholder="যেমন: বার্ষিক পরীক্ষা" {...register("exam_name")} />
                    {errors.exam_name && <p className="text-sm font-medium text-destructive">{errors.exam_name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="year">বছর</Label>
                    <Input id="year" type="number" {...register("year")} />
                    {errors.year && <p className="text-sm font-medium text-destructive">{errors.year.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="final_gpa">চূড়ান্ত GPA</Label>
                    <Input id="final_gpa" {...register("final_gpa")} />
                    {errors.final_gpa && <p className="text-sm font-medium text-destructive">{errors.final_gpa.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>স্ট্যাটাস</Label>
                     <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Promoted">Promoted</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.status && <p className="text-sm font-medium text-destructive">{errors.status.message}</p>}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>বিষয়ভিত্তিক গ্রেড</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-4 items-center font-medium">
                    <Label className="col-span-2">বিষয়ের নাম</Label>
                    <Label>মার্ক</Label>
                    <Label>গ্রেড</Label>
                    <Label>GPA</Label>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-5 gap-4 items-start">
                        <Input {...register(`subjects.${index}.subject_name`)} placeholder="বিষয়" className="col-span-2" />
                        <Input {...register(`subjects.${index}.marks`)} placeholder="মার্ক" />
                        <Input {...register(`subjects.${index}.grade`)} placeholder="গ্রেড" />
                        <div className="flex items-center gap-2">
                           <Input {...register(`subjects.${index}.gpa`)} placeholder="GPA" />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                 {errors.subjects && <p className="text-sm font-medium text-destructive">{errors.subjects.message}</p>}
                 <Button type="button" variant="outline" onClick={() => append({ subject_name: '', marks: '', grade: '', gpa: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> বিষয় যোগ করুন
                </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>বাতিল করুন</Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
            </Button>
        </div>
    </form>
  )
}
