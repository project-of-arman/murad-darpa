
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ContactInfo, saveContactInfo } from "@/lib/contact-data";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  school_name: z.string().min(1, "প্রতিষ্ঠানের নাম আবশ্যক"),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  phone: z.string().min(1, "ফোন নম্বর আবশ্যক"),
  email: z.string().email("অবৈধ ইমেইল"),
  map_embed_url: z.string().url("অবৈধ URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactInfoForm({ contactInfo }: { contactInfo: ContactInfo }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: contactInfo,
  });

  async function onSubmit(values: FormValues) {
    const result = await saveContactInfo(values);
    if (result.success) {
      toast({ title: "সফল!", description: "যোগাযোগের তথ্য সফলভাবে আপডেট করা হয়েছে।" });
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
          <Label htmlFor="school_name">প্রতিষ্ঠানের নাম</Label>
          <Input id="school_name" {...register("school_name")} />
          {errors.school_name && <p className="text-sm font-medium text-destructive">{errors.school_name.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="address">ঠিকানা</Label>
          <Input id="address" {...register("address")} />
          {errors.address && <p className="text-sm font-medium text-destructive">{errors.address.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="phone">ফোন</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="email">ইমেইল</Label>
          <Input id="email" {...register("email")} />
          {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
        </FormItem>
        <FormItem className="md:col-span-2">
          <Label htmlFor="map_embed_url">Google Maps Embed URL</Label>
          <Textarea id="map_embed_url" {...register("map_embed_url")} />
          {errors.map_embed_url && <p className="text-sm font-medium text-destructive">{errors.map_embed_url.message}</p>}
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
