
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
import { ArrowRight, FileText, Upload } from 'lucide-react';
import { saveStipendApplication } from "./actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const fileSchema = z.any()
    .refine((files) => files?.length == 1, "ফাইল আবশ্যক।")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 5MB।`)
    .refine(
      (files) => ACCEPTED_DOCUMENT_TYPES.includes(files?.[0]?.type),
      "শুধুমাত্র .jpg, .jpeg, .png, .webp এবং .pdf ফরম্যাট সাপোর্ট করবে।"
    );

const optionalFileSchema = z.any()
  .refine((files) => !files || files.length === 0 || (files?.[0]?.size <= MAX_FILE_SIZE), `ফাইলের সর্বোচ্চ আকার 5MB।`)
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_DOCUMENT_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .jpg, .jpeg, .png, .webp এবং .pdf ফরম্যাট সাপোর্ট করবে।"
  ).optional();

const formSchema = z.object({
  studentName: z.string().min(1, "শিক্ষার্থীর নাম আবশ্যক"),
  className: z.string().min(1, "শ্রেণী আবশ্যক"),
  rollNo: z.string().min(1, "রোল নম্বর আবশ্যক"),
  session: z.string().min(1, "সেশন আবশ্যক"),
  fatherName: z.string().min(1, "পিতার নাম আবশ্যক"),
  motherName: z.string().min(1, "মাতার নাম আবশ্যক"),
  guardianYearlyIncome: z.string().min(1, "অভিভাবকের বাৎসরিক আয় আবশ্যক"),
  reason: z.string().min(1, "উপবৃত্তির কারণ আবশ্যক"),
  mobile: z.string().min(1, "যোগাযোগের মোবাইল নম্বর আবশ্যক"),
  nagadMobile: z.string().min(1, "নগদ একাউন্ট নম্বর আবশ্যক"),
  simOwnerName: z.string().min(1, "সিম মালিকের নাম আবশ্যক"),
  birthCertPhoto: fileSchema,
  nidPhoto: fileSchema,
  optionalPhoto: optionalFileSchema,
});

type FormValues = z.infer<typeof formSchema>;


export default function StipendApplyPage() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
        if (!['birthCertPhoto', 'nidPhoto', 'optionalPhoto'].includes(key) && value) {
             formData.append(key, value as string);
        }
    });
    
    formData.append('birthCertPhoto', values.birthCertPhoto[0]);
    formData.append('nidPhoto', values.nidPhoto[0]);
    if (values.optionalPhoto && values.optionalPhoto.length > 0) {
        formData.append('optionalPhoto', values.optionalPhoto[0]);
    }

    const result = await saveStipendApplication(formData);

    if (result.success) {
        toast({
            title: "আবেদন সফল হয়েছে",
            description: "আপনার উপবৃত্তির আবেদন সফলভাবে জমা দেওয়া হয়েছে।",
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
          <h1 className="text-4xl font-bold text-primary font-headline">উপবৃত্তির জন্য আবেদন</h1>
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
                <FormItem><Label htmlFor="session">সেশন</Label><Input id="session" {...register("session")} /><FormMessage name="session" /></FormItem>
                <FormItem><Label htmlFor="fatherName">পিতার নাম</Label><Input id="fatherName" {...register("fatherName")} /><FormMessage name="fatherName" /></FormItem>
                <FormItem><Label htmlFor="motherName">মাতার নাম</Label><Input id="motherName" {...register("motherName")} /><FormMessage name="motherName" /></FormItem>
                <FormItem className="md:col-span-2"><Label htmlFor="guardianYearlyIncome">অভিভাবকের বাৎসরিক আয়</Label><Input id="guardianYearlyIncome" {...register("guardianYearlyIncome")} /><FormMessage name="guardianYearlyIncome" /></FormItem>
                <FormItem className="md:col-span-2"><Label htmlFor="reason">উপবৃত্তির কারণ</Label><Textarea id="reason" {...register("reason")} /><FormMessage name="reason" /></FormItem>
                <FormItem><Label htmlFor="mobile">যোগাযোগের মোবাইল নম্বর</Label><Input id="mobile" {...register("mobile")} /><p className="text-xs text-muted-foreground mt-1">আপনার সঠিক মোবাইল নম্বর টি দিন আমাদের পক্ষ থেকে আপনার সাথে যোগাযোগ করা হবে</p><FormMessage name="mobile" /></FormItem>
                <FormItem><Label htmlFor="nagadMobile">নতুন নগদ একাউন্ট খোলা মোবাইল নম্বর</Label><Input id="nagadMobile" {...register("nagadMobile")} /><FormMessage name="nagadMobile" /></FormItem>
                <FormItem className="md:col-span-2"><Label htmlFor="simOwnerName">সিমের মালিকের নাম (বাবা/মা/অভিভাবক)</Label><Input id="simOwnerName" {...register("simOwnerName")} /><FormMessage name="simOwnerName" /></FormItem>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><Upload /> ফাইল আপলোড</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormItem>
                    <Label htmlFor="birthCertPhoto">শিক্ষার্থীর জন্ম নিবন্ধন সনদের কপি</Label>
                    <Input id="birthCertPhoto" type="file" accept="image/*,application/pdf" {...register("birthCertPhoto")} />
                    <FormMessage name="birthCertPhoto" />
                </FormItem>
                <FormItem>
                    <Label htmlFor="nidPhoto">অভিভাবকের (বাবা/অন্য কেউ) এনআইডি কার্ডের ফপি.</Label>
                    <Input id="nidPhoto" type="file" accept="image/*,application/pdf" {...register("nidPhoto")} />
                    <FormMessage name="nidPhoto" />
                </FormItem>
                <FormItem>
                    <Label htmlFor="optionalPhoto">মা এর এনআইডি কার্ডের ফপি</Label>
                    <Input id="optionalPhoto" type="file" accept="image/*,application/pdf" {...register("optionalPhoto")} />
                    <FormMessage name="optionalPhoto" />
                </FormItem>
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
