
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AboutSchoolInfo, saveAboutSchool } from "@/lib/school-data";
import { Textarea } from "@/components/ui/textarea";
import { toBuffer } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageSchema = z.any()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 5MB।`)
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সাপোর্ট করবে।"
  ).optional();

const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  description: z.string().min(1, "বিবরণ আবশ্যক"),
  image_url: imageSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function AboutSchoolForm({ content }: { content: AboutSchoolInfo }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: content?.title || "",
      description: content?.description || "",
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    
    if (values.image_url && values.image_url.length > 0) {
      try {
        const imageBuffer = await toBuffer(values.image_url[0]);
        formData.append('image_url', new Blob([imageBuffer]));
      } catch (error) {
         toast({ title: "ফাইল আপলোড ত্রুটি", description: "ছবি প্রসেস করার সময় একটি সমস্যা হয়েছে।", variant: "destructive" });
         return;
      }
    }

    const result = await saveAboutSchool(formData);

    if (result.success) {
      toast({ title: "সফল!", description: "তথ্য সফলভাবে আপডেট করা হয়েছে।" });
      router.refresh();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FormItem>
          <Label htmlFor="title">শিরোনাম</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
        </FormItem>
         <FormItem>
          <Label htmlFor="description">বিবরণ</Label>
          <Textarea id="description" {...register("description")} rows={5} />
          {errors.description && <p className="text-sm font-medium text-destructive">{errors.description.message}</p>}
        </FormItem>
        <FormItem>
            <Label htmlFor="image_url">ছবি</Label>
            <Input id="image_url" type="file" accept="image/*" {...register("image_url")} />
            <p className="text-xs text-muted-foreground">নতুন ছবি আপলোড করলে পুরোনো ছবিটি প্রতিস্থাপিত হবে।</p>
            {errors.image_url && <p className="text-sm font-medium text-destructive">{errors.image_url.message as string}</p>}
        </FormItem>
        {content?.image_url && (
            <div className="mt-2">
                <Label>বর্তমান ছবি</Label>
                <img src={content.image_url} alt="Current about image" className="mt-2 h-32 w-auto rounded-md object-cover" />
            </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
        </Button>
      </div>
    </form>
  );
}
