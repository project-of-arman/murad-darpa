
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
import { ArrowRight, User, School, FileText } from 'lucide-react';
import { saveTransferCertificateApplication, TransferCertificateData } from "./actions";
import { useState } from "react";
import PrintableTCView from "@/components/forms/printable-tc-view";

const formSchema = z.object({
  studentName: z.string().min(1, "শিক্ষার্থীর নাম আবশ্যক"),
  className: z.string().min(1, "শ্রেণী আবশ্যক"),
  rollNo: z.string().min(1, "রোল নম্বর আবশ্যক"),
  session: z.string().min(1, "সেশন আবশ্যক"),
  fatherName: z.string().min(1, "পিতার নাম আবশ্যক"),
  motherName: z.string().min(1, "মাতার নাম আবশ্যক"),
  reason: z.string().min(1, "ছাড়পত্র গ্রহণের কারণ আবশ্যক"),
  post_office: z.string().min(1, "ডাকঘর আবশ্যক"),
  upazila: z.string().min(1, "উপজেলা আবশ্যক"),
  district: z.string().min(1, "জেলা আবশ্যক"),
  mobile: z.string().min(1, "যোগাযোগের মোবাইল নম্বর আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

export default function TransferCertificateApplyPage() {
  const { toast } = useToast();
  const [submittedData, setSubmittedData] = useState<TransferCertificateData | null>(null);
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await saveTransferCertificateApplication(formData);

    if (result.success && result.data) {
      toast({
        title: "আবেদন সফল হয়েছে",
        description: "আপনার ছাড়পত্রের আবেদন সফলভাবে জমা দেওয়া হয়েছে।",
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
    return <PrintableTCView data={submittedData} onBack={() => setSubmittedData(null)} />
  }

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">ছাড়পত্রের জন্য আবেদন</h1>
          <p className="text-muted-foreground mt-2">
            সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><FileText /> আবেদনের তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem> <Label htmlFor="studentName">শিক্ষার্থীর নাম</Label> <Input id="studentName" placeholder="সম্পূর্ণ নাম লিখুন" {...register("studentName")} /> <FormMessage name="studentName" /> </FormItem>
                <FormItem> <Label htmlFor="className">শ্রেণী</Label> <Input id="className" placeholder="যেমন: দশম" {...register("className")} /> <FormMessage name="className" /> </FormItem>
                <FormItem> <Label htmlFor="rollNo">রোল নম্বর</Label> <Input id="rollNo" placeholder="শ্রেণী রোল" {...register("rollNo")} /> <FormMessage name="rollNo" /> </FormItem>
                <FormItem> <Label htmlFor="session">সেশন</Label> <Input id="session" placeholder="যেমন: 2023-2024" {...register("session")} /> <FormMessage name="session" /> </FormItem>
                <FormItem> <Label htmlFor="fatherName">পিতার নাম</Label> <Input id="fatherName" placeholder="সম্পূর্ণ নাম লিখুন" {...register("fatherName")} /> <FormMessage name="fatherName" /> </FormItem>
                <FormItem> <Label htmlFor="motherName">মাতার নাম</Label> <Input id="motherName" placeholder="সম্পূর্ণ নাম লিখুন" {...register("motherName")} /> <FormMessage name="motherName" /> </FormItem>
                 <FormItem> <Label htmlFor="post_office">ডাকঘর</Label> <Input id="post_office" placeholder="ডাকঘর" {...register("post_office")} /> <FormMessage name="post_office" /> </FormItem>
                <FormItem> <Label htmlFor="upazila">উপজেলা</Label> <Input id="upazila" placeholder="উপজেলা" {...register("upazila")} /> <FormMessage name="upazila" /> </FormItem>
                <FormItem> <Label htmlFor="district">জেলা</Label> <Input id="district" placeholder="জেলা" {...register("district")} /> <FormMessage name="district" /> </FormItem>
                <FormItem> <Label htmlFor="mobile">যোগাযোগের মোবাইল নম্বর</Label> <Input id="mobile" placeholder="১১ ডিজিটের নম্বর" {...register("mobile")} /> <p className="text-xs text-muted-foreground mt-1">আপনার সঠিক মোবাইল নম্বর টি দিন আমাদের পক্ষ থেকে আপনার সাথে যোগাযোগ করা হবে</p> <FormMessage name="mobile" /> </FormItem>
                <FormItem className="md:col-span-2">
                    <Label>ছাড়পত্র গ্রহণের কারণ</Label>
                    <Controller
                        name="reason"
                        control={control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="কারণ নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="অভিভাবকের অভিপ্রায়">অভিভাবকের অভিপ্রায়</SelectItem>
                                <SelectItem value="বাসস্থান পরিবর্তন">বাসস্থান পরিবর্তন</SelectItem>
                                <SelectItem value="উন্নত প্রতিষ্ঠানে ভর্তি">উন্নত প্রতিষ্ঠানে ভর্তি</SelectItem>
                                <SelectItem value="শারীরিক অসুস্থতা">শারীরিক অসুস্থতা</SelectItem>
                                <SelectItem value="বিবিধ">বিবিধ</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    <FormMessage name="reason" />
                </FormItem>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
}
