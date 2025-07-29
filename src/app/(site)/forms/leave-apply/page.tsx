
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, FileText } from 'lucide-react';
import { saveLeaveApplication } from "./actions";

const formSchema = z.object({
  studentName: z.string().min(1, "শিক্ষার্থীর নাম আবশ্যক"),
  className: z.string().min(1, "শ্রেণী আবশ্যক"),
  rollNo: z.string().min(1, "রোল নম্বর আবশ্যক"),
  guardianName: z.string().min(1, "অভিভাবকের নাম আবশ্যক"),
  mobile: z.string().min(1, "যোগাযোগের মোবাইল নম্বর আবশ্যক"),
  startDate: z.string().min(1, "ছুটির শুরুর তারিখ আবশ্যক"),
  endDate: z.string().min(1, "ছুটির শেষের তারিখ আবশ্যক"),
  reason: z.string().min(1, "ছুটির কারণ আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LeaveApplyPage() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await saveLeaveApplication(formData);

    if (result.success) {
      toast({
        title: "আবেদন সফল হয়েছে",
        description: "আপনার ছুটির আবেদন সফলভাবে জমা দেওয়া হয়েছে।",
      });
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

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">অনুপস্থিতির ছুটির জন্য আবেদন</h1>
          <p className="text-muted-foreground mt-2">সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><FileText /> আবেদনের তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem><Label htmlFor="studentName">শিক্ষার্থীর নাম</Label><Input id="studentName" {...register("studentName")} /><FormMessage name="studentName" /></FormItem>
                <FormItem><Label htmlFor="className">শ্রেণী</Label><Input id="className" {...register("className")} /><FormMessage name="className" /></FormItem>
                <FormItem><Label htmlFor="rollNo">রোল নম্বর</Label><Input id="rollNo" {...register("rollNo")} /><FormMessage name="rollNo" /></FormItem>
                <FormItem><Label htmlFor="guardianName">অভিভাবকের নাম</Label><Input id="guardianName" {...register("guardianName")} /><FormMessage name="guardianName" /></FormItem>
                <FormItem><Label htmlFor="startDate">ছুটির শুরু</Label><Input id="startDate" type="date" {...register("startDate")} /><FormMessage name="startDate" /></FormItem>
                <FormItem><Label htmlFor="endDate">ছুটির শেষ</Label><Input id="endDate" type="date" {...register("endDate")} /><FormMessage name="endDate" /></FormItem>
                <FormItem className="md:col-span-2"><Label htmlFor="reason">ছুটির কারণ</Label><Textarea id="reason" {...register("reason")} /><FormMessage name="reason" /></FormItem>
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
