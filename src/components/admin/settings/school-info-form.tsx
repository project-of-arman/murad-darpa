
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SchoolInfo } from "@/lib/school-data";
import { Textarea } from "@/components/ui/textarea";
import { saveSchoolInfo } from "@/lib/actions/settings-actions";
import { toBuffer } from "@/lib/utils";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];

const fileSchema = z.any()
  .optional()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 1MB।`)
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .png, .jpg, .jpeg, এবং .svg ফরম্যাট সাপোর্ট করবে।"
  );

const formSchema = z.object({
  name: z.string().min(1, "স্কুলের নাম আবশ্যক"),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  logo: fileSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function SchoolInfoForm({ schoolInfo }: { schoolInfo: SchoolInfo }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: schoolInfo.name,
        address: schoolInfo.address,
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('address', values.address);

    if (values.logo && values.logo.length > 0) {
        try {
            const logoBuffer = await toBuffer(values.logo[0]);
            formData.append('logo_url', new Blob([logoBuffer]));
        } catch (error) {
            toast({ title: "ফাইল আপলোড ত্রুটি", description: "লোগো প্রসেস করার সময় একটি সমস্যা হয়েছে।", variant: "destructive" });
            return;
        }
    }

    const result = await saveSchoolInfo(formData);
    if (result.success) {
      toast({ title: "সফল!", description: "স্কুলের তথ্য সফলভাবে আপডেট করা হয়েছে।" });
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
          <Label htmlFor="name">স্কুলের নাম</Label>
          <Input id="name" {...register("name")} />
          <FormMessage name="name" />
        </FormItem>
        <FormItem>
          <Label htmlFor="address">ঠিকানা</Label>
          <Textarea id="address" {...register("address")} />
          <FormMessage name="address" />
        </FormItem>
        <FormItem>
            <Label htmlFor="logo">স্কুলের লোগো</Label>
            <Input id="logo" type="file" accept="image/*" {...register("logo")} />
            <p className="text-xs text-muted-foreground">নতুন লোগো আপলোড করলে পুরোনোটি প্রতিস্থাপিত হবে।</p>
            <FormMessage name="logo" />
        </FormItem>
        {schoolInfo.logo_url && (
            <div className="mt-2">
                <Label>বর্তমান লোগো</Label>
                <img src={schoolInfo.logo_url} alt="Current Logo" className="mt-2 h-16 w-16" />
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
