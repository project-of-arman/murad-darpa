
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Page, savePage } from "@/lib/page-data";
import { toBuffer } from "@/lib/utils";
import { Upload, StickyNote } from "lucide-react";
import RichTextEditor from "./rich-text-editor";

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
  slug: z.string().min(1, "স্লাগ আবশ্যক").regex(/^[a-z0-9-]+$/, "শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন ব্যবহার করুন"),
  description: z.string().optional(),
  thumbnail: imageSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function PageForm({ page }: { page?: Page }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      description: page?.description || "",
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    formData.append('title', values.title);
    formData.append('slug', values.slug);
    formData.append('description', values.description || '');
    
    if (values.thumbnail && values.thumbnail.length > 0) {
      try {
        const imageBuffer = await toBuffer(values.thumbnail[0]);
        formData.append('thumbnail', new Blob([imageBuffer]));
      } catch (error) {
         toast({ title: "ফাইল আপলোড ত্রুটি", description: "ছবি প্রসেস করার সময় একটি সমস্যা হয়েছে।", variant: "destructive" });
         return;
      }
    }

    const result = await savePage(formData, page?.id);

    if (result.success) {
        toast({ title: "সফল হয়েছে", description: `পেজ সফলভাবে ${page ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
        router.push("/admin/pages");
        router.refresh();
    } else {
        toast({ title: "ত্রুটি", description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।", variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><StickyNote /> পেজের তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormItem> 
                <Label htmlFor="title">শিরোনাম</Label> 
                <Input id="title" {...register("title")} /> 
                <FormMessage name="title" /> 
            </FormItem>
            <FormItem> 
                <Label htmlFor="slug">স্লাগ (URL)</Label> 
                <Input id="slug" {...register("slug")} /> 
                <p className="text-xs text-muted-foreground">পেজের লিঙ্ক হবে: yoursite.com/your-slug</p>
                <FormMessage name="slug" /> 
            </FormItem>
             <FormItem>
                <Label>বিবরণ</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
                />
                <FormMessage name="description" />
            </FormItem>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><Upload /> থাম্বনেইল ছবি</CardTitle>
          </CardHeader>
          <CardContent>
            <FormItem>
                <Label htmlFor="thumbnail">ছবি আপলোড</Label>
                <Input id="thumbnail" type="file" accept="image/*" {...register("thumbnail")} />
                <p className="text-xs text-muted-foreground">{page ? "নতুন ছবি আপলোড করলে পুরোনো ছবিটি প্রতিস্থাপিত হবে।" : ""}</p>
                <FormMessage name="thumbnail" />
            </FormItem>
            {page?.thumbnail && (
                <div className="mt-4">
                    <Label>বর্তমান ছবি</Label>
                    <img src={page.thumbnail} alt="Current thumbnail" className="mt-2 h-24 w-auto rounded-md object-cover" />
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
