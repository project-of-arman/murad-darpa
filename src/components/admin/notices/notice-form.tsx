
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Notice, saveNotice } from "@/lib/notice-data";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const fileSchema = z.any()
  .optional()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 10MB।`)
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .pdf ফরম্যাট সাপোর্ট করবে।"
  );

const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  date: z.string().min(1, "তারিখ আবশ্যক"),
  description: z.string().min(1, "বিবরণ আবশ্যক"),
  file: fileSchema,
  is_marquee: z.boolean().default(false),
  remove_file: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function NoticeForm({ notice }: { notice?: Notice }) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: notice?.title || "",
      date: notice?.date || "",
      description: notice?.description || "",
      is_marquee: notice?.is_marquee || false,
      remove_file: false,
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('date', values.date);
    formData.append('description', values.description);
    formData.append('is_marquee', values.is_marquee.toString());
    formData.append('remove_file', values.remove_file.toString());
    
    if (values.file && values.file.length > 0) {
        formData.append('file', values.file[0]);
    }

    const result = await saveNotice(formData, notice?.id);

    if (result.success) {
      toast({
        title: `নোটিশ ${notice ? 'সম্পাদনা' : 'তৈরি'} হয়েছে`,
        description: `নোটিশটি সফলভাবে ${notice ? 'সম্পাদনা' : 'তৈরি'} করা হয়েছে।`,
      });
      router.push("/admin/notices");
      router.refresh();
    } else {
      toast({
        title: "ত্রুটি",
        description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">শিরোনাম</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">তারিখ</Label>
        <Input id="date" placeholder="যেমন: ২২ জুলাই, ২০২৪" {...register("date")} />
        {errors.date && <p className="text-sm font-medium text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">বিবরণ</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm font-medium text-destructive">{errors.description.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file">ফাইল আপলোড (ঐচ্ছিক)</Label>
        <Input id="file" type="file" accept="application/pdf" {...register("file")} />
        {errors.file && <p className="text-sm font-medium text-destructive">{errors.file.message as string}</p>}
        {notice?.file_name && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-muted-foreground">বর্তমান ফাইল: {notice.file_name}</p>
            <div className="flex items-center space-x-2">
                <Controller
                    control={control}
                    name="remove_file"
                    render={({ field }) => (
                        <Checkbox
                            id="remove_file"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor="remove_file" className="text-sm font-normal text-destructive">
                    বর্তমান ফাইলটি মুছুন
                </Label>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
            control={control}
            name="is_marquee"
            render={({ field }) => (
                <Switch
                    id="is_marquee"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            )}
        />
        <Label htmlFor="is_marquee">জরুরী ঘোষণা হিসেবে দেখান</Label>
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
