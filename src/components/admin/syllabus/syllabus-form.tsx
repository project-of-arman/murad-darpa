
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
import { useToast } from "@/hooks/use-toast";
import { Syllabus, saveSyllabus } from "@/lib/syllabus-data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const classes = ["৬ষ্ঠ শ্রেণী", "৭ম শ্রেণী", "৮ম শ্রেণী", "৯ম শ্রেণী", "১০ম শ্রেণী"];

const formSchema = z.object({
  class_name: z.string().min(1, "শ্রেণী আবশ্যক"),
  subject: z.string().min(1, "বিষয় আবশ্যক"),
  file_url: z.string().url("অবৈধ URL").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function SyllabusForm({ syllabus }: { syllabus?: Syllabus }) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_name: syllabus?.class_name || "",
      subject: syllabus?.subject || "",
      file_url: syllabus?.file_url || "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveSyllabus(values, syllabus?.id);

    if (result.success) {
      toast({
        title: `সিলেবাস ${syllabus ? 'সম্পাদনা' : 'তৈরি'} হয়েছে`,
        description: `সিলেবাসটি সফলভাবে ${syllabus ? 'সম্পাদনা' : 'তৈরি'} করা হয়েছে।`,
      });
      router.push("/admin/syllabus");
      router.refresh();
    } else {
      toast({
        title: "ত্রুটি",
        description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।",
        variant: "destructive",
      });
    }
  }

  const FormItem = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={cn("space-y-2", className)}>{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormItem>
          <Label>শ্রেণী</Label>
          <Controller name="class_name" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger>
              <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          )} />
          <FormMessage name="class_name" />
        </FormItem>
        <FormItem>
            <Label htmlFor="subject">বিষয়</Label>
            <Input id="subject" {...register("subject")} />
            <FormMessage name="subject" />
        </FormItem>
      </div>

       <FormItem>
            <Label htmlFor="file_url">ফাইল URL (ঐচ্ছিক)</Label>
            <Input id="file_url" {...register("file_url")} />
            <FormMessage name="file_url" />
        </FormItem>


      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          বাতিল করুন
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
        </Button>
      </div>
    </form>
  );
}
