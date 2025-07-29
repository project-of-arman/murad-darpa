
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
import { Routine, saveRoutine } from "@/lib/routine-data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const classes = ["৬ষ্ঠ শ্রেণী", "৭ম শ্রেণী", "৮ম শ্রেণী", "৯ম শ্রেণী", "১০ম শ্রেণী"];
const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];
const periods = [1, 2, 3, 4, 5, 6, 7, 8];

const formSchema = z.object({
  class_name: z.string().min(1, "শ্রেণী আবশ্যক"),
  day_of_week: z.string().min(1, "দিন আবশ্যক"),
  period: z.coerce.number().min(1, "পিরিয়ড আবশ্যক"),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
  subject: z.string().min(1, "বিষয় আবশ্যক"),
  teacher_name: z.string().min(1, "শিক্ষকের নাম আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

export function RoutineForm({ routine }: { routine?: Routine }) {
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
      day_of_week: routine?.day_of_week || "",
      period: routine?.period || undefined,
      start_time: routine?.start_time ? routine.start_time.substring(0, 5) : "",
      end_time: routine?.end_time ? routine.end_time.substring(0, 5) : "",
      subject: routine?.subject || "",
      teacher_name: routine?.teacher_name || "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveRoutine(values, routine?.id);

    if (result.success) {
      toast({
        title: `রুটিন ${routine ? 'সম্পাদনা' : 'তৈরি'} হয়েছে`,
        description: `পিরিয়ডটি সফলভাবে ${routine ? 'সম্পাদনা' : 'তৈরি'} করা হয়েছে।`,
      });
      router.push("/admin/routine");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <Label>দিন</Label>
          <Controller name="day_of_week" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger>
              <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          )} />
          <FormMessage name="day_of_week" />
        </FormItem>
        <FormItem>
          <Label>পিরিয়ড</Label>
          <Controller name="period" control={control} render={({ field }) => (
            <Select onValueChange={v => field.onChange(parseInt(v))} defaultValue={field.value?.toString()}>
              <SelectTrigger><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger>
              <SelectContent>{periods.map(p => <SelectItem key={p} value={p.toString()}>{p}</SelectItem>)}</SelectContent>
            </Select>
          )} />
          <FormMessage name="period" />
        </FormItem>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <FormItem>
            <Label htmlFor="subject">বিষয়</Label>
            <Input id="subject" {...register("subject")} />
            <FormMessage name="subject" />
        </FormItem>
        <FormItem>
            <Label htmlFor="teacher_name">শিক্ষকের নাম</Label>
            <Input id="teacher_name" {...register("teacher_name")} />
            <FormMessage name="teacher_name" />
        </FormItem>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
