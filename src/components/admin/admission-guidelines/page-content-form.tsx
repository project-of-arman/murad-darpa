
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AdmissionPageContent } from "@/lib/admission-data";
import { savePageContent } from "@/lib/actions/admission-guidelines-actions";

const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  subtitle: z.string().min(1, "উপ-শিরোনাম আবশ্যক"),
  form_download_url: z.string().optional(),
  contact_title: z.string().optional(),
  contact_description: z.string().optional(),
  contact_phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PageContentForm({ content }: { content: AdmissionPageContent }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: content?.title || "",
      subtitle: content?.subtitle || "",
      form_download_url: content?.form_download_url || "",
      contact_title: content?.contact_title || "",
      contact_description: content?.contact_description || "",
      contact_phone: content?.contact_phone || "",
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    const result = await savePageContent(formData);

    if (result.success) {
      toast({ title: "সফল!", description: "পেজের তথ্য সফলভাবে আপডেট করা হয়েছে।" });
      router.refresh();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormItem>
          <Label htmlFor="title">শিরোনাম</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="subtitle">উপ-শিরোনাম</Label>
          <Input id="subtitle" {...register("subtitle")} />
          {errors.subtitle && <p className="text-sm font-medium text-destructive">{errors.subtitle.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="form_download_url">ফরম ডাউনলোড URL</Label>
          <Input id="form_download_url" {...register("form_download_url")} />
          {errors.form_download_url && <p className="text-sm font-medium text-destructive">{errors.form_download_url.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="contact_phone">যোগাযোগের ফোন নম্বর</Label>
          <Input id="contact_phone" {...register("contact_phone")} />
          {errors.contact_phone && <p className="text-sm font-medium text-destructive">{errors.contact_phone.message}</p>}
        </FormItem>
         <FormItem>
          <Label htmlFor="contact_title">যোগাযোগ সেকশনের শিরোনাম</Label>
          <Input id="contact_title" {...register("contact_title")} />
          {errors.contact_title && <p className="text-sm font-medium text-destructive">{errors.contact_title.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="contact_description">যোগাযোগ সেকশনের বিবরণ</Label>
          <Input id="contact_description" {...register("contact_description")} />
          {errors.contact_description && <p className="text-sm font-medium text-destructive">{errors.contact_description.message}</p>}
        </FormItem>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
        </Button>
      </div>
    </form>
  );
}
