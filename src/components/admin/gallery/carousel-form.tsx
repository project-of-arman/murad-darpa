
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CarouselItem, saveCarouselItem } from "@/lib/school-data";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageSchema = z.any()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 5MB।`)
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সাপোর্ট করবে।"
  );

const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  description: z.string().optional(),
  alt: z.string().optional(),
  dataAiHint: z.string().optional(),
  sort_order: z.coerce.number().int().min(0, "অবস্থান আবশ্যক"),
  src: imageSchema.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CarouselForm({ item }: { item?: CarouselItem }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      alt: item?.alt || "",
      dataAiHint: item?.dataAiHint || "school event",
      sort_order: item?.sort_order || 0,
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('alt', values.alt || values.title);
    formData.append('dataAiHint', values.dataAiHint || 'school event');
    formData.append('sort_order', values.sort_order.toString());
    
    if (values.src && values.src.length > 0) {
      formData.append('src', values.src[0]);
    }

    const result = await saveCarouselItem(formData, item?.id);

    if (result.success) {
        toast({ title: "সফল হয়েছে", description: `স্লাইড সফলভাবে ${item ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
        router.push("/admin/gallery/carousel");
        router.refresh();
    } else {
        toast({ title: "ত্রুটি", description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।", variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormItem> <Label htmlFor="title">শিরোনাম</Label> <Input id="title" {...register("title")} /> <FormMessage name="title" /> </FormItem>
        <FormItem> <Label htmlFor="description">বিবরণ</Label> <Textarea id="description" {...register("description")} /> <FormMessage name="description" /> </FormItem>
        <FormItem> <Label htmlFor="alt">ছবির Alt টেক্সট</Label> <Input id="alt" {...register("alt")} /> <FormMessage name="alt" /> </FormItem>
        <FormItem> <Label htmlFor="dataAiHint">AI Hint</Label> <Input id="dataAiHint" {...register("dataAiHint")} /> <FormMessage name="dataAiHint" /> </FormItem>
        <FormItem> <Label htmlFor="sort_order">অবস্থান (Sort Order)</Label> <Input id="sort_order" type="number" {...register("sort_order")} /> <FormMessage name="sort_order" /> </FormItem>
        <FormItem>
            <Label htmlFor="src">ছবি</Label>
            <Input id="src" type="file" accept="image/*" {...register("src")} />
            <p className="text-xs text-muted-foreground">{item ? "নতুন ছবি আপলোড করলে পুরোনো ছবিটি প্রতিস্থাপিত হবে।" : "নতুন স্লাইডের জন্য ছবি আবশ্যক।"}</p>
            <FormMessage name="src" />
        </FormItem>
        {item?.src && (
            <div className="mt-4">
                <Label>বর্তমান ছবি</Label>
                <img src={item.src} alt="Current slide photo" className="mt-2 h-24 w-auto rounded-md object-cover" />
            </div>
        )}
         <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => router.back()}>বাতিল করুন</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
    </form>
  );
}
