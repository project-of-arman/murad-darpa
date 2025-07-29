
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
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { NavLink, saveNavLink } from "@/lib/nav-data";
import * as LucideIcons from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const iconNames = Object.keys(LucideIcons).filter(k => 
    typeof LucideIcons[k as keyof typeof LucideIcons] === 'object' && 
    k[0] === k[0].toUpperCase()
).sort();

const IconComponent = ({ name }: { name: string }) => {
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

export function NavLinkForm({ link, allLinks, parentId }: { link?: NavLink, allLinks: NavLink[], parentId?: number }) {
  const { toast } = useToast();
  const router = useRouter();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
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
        <div className="space-y-2">
            <Label>Parent Link (For Submenu)</Label>
            <Controller
                name="parent_id"
                control={control}
                render={({ field }) => (
                     <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                        <SelectTrigger><SelectValue placeholder="No Parent" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">No Parent</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger><SelectValue placeholder="আইকন নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                            <ScrollArea className="h-72">
                                <SelectItem value="">No Icon</SelectItem>
                                {iconNames.map(iconName => (
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
