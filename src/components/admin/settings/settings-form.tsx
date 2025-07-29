
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SiteSettings } from "@/lib/settings-data";
import { Textarea } from "@/components/ui/textarea";
import { saveSiteSettings } from "@/lib/actions/settings-actions";
import { toBuffer } from "@/lib/utils";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/x-icon", "image/vnd.microsoft.icon", "image/png", "image/svg+xml"];

const fileSchema = z.any()
  .optional()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 1MB।`)
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .ico, .png, এবং .svg ফরম্যাট সাপোর্ট করবে।"
  );

const formSchema = z.object({
  site_title: z.string().min(1, "সাইটের শিরোনাম আবশ্যক"),
  meta_description: z.string().min(1, "মেটা বিবরণ আবশ্যক"),
  meta_keywords: z.string().optional(),
  favicon: fileSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        site_title: settings.site_title,
        meta_description: settings.meta_description,
        meta_keywords: settings.meta_keywords || '',
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    formData.append('site_title', values.site_title);
    formData.append('meta_description', values.meta_description);
    formData.append('meta_keywords', values.meta_keywords || '');

    if (values.favicon && values.favicon.length > 0) {
        try {
            const faviconBuffer = await toBuffer(values.favicon[0]);
            formData.append('favicon_url', new Blob([faviconBuffer]));
        } catch (error) {
            toast({ title: "ফাইল আপলোড ত্রুটি", description: "ফেভিকন প্রসেস করার সময় একটি সমস্যা হয়েছে।", variant: "destructive" });
            return;
        }
    }

    const result = await saveSiteSettings(formData);
    if (result.success) {
      toast({ title: "সফল!", description: "সেটিংস সফলভাবে আপডেট করা হয়েছে।" });
      router.refresh();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormItem>
          <Label htmlFor="site_title">সাইটের শিরোনাম (Title)</Label>
          <Input id="site_title" {...register("site_title")} />
          {errors.site_title && <p className="text-sm font-medium text-destructive">{errors.site_title.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="meta_description">মেটা বিবরণ (Description)</Label>
          <Textarea id="meta_description" {...register("meta_description")} />
           <p className="text-xs text-muted-foreground">সার্চ ইঞ্জিনে আপনার সাইটের নিচে এই বিবরণটি দেখানো হবে।</p>
          {errors.meta_description && <p className="text-sm font-medium text-destructive">{errors.meta_description.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="meta_keywords">মেটা কিওয়ার্ডস (Keywords)</Label>
          <Input id="meta_keywords" {...register("meta_keywords")} />
           <p className="text-xs text-muted-foreground">কমা (,) দিয়ে একাধিক কিওয়ার্ড লিখুন। যেমন: স্কুল, কলেজ, শিক্ষা।</p>
          {errors.meta_keywords && <p className="text-sm font-medium text-destructive">{errors.meta_keywords.message}</p>}
        </FormItem>
        <FormItem>
            <Label htmlFor="favicon">ফেভিকন</Label>
            <Input id="favicon" type="file" accept="image/x-icon,image/png,image/svg+xml" {...register("favicon")} />
            <p className="text-xs text-muted-foreground">ব্রাউজার ট্যাবে দেখানো ছোট আইকন। নতুন আইকন আপলোড করলে পুরোনোটি প্রতিস্থাপিত হবে।</p>
            <FormMessage name="favicon" />
        </FormItem>
        {settings.favicon_url && (
            <div className="mt-2">
                <Label>বর্তমান ফেভিকন</Label>
                <img src={settings.favicon_url} alt="Current Favicon" className="mt-2 h-8 w-8" />
            </div>
        )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
        </Button>
      </div>
    </form>
  );
}
