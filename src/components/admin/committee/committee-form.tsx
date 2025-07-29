
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CommitteeMember, saveCommitteeMember } from "@/lib/committee-data";
import { toBuffer, toDataURL } from "@/lib/utils";
import { User, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageSchema = z.any()
  .optional()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 5MB।`)
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সাপোর্ট করবে।"
  );


const formSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  role: z.string().min(1, "পদবি আবশ্যক"),
  sort_order: z.coerce.number().int().min(0, "অবস্থান আবশ্যক"),
  image: imageSchema,
  dataAiHint: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CommitteeForm({ member }: { member?: CommitteeMember }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      role: member?.role || "",
      sort_order: member?.sort_order || 0,
      dataAiHint: member?.dataAiHint || "committee member portrait",
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('role', values.role);
    formData.append('sort_order', values.sort_order.toString());
    formData.append('dataAiHint', values.dataAiHint || 'committee member portrait');
    
    if (values.image && values.image.length > 0) {
      try {
        const imageBuffer = await toBuffer(values.image[0]);
        formData.append('image', new Blob([imageBuffer]));
      } catch (error) {
         toast({ title: "ফাইল আপলোড ত্রুটি", description: "ছবি প্রসেস করার সময় একটি সমস্যা হয়েছে।", variant: "destructive" });
         return;
      }
    }

    const result = await saveCommitteeMember(formData, member?.id);

    if (result.success) {
        toast({ title: "সফল হয়েছে", description: `সদস্যের তথ্য সফলভাবে ${member ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
        router.push("/admin/committee");
        router.refresh();
    } else {
        toast({ title: "ত্রুটি", description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।", variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  const currentImageSrc = member?.image ? toDataURL(member.image as Buffer) : null;


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><User /> সদস্যের তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem> <Label htmlFor="name">নাম</Label> <Input id="name" {...register("name")} /> <FormMessage name="name" /> </FormItem>
            <FormItem> <Label htmlFor="role">পদবি</Label> <Input id="role" {...register("role")} /> <FormMessage name="role" /> </FormItem>
            <FormItem className="md:col-span-2"> <Label htmlFor="sort_order">অবস্থান (Sort Order)</Label> <Input id="sort_order" type="number" {...register("sort_order")} /> <FormMessage name="sort_order" /> </FormItem>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><Upload /> ছবি আপলোড</CardTitle>
          </CardHeader>
          <CardContent>
            <FormItem>
                <Label htmlFor="image">সদস্যের ছবি</Label>
                <Input id="image" type="file" accept="image/*" {...register("image")} />
                <p className="text-xs text-muted-foreground">{member ? "নতুন ছবি আপলোড করলে পুরোনো ছবিটি প্রতিস্থাপিত হবে।" : "নতুন সদস্যের জন্য ছবি আবশ্যক।"}</p>
                <FormMessage name="image" />
            </FormItem>
            {currentImageSrc && (
                <div className="mt-4">
                    <Label>বর্তমান ছবি</Label>
                    <img src={currentImageSrc} alt="Member's current photo" className="mt-2 h-24 w-24 rounded-md object-cover" />
                </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => router.back()}>বাতিল করুন</Button>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </form>
  );
}
