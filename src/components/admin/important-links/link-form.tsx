
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
  SelectGroup,
  SelectLabel,
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

const stockPages = [
    { title: 'School Details', href: '/school-details' },
    { title: 'Committee', href: '/committee' },
    { title: 'Admission Guidelines', href: '/admission-guidelines' },
    { title: 'Results', href: '/results' },
    { title: 'All Forms', href: '/forms' },
    { title: 'Contact', href: '/contact' },
    { title: 'Image Gallery', href: '/gallery' },
    { title: 'Video Gallery', href: '/videos' },
    { title: 'Students', href: '/students' },
    { title: 'Syllabus', href: '/syllabus' },
];


export function LinkForm({ link, groupId, pages }: { link?: LinkType, groupId: number, pages: Page[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: link?.text || "",
      href: link?.href || "",
      sort_order: link?.sort_order || 0,
    },
  });

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
        
        <FormItem>
            <Label>অথবা একটি পেজ নির্বাচন করুন</Label>
            <div className="flex gap-2">
                <Select onValueChange={(value) => setValue('href', value, { shouldValidate: true })}>
                    <SelectTrigger>
                        <SelectValue placeholder="পেজ নির্বাচন করে URL যুক্ত করুন" />
                    </SelectTrigger>
                    <SelectContent>
                         <SelectGroup>
                            <SelectLabel>সাধারণ পেজ</SelectLabel>
                            {stockPages.map(page => (
                                <SelectItem key={page.href} value={page.href}>
                                    {page.title} ({page.href})
                                </SelectItem>
                            ))}
                        </SelectGroup>
                        {pages.length > 0 && (
                            <SelectGroup>
                                <SelectLabel>আপনার তৈরি পেজ</SelectLabel>
                                {pages.map(page => (
                                    <SelectItem key={page.id} value={`/${page.slug}`}>
                                        {page.title} (/{page.slug})
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </FormItem>

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
