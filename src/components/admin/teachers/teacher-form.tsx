
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
import { Teacher, saveTeacher } from "@/lib/teacher-data";
import { toBuffer, toDataURL } from "@/lib/utils";
import { User, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.any()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 5MB।`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সাপোর্ট করবে।");

const optionalFileSchema = fileSchema.optional();

const teacherFormSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  role: z.string().min(1, "পদবি আবশ্যক"),
  email: z.string().email("অবৈধ ইমেইল ঠিকানা"),
  phone: z.string().min(1, "ফোন নম্বর আবশ্যক"),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  educational_qualification: z.string().optional(),
  experience: z.string().optional(),
  image: optionalFileSchema,
  dataAiHint: z.string().optional(),
});

type FormValues = z.infer<typeof teacherFormSchema>;

export function TeacherForm({ teacher }: { teacher?: Teacher }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: teacher?.name || "",
      role: teacher?.role || "",
      email: teacher?.email || "",
      phone: teacher?.phone || "",
      address: teacher?.address || "",
      educational_qualification: teacher?.educational_qualification || "",
      experience: teacher?.experience || "",
      dataAiHint: teacher?.dataAiHint || "teacher portrait",
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    // Append all string values
    for (const [key, value] of Object.entries(values)) {
      if (key !== 'image') {
         formData.append(key, value as any);
      }
    }
    
    // Handle file upload
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

    const result = await saveTeacher(formData, teacher?.id);

    if (result.success) {
        toast({
        title: "সফল হয়েছে",
        description: `শিক্ষকের তথ্য সফলভাবে ${teacher ? 'আপডেট' : 'তৈরি'} করা হয়েছে।`,
        });
        router.push("/admin/teachers");
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
  const currentImageSrc = teacher?.image ? toDataURL(teacher.image as Buffer) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><User /> শিক্ষকের তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem> <Label htmlFor="name">নাম</Label> <Input id="name" {...register("name")} /> <FormMessage name="name" /> </FormItem>
            <FormItem> <Label htmlFor="role">পদবি</Label> <Input id="role" {...register("role")} /> <FormMessage name="role" /> </FormItem>
            <FormItem> <Label htmlFor="email">ইমেইল</Label> <Input id="email" type="email" {...register("email")} /> <FormMessage name="email" /> </FormItem>
            <FormItem> <Label htmlFor="phone">ফোন</Label> <Input id="phone" {...register("phone")} /> <FormMessage name="phone" /> </FormItem>
            <FormItem className="md:col-span-2"> <Label htmlFor="address">ঠিকানা</Label> <Textarea id="address" {...register("address")} /> <FormMessage name="address" /> </FormItem>
            <FormItem className="md:col-span-2"> <Label htmlFor="educational_qualification">শিক্ষাগত যোগ্যতা</Label> <Textarea id="educational_qualification" {...register("educational_qualification")} /> <FormMessage name="educational_qualification" /> </FormItem>
            <FormItem className="md:col-span-2"> <Label htmlFor="experience">অভিজ্ঞতা</Label> <Textarea id="experience" {...register("experience")} /> <FormMessage name="experience" /> </FormItem>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><Upload /> ছবি আপলোড</CardTitle>
          </CardHeader>
          <CardContent>
            <FormItem>
                <Label htmlFor="image">শিক্ষকের ছবি</Label>
                <Input id="image" type="file" accept="image/*" {...register("image")} />
                <p className="text-xs text-muted-foreground">{teacher ? "নতুন ছবি আপলোড করলে পুরোনো ছবিটি প্রতিস্থাপিত হবে।" : ""}</p>
                <FormMessage name="image" />
            </FormItem>
            {currentImageSrc && (
                <div className="mt-4">
                    <Label>বর্তমান ছবি</Label>
                    <img src={currentImageSrc} alt="Teacher's current photo" className="mt-2 h-24 w-24 rounded-md object-cover" />
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
