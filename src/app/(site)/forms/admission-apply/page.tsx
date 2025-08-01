
"use client";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ভর্তি আবেদন',
};

import { useState } from "react";
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
import { ArrowRight, User, School, Users2, MapPin, Upload, Eye } from 'lucide-react';
import { cn } from "@/lib/utils";
import { saveAdmissionApplication } from "./actions";
import PrintableView from "@/components/forms/printable-view";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];


const fileSchema = z.any()
    .refine((files) => files?.length == 1, "ফাইল আবশ্যক।")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 5MB।`);

const imageFileSchema = fileSchema.refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সাপোর্ট করবে।"
    );

const documentFileSchema = fileSchema.refine(
      (files) => ACCEPTED_DOCUMENT_TYPES.includes(files?.[0]?.type),
      "শুধুমাত্র .jpg, .jpeg, .png, .webp এবং .pdf ফরম্যাট সাপোর্ট করবে।"
    );


const admissionFormSchema = z.object({
  // Student Info
  studentNameBn: z.string().min(1, "শিক্ষার্থীর নাম (বাংলা) আবশ্যক"),
  studentNameEn: z.string().min(1, "শিক্ষার্থীর নাম (ইংরেজি) আবশ্যক").regex(/^[a-zA-Z\s.-]+$/, "শুধুমাত্র ইংরেজি অক্ষর ব্যবহার করুন"),
  dob: z.string().min(1, "জন্ম তারিখ আবশ্যক"),
  birthCertNo: z.string().min(1, "জন্ম নিবন্ধন নম্বর আবশ্যক"),
  gender: z.string().min(1, "লিঙ্গ নির্বাচন করুন"),
  religion: z.string().min(1, "ধর্ম নির্বাচন করুন"),
  bloodGroup: z.string().optional(),
  
  // Academic Info
  applyingForClass: z.string().min(1, "আবেদনের শ্রেণী নির্বাচন করুন"),
  previousSchool: z.string().optional(),

  // Parent Info
  fatherNameBn: z.string().min(1, "পিতার নাম (বাংলা) আবশ্যক"),
  fatherNameEn: z.string().min(1, "পিতার নাম (ইংরেজি) আবশ্যক").regex(/^[a-zA-Z\s.-]+$/, "শুধুমাত্র ইংরেজি অক্ষর ব্যবহার করুন"),
  fatherNid: z.string().min(1, "পিতার জাতীয় পরিচয়পত্র নম্বর আবশ্যক"),
  fatherMobile: z.string().min(1, "পিতার মোবাইল নম্বর আবশ্যক"),
  motherNameBn: z.string().min(1, "মাতার নাম (বাংলা) আবশ্যক"),
  motherNameEn: z.string().min(1, "মাতার নাম (ইংরেজি) আবশ্যক").regex(/^[a-zA-Z\s.-]+$/, "শুধুমাত্র ইংরেজি অক্ষর ব্যবহার করুন"),
  motherNid: z.string().min(1, "মাতার জাতীয় পরিচয়পত্র নম্বর আবশ্যক"),
  motherMobile: z.string().min(1, "মাতার মোবাইল নম্বর আবশ্যক"),

  // Address Info
  presentAddress: z.string().min(1, "বর্তমান ঠিকানা আবশ্যক"),
  permanentAddress: z.string().min(1, "স্থায়ী ঠিকানা আবশ্যক"),

  // File Uploads - these are for initial validation only
  studentPhoto: imageFileSchema,
  birthCertPhoto: documentFileSchema,
});

type FormValues = z.infer<typeof admissionFormSchema>;
type SubmittedData = FormValues & { studentPhoto: string; birthCertPhoto: string };

const dummySubmittedData: SubmittedData = {
    studentNameBn: "মোঃ আরিফুল ইসলাম",
    studentNameEn: "MD. ARIFUL ISLAM",
    dob: "2010-01-15",
    birthCertNo: "20101234567890123",
    gender: "ছেলে",
    religion: "ইসলাম",
    bloodGroup: "O+",
    applyingForClass: "৬ষ্ঠ",
    previousSchool: "পূর্ববর্তী মডেল স্কুল",
    fatherNameBn: "মোঃ আব্দুল হামিদ",
    fatherNameEn: "MD. ABDUL HAMID",
    fatherNid: "19801234567890",
    fatherMobile: "01711223344",
    motherNameBn: "মোসাঃ আমেনা বেগম",
    motherNameEn: "MOSA. AMENA BEGUM",
    motherNid: "19851234567890",
    motherMobile: "01811223355",
    presentAddress: "বাড়ি #১০, রোড #৫, ব্লক #বি, মিরপুর, ঢাকা",
    permanentAddress: "গ্রাম: চাঁদপুর, ডাকঘর: চাঁদপুর, উপজেলা: ফরিদগঞ্জ, জেলা: চাঁদপুর",
    studentPhoto: "https://placehold.co/128x160.png", // Example data URI
    birthCertPhoto: "https://placehold.co/200x100.png"
};

export default function AdmissionApplyPage() {
  const { toast } = useToast();
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(admissionFormSchema),
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    // Append all string/number values
    Object.entries(values).forEach(([key, value]) => {
        if (key !== 'studentPhoto' && key !== 'birthCertPhoto' && value) {
             formData.append(key, value as string);
        }
    });
    
    // Append file data
    formData.append('studentPhoto', values.studentPhoto[0]);
    formData.append('birthCertPhoto', values.birthCertPhoto[0]);

    const result = await saveAdmissionApplication(formData);

    if (result.success && result.data) {
        toast({
          title: "আবেদন সফল হয়েছে",
          description: "আপনার ভর্তির আবেদন সফলভাবে জমা দেওয়া হয়েছে।",
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

  const handleBackToForm = () => {
    setSubmittedData(null);
    setIsPreviewing(false);
  };

  if (submittedData || isPreviewing) {
    return (
      <PrintableView
        title="ভর্তি আবেদনের কপি"
        data={isPreviewing ? dummySubmittedData : submittedData!}
        onBack={handleBackToForm}
      />
    );
  }


  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">অনলাইন ভর্তি আবেদন</h1>
          <p className="text-muted-foreground mt-2">
            সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Student Information */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><User /> শিক্ষার্থীর তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem> <Label htmlFor="studentNameBn">শিক্ষার্থীর নাম (বাংলা)</Label> <Input id="studentNameBn" placeholder="বাংলায় নাম লিখুন" {...register("studentNameBn")} /> <FormMessage name="studentNameBn" /> </FormItem>
                <FormItem> <Label htmlFor="studentNameEn">শিক্ষার্থীর নাম (ইংরেজি)</Label> <Input id="studentNameEn" placeholder="ইংরেজিতে নাম লিখুন" {...register("studentNameEn")} /> <FormMessage name="studentNameEn" /> </FormItem>
                <FormItem> <Label htmlFor="dob">জন্ম তারিখ</Label> <Input id="dob" type="date" {...register("dob")} /> <FormMessage name="dob" /> </FormItem>
                <FormItem> <Label htmlFor="birthCertNo">জন্ম নিবন্ধন নম্বর</Label> <Input id="birthCertNo" placeholder="১৭ ডিজিটের নম্বর" {...register("birthCertNo")} /> <FormMessage name="birthCertNo" /> </FormItem>
                
                <FormItem>
                  <Label>লিঙ্গ</Label>
                   <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ছেলে">ছেলে</SelectItem>
                          <SelectItem value="মেয়ে">মেয়ে</SelectItem>
                          <SelectItem value="অন্যান্য">অন্যান্য</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormMessage name="gender" />
                </FormItem>

                 <FormItem>
                  <Label>ধর্ম</Label>
                    <Controller
                    name="religion"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ইসলাম">ইসলাম</SelectItem>
                          <SelectItem value="হিন্দু">হিন্দু</SelectItem>
                          <SelectItem value="বৌদ্ধ">বৌদ্ধ</SelectItem>
                          <SelectItem value="খ্রিস্টান">খ্রিস্টান</SelectItem>
                          <SelectItem value="অন্যান্য">অন্যান্য</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormMessage name="religion" />
                </FormItem>

                 <FormItem>
                  <Label>রক্তের গ্রুপ (ঐচ্ছিক)</Label>
                    <Controller
                    name="bloodGroup"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormMessage name="bloodGroup" />
                </FormItem>
              </CardContent>
            </Card>
            
            {/* Academic Information */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><School />একাডেমিক তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormItem>
                    <Label>আবেদনের শ্রেণী</Label>
                    <Controller
                        name="applyingForClass"
                        control={control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="৬ষ্ঠ">৬ষ্ঠ</SelectItem>
                                <SelectItem value="৭ম">৭ম</SelectItem>
                                <SelectItem value="৮ম">৮ম</SelectItem>
                                <SelectItem value="৯ম">৯ম</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    <FormMessage name="applyingForClass" />
                 </FormItem>
                 <FormItem> <Label htmlFor="previousSchool">পূর্ববর্তী প্রতিষ্ঠানের নাম (যদি থাকে)</Label> <Input id="previousSchool" placeholder="স্কুলের নাম লিখুন" {...register("previousSchool")} /> <FormMessage name="previousSchool" /> </FormItem>
              </CardContent>
            </Card>

            {/* Parent Information */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><Users2 /> অভিভাবকের তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem> <Label htmlFor="fatherNameBn">পিতার নাম (বাংলা)</Label> <Input id="fatherNameBn" placeholder="বাংলায় নাম লিখুন" {...register("fatherNameBn")} /> <FormMessage name="fatherNameBn" /> </FormItem>
                <FormItem> <Label htmlFor="fatherNameEn">পিতার নাম (ইংরেজি)</Label> <Input id="fatherNameEn" placeholder="ইংরেজিতে নাম লিখুন" {...register("fatherNameEn")} /> <FormMessage name="fatherNameEn" /> </FormItem>
                <FormItem> <Label htmlFor="fatherNid">পিতার জাতীয় পরিচয়পত্র নম্বর</Label> <Input id="fatherNid" placeholder="NID নম্বর" {...register("fatherNid")} /> <FormMessage name="fatherNid" /> </FormItem>
                <FormItem> <Label htmlFor="fatherMobile">পিতার মোবাইল নম্বর</Label> <Input id="fatherMobile" placeholder="মোবাইল নম্বর" {...register("fatherMobile")} /> <p className="text-xs text-muted-foreground mt-1">আপনার সঠিক মোবাইল নম্বর টি দিন আমাদের পক্ষ থেকে আপনার সাথে যোগাযোগ করা হবে</p><FormMessage name="fatherMobile" /> </FormItem>
                <FormItem> <Label htmlFor="motherNameBn">মাতার নাম (বাংলা)</Label> <Input id="motherNameBn" placeholder="বাংলায় নাম লিখুন" {...register("motherNameBn")} /> <FormMessage name="motherNameBn" /> </FormItem>
                <FormItem> <Label htmlFor="motherNameEn">মাতার নাম (ইংরেজি)</Label> <Input id="motherNameEn" placeholder="ইংরেজিতে নাম লিখুন" {...register("motherNameEn")} /> <FormMessage name="motherNameEn" /> </FormItem>
                <FormItem> <Label htmlFor="motherNid">মাতার জাতীয় পরিচয়পত্র নম্বর</Label> <Input id="motherNid" placeholder="NID নম্বর" {...register("motherNid")} /> <FormMessage name="motherNid" /> </FormItem>
                <FormItem> <Label htmlFor="motherMobile">মাতার মোবাইল নম্বর</Label> <Input id="motherMobile" placeholder="মোবাইল নম্বর" {...register("motherMobile")} /> <p className="text-xs text-muted-foreground mt-1">আপনার সঠিক মোবাইল নম্বর টি দিন আমাদের পক্ষ থেকে আপনার সাথে যোগাযোগ করা হবে</p><FormMessage name="motherMobile" /> </FormItem>
              </CardContent>
            </Card>

             {/* Address Information */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><MapPin /> ঠিকানা</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem> <Label htmlFor="presentAddress">বর্তমান ঠিকানা</Label> <Input id="presentAddress" placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা" {...register("presentAddress")} /> <FormMessage name="presentAddress" /> </FormItem>
                <FormItem> <Label htmlFor="permanentAddress">স্থায়ী ঠিকানা</Label> <Input id="permanentAddress" placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা" {...register("permanentAddress")} /> <FormMessage name="permanentAddress" /> </FormItem>
              </CardContent>
            </Card>
            
            {/* File Uploads */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><Upload /> ফাইল আপলোড</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                    <Label htmlFor="studentPhoto">শিক্ষার্থীর ছবি (পাসপোর্ট সাইজ)</Label>
                    <Input id="studentPhoto" type="file" accept="image/*" {...register("studentPhoto")} />
                    <FormMessage name="studentPhoto" />
                </FormItem>
                <FormItem>
                    <Label htmlFor="birthCertPhoto">জন্ম নিবন্ধন সনদের কপি</Label>
                    <Input id="birthCertPhoto" type="file" accept="image/*,application/pdf" {...register("birthCertPhoto")} />
                    <FormMessage name="birthCertPhoto" />
                </FormItem>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
               <Button type="button" variant="secondary" onClick={() => setIsPreviewing(true)}>
                <Eye className="mr-2 h-5 w-5" /> প্রিভিউ দেখুন
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
}
