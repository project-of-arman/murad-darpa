
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

const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  date: z.string().min(1, "তারিখ আবশ্যক"),
  description: z.string().min(1, "বিবরণ আবশ্যক"),
  fileUrl: z.string().url("অবৈধ URL").optional().or(z.literal('')),
  is_marquee: z.boolean().default(false),
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
      fileUrl: notice?.fileUrl || "",
      is_marquee: notice?.is_marquee || false,
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveNotice(values, notice?.id);

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
        <Label htmlFor="fileUrl">ফাইলের URL (ঐচ্ছিক)</Label>
        <Input id="fileUrl" placeholder="https://example.com/file.pdf" {...register("fileUrl")} />
        {errors.fileUrl && <p className="text-sm font-medium text-destructive">{errors.fileUrl.message}</p>}
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
