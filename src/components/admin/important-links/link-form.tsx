
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Link as LinkType, saveLink } from "@/lib/important-links-data";
import { Page } from "@/lib/page-data";

const formSchema = z.object({
  text: z.string().min(1, "লিংকের টেক্সট আবশ্যক"),
  href: z.string().optional(),
  sort_order: z.coerce.number().int().min(0, "অবস্থান আবশ্যক"),
});

type FormValues = z.infer<typeof formSchema>;

export function LinkForm({ link, groupId, pages }: { link?: LinkType, groupId: number, pages: Page[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState("");
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: link?.text || "",
      href: link?.href || "",
      sort_order: link?.sort_order || 0,
    },
  });

  const handleInsertSlug = () => {
    if (selectedSlug) {
      setValue('href', `/${selectedSlug}`, { shouldValidate: true });
    }
  }

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    
    formData.append('text', values.text);
    formData.append('href', values.href || '');
    formData.append('sort_order', values.sort_order.toString());
    formData.append('group_id', groupId.toString());

    const result = await saveLink(formData, link?.id);

    if (result.success) {
        toast({ title: "সফল হয়েছে", description: `লিংক সফলভাবে ${link ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
        router.push("/admin/important-links");
        router.refresh();
    } else {
        toast({ title: "ত্রুটি", description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।", variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormItem> <Label htmlFor="text">লিংকের টেক্সট</Label> <Input id="text" {...register("text")} /> <FormMessage name="text" /> </FormItem>
        <FormItem> <Label htmlFor="href">লিংকের URL</Label> <Input id="href" {...register("href")} /> <FormMessage name="href" /> </FormItem>
        
        {pages.length > 0 && (
            <FormItem>
                <Label>অথবা একটি পেজ নির্বাচন করুন</Label>
                <div className="flex gap-2">
                    <Select onValueChange={setSelectedSlug} value={selectedSlug}>
                        <SelectTrigger>
                            <SelectValue placeholder="পেজ নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            {pages.map(page => (
                                <SelectItem key={page.id} value={page.slug}>
                                    {page.title} (/{page.slug})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleInsertSlug} disabled={!selectedSlug}>
                        URL যুক্ত করুন
                    </Button>
                </div>
            </FormItem>
        )}

        <FormItem> <Label htmlFor="sort_order">অবস্থান (Sort Order)</Label> <Input id="sort_order" type="number" {...register("sort_order")} /> <FormMessage name="sort_order" /> </FormItem>
        
         <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => router.back()}>বাতিল করুন</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
    </form>
  );
}
