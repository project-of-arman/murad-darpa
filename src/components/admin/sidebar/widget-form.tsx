
"use client";

import * as React from "react";
import { useForm, FormProvider, Controller, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SidebarWidget, saveSidebarWidget } from "@/lib/sidebar-data";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form-item";
import * as LucideIcons from "lucide-react";
import { Trash2, PlusCircle } from "lucide-react";
import type { Page } from "@/lib/page-data";
import { useState, useEffect } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const fileSchema = z.any()
  .refine(files => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `ফাইলের সর্বোচ্চ আকার 2MB।`)
  .refine(
    files => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "শুধুমাত্র .jpg, .jpeg, .png, .webp, এবং .gif ফরম্যাট সাপোর্ট করবে।"
  ).optional();

const linkSchema = z.object({
  text: z.string().min(1, "লিংকের টেক্সট আবশ্যক"),
  url: z.string().min(1, "লিংকের URL আবশ্যক"),
});

const formSchema = z.object({
  widget_type: z.enum(['profile', 'links', 'image_link']),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  link_url: z.string().optional(),
  link_text: z.string().optional(),
  links: z.array(linkSchema).optional(),
  sort_order: z.coerce.number().int(),
  image_url: fileSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function WidgetForm({ widget, pages }: { widget?: SidebarWidget, pages: Page[] }) {
    const { toast } = useToast();
    const router = useRouter();

    const defaultLinks = React.useMemo(() => {
        if (widget?.widget_type === 'links' && widget.content) {
            try {
                return JSON.parse(widget.content);
            } catch {
                return [];
            }
        }
        return [];
    }, [widget]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            widget_type: widget?.widget_type || 'profile',
            title: widget?.title || "",
            subtitle: widget?.subtitle || "",
            link_url: widget?.link_url || "",
            link_text: widget?.link_text || "",
            links: defaultLinks,
            sort_order: widget?.sort_order || 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "links"
    });

    const watchedWidgetType = useWatch({
        control: form.control,
        name: "widget_type",
    });

    async function onSubmit(values: FormValues) {
        const formData = new FormData();
        
        let content: string | null = null;
        if (values.widget_type === 'links' && values.links) {
            content = JSON.stringify(values.links);
        }

        formData.append('widget_type', values.widget_type);
        formData.append('title', values.title || '');
        formData.append('subtitle', values.subtitle || '');
        formData.append('link_url', values.link_url || '');
        formData.append('link_text', values.link_text || '');
        formData.append('sort_order', values.sort_order.toString());
        if (content) {
            formData.append('content', content);
        }

        const imageFile = values.image_url?.[0];
        if (imageFile) {
            formData.append('image_url', imageFile);
        }

        const result = await saveSidebarWidget(formData, widget?.id);

        if (result.success) {
            toast({ title: "সফল!", description: `উইজেট সফলভাবে ${widget ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
            router.push("/admin/sidebar");
            router.refresh();
        } else {
            toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                <FormItem>
                    <Label>উইজেটের ধরণ</Label>
                    <Controller
                        name="widget_type"
                        control={form.control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={!!widget}>
                                <SelectTrigger>
                                    <SelectValue placeholder="ধরণ নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="profile">প্রোফাইল</SelectItem>
                                    <SelectItem value="links">লিংক তালিকা</SelectItem>
                                    <SelectItem value="image_link">ছবি লিংক</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormItem>

                {watchedWidgetType && (
                    <>
                        <FormItem>
                            <Label htmlFor="title">শিরোনাম</Label>
                            <Input id="title" {...form.register("title")} />
                        </FormItem>

                        {watchedWidgetType === 'profile' && (
                            <FormItem>
                                <Label htmlFor="subtitle">উপ-শিরোনাম (যেমন: নাম)</Label>
                                <Input id="subtitle" {...form.register("subtitle")} />
                            </FormItem>
                        )}

                        {(watchedWidgetType === 'profile' || watchedWidgetType === 'image_link') && (
                            <FormItem>
                                <Label htmlFor="image_url">ছবি</Label>
                                <Input id="image_url" type="file" accept="image/*,.gif" {...form.register("image_url")} />
                                {widget?.image_url && <img src={widget.image_url} alt="Current" className="h-20 w-auto mt-2 rounded-md" />}
                            </FormItem>
                        )}

                        {(watchedWidgetType === 'profile' || watchedWidgetType === 'image_link') && (
                             <FormItem>
                                <Label htmlFor="link_url">লিংক URL (ঐচ্ছিক)</Label>
                                <Input id="link_url" {...form.register("link_url")} />
                            </FormItem>
                        )}

                        {watchedWidgetType === 'profile' && (
                             <FormItem>
                                <Label htmlFor="link_text">লিংকের টেক্সট (ঐচ্ছিক)</Label>
                                <Input id="link_text" {...form.register("link_text")} />
                            </FormItem>
                        )}

                        {watchedWidgetType === 'links' && (
                            <div className="space-y-4 rounded-md border p-4">
                                <Label className="text-base font-medium">লিংক তালিকা</Label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                        <FormItem>
                                            <Label htmlFor={`links.${index}.text`}>লিংক টেক্সট</Label>
                                            <Input {...form.register(`links.${index}.text`)} />
                                        </FormItem>
                                        <div className="space-y-2">
                                            <Label htmlFor={`links.${index}.url`}>URL</Label>
                                            <div className="flex items-center gap-2">
                                                <Input {...form.register(`links.${index}.url`)} />
                                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                         <div className="md:col-span-2 space-y-2">
                                             <Label>অথবা একটি পেজ নির্বাচন করুন</Label>
                                            <div className="flex gap-2">
                                                 <Select onValueChange={(slug) => form.setValue(`links.${index}.url`, `/${slug}`)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="পেজ নির্বাচন করে URL যুক্ত করুন" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {pages.map(page => (
                                                            <SelectItem key={page.id} value={page.slug}>
                                                                {page.title} (/{page.slug})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ text: '', url: '' })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> নতুন লিংক যোগ করুন
                                </Button>
                            </div>
                        )}

                        <FormItem>
                            <Label htmlFor="sort_order">অবস্থান (Sort Order)</Label>
                            <Input id="sort_order" type="number" {...form.register("sort_order")} />
                        </FormItem>
                    </>
                )}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>বাতিল করুন</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
