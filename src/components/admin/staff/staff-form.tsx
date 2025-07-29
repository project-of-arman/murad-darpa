
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Staff, saveStaff } from "@/lib/staff-data";
import { toBuffer, toDataURL } from "@/lib/utils";
import { User, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.any()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 5MB।`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সাপোর্ট করবে।"
    ).optional();

const staffFormSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  role: z.string().min(1, "পদবি আবশ্যক"),
  email: z.string().email("অবৈধ ইমেইল ঠিকানা").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  image: fileSchema,
  dataAiHint: z.string().optional(),
});

type FormValues = z.infer<typeof staffFormSchema>;

export function StaffForm({ staff }: { staff?: Staff }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: staff?.name || "",
      role: staff?.role || "",
      email: staff?.email || "",
      phone: staff?.phone || "",
      address: staff?.address || "",
      dataAiHint: staff?.dataAiHint || "staff portrait",
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('role', values.role);
    formData.append('email', values.email || '');
    formData.append('phone', values.phone || '');
    formData.append('address', values.address || '');
    formData.append('dataAiHint', values.dataAiHint || '');

    if (values.image && values.image.length > 0) {
      try {
        const imageBuffer = await toBuffer(values.image[0]);
        formData.append('image', new Blob([imageBuffer]));
      } catch (error) {
         toast({
            title: "ফাইল আপলোড ত্রুটি",
            description: "ছবি প্রসেস করার সময় একটি সমস্যা হয়েছে।",
            variant: "destructive",
          });
          return;
      }
    }

    const result = await saveStaff(formData, staff?.id);

    if (result.success) {
        toast({
        title: "সফল হয়েছে",
        description: `কর্মচারীর তথ্য সফলভাবে ${staff ? 'আপডেট' : 'তৈরি'} করা হয়েছে।`,
        });
        router.push("/admin/staff");
        router.refresh();
    } else {
        toast({
        title: "ত্রুটি",
        description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।",
        variant: "destructive",
        });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;
  
  const currentImageSrc = staff?.image ? toDataURL(staff.image as Buffer) : null;


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><User /> কর্মচারীর তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem> <Label htmlFor="name">নাম</Label> <Input id="name" {...register("name")} /> <FormMessage name="name" /> </FormItem>
            <FormItem> <Label htmlFor="role">পদবি</Label> <Input id="role" {...register("role")} /> <FormMessage name="role" /> </FormItem>
            <FormItem> <Label htmlFor="email">ইমেইল</Label> <Input id="email" type="email" {...register("email")} /> <FormMessage name="email" /> </FormItem>
            <FormItem> <Label htmlFor="phone">ফোন</Label> <Input id="phone" {...register("phone")} /> <FormMessage name="phone" /> </FormItem>
            <FormItem className="md:col-span-2"> <Label htmlFor="address">ঠিকানা</Label> <Textarea id="address" {...register("address")} /> <FormMessage name="address" /> </FormItem>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><Upload /> ছবি আপলোড</CardTitle>
          </CardHeader>
          <CardContent>
            <FormItem>
                <Label htmlFor="image">কর্মচারীর ছবি</Label>
                <Input id="image" type="file" accept="image/*" {...register("image")} />
                <p className="text-xs text-muted-foreground">{staff ? "নতুন ছবি আপলোড করলে পুরোনো ছবিটি প্রতিস্থাপিত হবে।" : ""}</p>
                <FormMessage name="image" />
            </FormItem>
            {currentImageSrc && (
                <div className="mt-4">
                    <Label>বর্তমান ছবি</Label>
                    <img src={currentImageSrc} alt="Staff's current photo" className="mt-2 h-24 w-24 rounded-md object-cover" />
                </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => router.back()}>
                বাতিল করুন
            </Button>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </form>
  );
}
