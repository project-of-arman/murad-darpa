
"use client";

import { useForm, Controller } from "react-hook-form";
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
import { NavLink, saveNavLink } from "@/lib/nav-data";
import * as LucideIcons from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import type { Page } from "@/lib/page-data";

const IconComponent = ({ name }: { name: string | null | undefined }) => {
    if (!name) return null;
    const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
    return Icon ? <Icon className="h-4 w-4" /> : null;
};

const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  href: z.string().optional(),
  parent_id: z.coerce.number().optional().nullable(),
  sort_order: z.coerce.number().int(),
  icon: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const educationIcons = [
  'Home', 'Book', 'BookOpen', 'GraduationCap', 'Award', 'Trophy', 
  'Users', 'User', 'ClipboardList', 'Calendar', 'FileText', 'Newspaper', 
  'Library', 'Landmark', 'Building', 'PenSquare', 'Edit', 'Info', 'MessageSquare', 'GalleryVerticalEnd'
].sort();

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
    { title: 'Routine', href: '/routine' },
    { title: 'Syllabus', href: '/syllabus' },
    { title: 'Blog', href: '/blog' },
    { title: 'Notice', href: '/notice' },
];


export function NavLinkForm({ link, allLinks, pages, parentId }: { link?: NavLink, allLinks: NavLink[], pages: Page[], parentId?: number }) {
  const { toast } = useToast();
  const router = useRouter();
  
  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: link?.title || "",
      href: link?.href || "",
      parent_id: link?.parent_id || parentId || null,
      sort_order: link?.sort_order || 0,
      icon: link?.icon || null,
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveNavLink(values, link?.id);
    if (result.success) {
      toast({ title: "সফল!", description: `লিংক সফলভাবে ${link ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
      router.push('/admin/nav-manager');
      router.refresh();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2"><Label htmlFor="title">শিরোনাম</Label><Input id="title" {...register("title")} />{errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}</div>
        <div className="space-y-2"><Label htmlFor="href">লিংক (URL)</Label><Input id="href" {...register("href")} /><p className="text-xs text-muted-foreground">ড্রপডাউনের জন্য এটি খালি রাখুন।</p>{errors.href && <p className="text-sm font-medium text-destructive">{errors.href.message}</p>}</div>
        <div className="space-y-2 md:col-span-2">
            <Label>অথবা একটি পেজ নির্বাচন করে URL যুক্ত করুন</Label>
             <Select onValueChange={(value) => setValue('href', value, { shouldValidate: true })}>
                <SelectTrigger>
                    <SelectValue placeholder="পেজ নির্বাচন করুন" />
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
        <div className="space-y-2">
            <Label>Parent Link (For Submenu)</Label>
            <Controller
                name="parent_id"
                control={control}
                render={({ field }) => (
                     <Select 
                        onValueChange={(value) => field.onChange(value === 'none' ? null : Number(value))} 
                        value={field.value?.toString() ?? 'none'}
                     >
                        <SelectTrigger><SelectValue placeholder="No Parent" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Parent</SelectItem>
                            {allLinks.filter(l => !l.parent_id && l.id !== link?.id).map(l => (
                                <SelectItem key={l.id} value={l.id.toString()}>{l.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
        <div className="space-y-2">
            <Label>আইকন (ঐচ্ছিক)</Label>
            <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} value={field.value || 'none'}>
                        <SelectTrigger><SelectValue placeholder="আইকন নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                            <ScrollArea className="h-72">
                                <SelectItem value="none">No Icon</SelectItem>
                                {educationIcons.map(iconName => (
                                    <SelectItem key={iconName} value={iconName}>
                                        <div className="flex items-center gap-2">
                                            <IconComponent name={iconName} />
                                            <span>{iconName}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </ScrollArea>
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
        <div className="space-y-2 md:col-span-2"><Label htmlFor="sort_order">অবস্থান (Sort Order)</Label><Input id="sort_order" type="number" {...register("sort_order")} />{errors.sort_order && <p className="text-sm font-medium text-destructive">{errors.sort_order.message}</p>}</div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>বাতিল করুন</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}</Button>
      </div>
    </form>
  );
}
