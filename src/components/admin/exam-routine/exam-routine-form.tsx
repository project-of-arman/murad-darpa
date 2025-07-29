
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
import { ExamRoutine, saveExamRoutine } from "@/lib/exam-routine-data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const classes = ["৬ষ্ঠ শ্রেণী", "৭ম শ্রেণী", "৮ম শ্রেণী", "৯ম শ্রেণী", "১০ম শ্রেণী"];

const formSchema = z.object({
  class_name: z.string().min(1, "শ্রেণী আবশ্যক"),
  exam_name: z.string().min(1, "পরীক্ষার নাম আবশ্যক"),
  subject: z.string().min(1, "বিষয় আবশ্যক"),
  exam_date: z.string().min(1, "তারিখ আবশ্যক"),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
});

type FormValues = z.infer<typeof formSchema>;

export function ExamRoutineForm({ routine }: { routine?: ExamRoutine }) {
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
      class_name: routine?.class_name || "",
      exam_name: routine?.exam_name || "",
      subject: routine?.subject || "",
      exam_date: routine?.exam_date ? new Date(routine.exam_date).toISOString().split('T')[0] : "",
      start_time: routine?.start_time ? routine.start_time.substring(0, 5) : "",
      end_time: routine?.end_time ? routine.end_time.substring(0, 5) : "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveExamRoutine(values, routine?.id);

    if (result.success) {
      toast({
        title: `রুটিন ${routine ? 'সম্পাদনা' : 'তৈরি'} হয়েছে`,
        description: `রুটিনটি সফলভাবে ${routine ? 'সম্পাদনা' : 'তৈরি'} করা হয়েছে।`,
      });
      router.push("/admin/exam-routine");
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
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger>
              <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          )} />
          <FormMessage name="class_name" />
        </FormItem>
        <FormItem>
            <Label htmlFor="exam_name">পরীক্ষার নাম</Label>
            <Input id="exam_name" {...register("exam_name")} />
            <FormMessage name="exam_name" />
        </FormItem>
         <FormItem>
            <Label htmlFor="subject">বিষয়</Label>
            <Input id="subject" {...register("subject")} />
            <FormMessage name="subject" />
        </FormItem>
        <FormItem>
            <Label htmlFor="exam_date">তারিখ</Label>
            <Input id="exam_date" type="date" {...register("exam_date")} />
            <FormMessage name="exam_date" />
        </FormItem>
         <FormItem>
            <Label htmlFor="start_time">শুরুর সময়</Label>
            <Input id="start_time" type="time" {...register("start_time")} />
            <FormMessage name="start_time" />
        </FormItem>
        <FormItem>
            <Label htmlFor="end_time">শেষের সময়</Label>
            <Input id="end_time" type="time" {...register("end_time")} />
            <FormMessage name="end_time" />
        </FormItem>
      </div>

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
