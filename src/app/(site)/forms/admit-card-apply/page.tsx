
"use client";

import { useForm, Controller } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, FileText } from 'lucide-react';
import { saveAdmitCardApplication } from "./actions";
import { useEffect, useMemo, useState } from "react";
import { ExamRoutine, getExamRoutines } from "@/lib/exam-routine-data";
import PrintableAdmitCard from "@/components/forms/printable-admit-card";

const formSchema = z.object({
  studentName: z.string().min(1, "শিক্ষার্থীর নাম আবশ্যক"),
  fatherName: z.string().min(1, "পিতার নাম আবশ্যক"),
  motherName: z.string().min(1, "মাতার নাম আবশ্যক"),
  village: z.string().min(1, "গ্রামের নাম আবশ্যক"),
  className: z.string().min(1, "শ্রেণী আবশ্যক"),
  rollNo: z.string().min(1, "রোল নম্বর আবশ্যক"),
  session: z.string().min(1, "সেশন আবশ্যক"),
  examName: z.string().min(1, "পরীক্ষার নাম আবশ্যক"),
  mobile: z.string().min(1, "যোগাযোগের মোবাইল নম্বর আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdmitCardApplyPage() {
  const { toast } = useToast();
  const [allRoutines, setAllRoutines] = useState<ExamRoutine[]>([]);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const selectedClass = watch("className");
  
  useEffect(() => {
    async function fetchRoutines() {
      const data = await getExamRoutines();
      setAllRoutines(data);
    }
    fetchRoutines();
  }, []);

  const availableExams = useMemo(() => {
    if (!selectedClass || !allRoutines) return [];
    const examsForClass = allRoutines.filter(r => r.class_name === selectedClass);
    return [...new Set(examsForClass.map(r => r.exam_name))];
  }, [selectedClass, allRoutines]);
  
  const selectedRoutineForPreview = useMemo(() => {
      if (!submittedData) return [];
      return allRoutines.filter(r => r.class_name === submittedData.className && r.exam_name === submittedData.examName);
  }, [submittedData, allRoutines]);

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await saveAdmitCardApplication(formData);

    if (result.success && result.data) {
      toast({
        title: "আবেদন সফল হয়েছে",
        description: "আপনার প্রবেশপত্রের আবেদন সফলভাবে জমা দেওয়া হয়েছে।",
      });
      setSubmittedData(result.data);
      reset();
    } else {
      toast({
        title: "ত্রুটি",
        description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।",
        variant: "destructive",
      });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  if (submittedData) {
      return (
          <PrintableAdmitCard 
            data={submittedData} 
            routine={selectedRoutineForPreview}
            onBack={() => setSubmittedData(null)}
          />
      );
  }

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">পরীক্ষার প্রবেশপত্রের জন্য আবেদন</h1>
          <p className="text-muted-foreground mt-2">সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><FileText /> আবেদনের তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem><Label htmlFor="studentName">শিক্ষার্থীর নাম</Label><Input id="studentName" {...register("studentName")} /><FormMessage name="studentName" /></FormItem>
                <FormItem><Label htmlFor="fatherName">পিতার নাম</Label><Input id="fatherName" {...register("fatherName")} /><FormMessage name="fatherName" /></FormItem>
                <FormItem><Label htmlFor="motherName">মাতার নাম</Label><Input id="motherName" {...register("motherName")} /><FormMessage name="motherName" /></FormItem>
                <FormItem><Label htmlFor="village">গ্রাম</Label><Input id="village" {...register("village")} /><FormMessage name="village" /></FormItem>
                <FormItem>
                  <Label htmlFor="className">শ্রেণী</Label>
                  <Controller name="className" control={control} render={({ field }) => (
                     <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="শ্রেণী নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="৬ষ্ঠ শ্রেণী">৬ষ্ঠ শ্রেণী</SelectItem>
                          <SelectItem value="৭ম শ্রেণী">৭ম শ্রেণী</SelectItem>
                          <SelectItem value="৮ম শ্রেণী">৮ম শ্রেণী</SelectItem>
                          <SelectItem value="৯ম শ্রেণী">৯ম শ্রেণী</SelectItem>
                          <SelectItem value="১০ম শ্রেণী">১০ম শ্রেণী</SelectItem>
                        </SelectContent>
                      </Select>
                  )} />
                 <FormMessage name="className" />
                </FormItem>
                <FormItem><Label htmlFor="rollNo">রোল নম্বর</Label><Input id="rollNo" {...register("rollNo")} /><FormMessage name="rollNo" /></FormItem>
                <FormItem><Label htmlFor="session">সেশন</Label><Input id="session" {...register("session")} /><FormMessage name="session" /></FormItem>
                
                <FormItem>
                    <Label htmlFor="examName">পরীক্ষার নাম</Label>
                     <Controller name="examName" control={control} render={({ field }) => (
                         <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClass || availableExams.length === 0}>
                            <SelectTrigger><SelectValue placeholder="পরীক্ষা নির্বাচন করুন" /></SelectTrigger>
                            <SelectContent>
                                {availableExams.map(exam => (
                                    <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )} />
                    {errors.examName && <p className="text-sm font-medium text-destructive">{errors.examName.message}</p>}
                </FormItem>

                <FormItem className="md:col-span-2"><Label htmlFor="mobile">যোগাযোগের মোবাইল নম্বর</Label><Input id="mobile" {...register("mobile")} /><p className="text-xs text-muted-foreground mt-1">আপনার সঠিক মোবাইল নম্বর টি দিন আমাদের পক্ষ থেকে আপনার সাথে যোগাযোগ করা হবে</p><FormMessage name="mobile" /></FormItem>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
}
