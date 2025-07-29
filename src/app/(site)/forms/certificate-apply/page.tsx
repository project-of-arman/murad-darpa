
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, FileText } from 'lucide-react';
import { saveCertificateApplication } from "./actions";

const formSchema = z.object({
  studentName: z.string().min(1, "শিক্ষার্থীর নাম আবশ্যক"),
  fatherName: z.string().min(1, "পিতার নাম আবশ্যক"),
  motherName: z.string().min(1, "মাতার নাম আবশ্যক"),
  lastClass: z.string().min(1, "সর্বশেষ শ্রেণী আবশ্যক"),
  lastRoll: z.string().min(1, "সর্বশেষ রোল আবশ্যক"),
  passingYear: z.string().min(4, "উত্তীর্ণ হওয়ার সাল আবশ্যক").max(4),
  registrationNo: z.string().min(1, "রেজিস্ট্রেশন নম্বর আবশ্যক"),
  mobile: z.string().min(1, "যোগাযোগের মোবাইল নম্বর আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CertificateApplyPage() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await saveCertificateApplication(formData);

    if (result.success) {
      toast({
        title: "আবেদন সফল হয়েছে",
        description: "আপনার সনদপত্রের আবেদন সফলভাবে জমা দেওয়া হয়েছে।",
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
          <h1 className="text-4xl font-bold text-primary font-headline">সার্টিফিকেটের জন্য আবেদন</h1>
          <p className="text-muted-foreground mt-2">সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><FileText /> আবেদনের তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem className="md:col-span-2"><Label htmlFor="studentName">শিক্ষার্থীর নাম</Label><Input id="studentName" {...register("studentName")} /><FormMessage name="studentName" /></FormItem>
                <FormItem><Label htmlFor="fatherName">পিতার নাম</Label><Input id="fatherName" {...register("fatherName")} /><FormMessage name="fatherName" /></FormItem>
                <FormItem><Label htmlFor="motherName">মাতার নাম</Label><Input id="motherName" {...register("motherName")} /><FormMessage name="motherName" /></FormItem>
                <FormItem><Label htmlFor="lastClass">সর্বশেষ শ্রেণী</Label><Input id="lastClass" {...register("lastClass")} /><FormMessage name="lastClass" /></FormItem>
                <FormItem><Label htmlFor="lastRoll">সর্বশেষ রোল</Label><Input id="lastRoll" {...register("lastRoll")} /><FormMessage name="lastRoll" /></FormItem>
                <FormItem><Label htmlFor="passingYear">উত্তীর্ণ হওয়ার সাল</Label><Input id="passingYear" {...register("passingYear")} /><FormMessage name="passingYear" /></FormItem>
                <FormItem><Label htmlFor="registrationNo">রেজিস্ট্রেশন নম্বর</Label><Input id="registrationNo" {...register("registrationNo")} /><FormMessage name="registrationNo" /></FormItem>
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
