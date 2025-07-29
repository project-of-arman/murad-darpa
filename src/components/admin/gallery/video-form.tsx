
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
import { Video, saveVideo } from "@/lib/video-data";

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
  youtube_url: z.string().url("অবৈধ ইউটিউব URL"),
  description: z.string().optional(),
  dataAiHint: z.string().optional(),
  thumbnail: imageSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function VideoForm({ video }: { video?: Video }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: video?.title || "",
      youtube_url: video ? `https://www.youtube.com/watch?v=${video.videoUrl.split('/').pop()}` : "",
      description: video?.description || "",
      dataAiHint: video?.dataAiHint || "school event",
    },
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('youtube_url', values.youtube_url);
    formData.append('description', values.description || '');
    formData.append('dataAiHint', values.dataAiHint || 'youtube video');

    if (values.thumbnail && values.thumbnail.length > 0) {
        formData.append('thumbnail', values.thumbnail[0]);
    }

    const result = await saveVideo(formData, video?.id);

    if (result.success) {
        toast({ title: "সফল হয়েছে", description: `ভিডিও সফলভাবে ${video ? 'আপডেট' : 'যোগ'} করা হয়েছে।` });
        router.push("/admin/gallery/videos");
        router.refresh();
    } else {
        toast({ title: "ত্রুটি", description: result.error || "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।", variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormItem> 
          <Label htmlFor="title">শিরোনাম</Label> 
          <Input id="title" {...register("title")} /> 
          <FormMessage name="title" /> 
        </FormItem>
        <FormItem>
          <Label htmlFor="youtube_url">ইউটিউব ভিডিওর URL</Label>
          <Input id="youtube_url" placeholder="https://www.youtube.com/watch?v=..." {...register("youtube_url")} />
          <p className="text-xs text-muted-foreground">ইউটিউব থেকে ভিডিওর শেয়ার লিঙ্ক এখানে দিন।</p>
          <FormMessage name="youtube_url" />
        </FormItem>
        <FormItem> 
          <Label htmlFor="description">বিবরণ</Label> 
          <Textarea id="description" {...register("description")} />
          <FormMessage name="description" /> 
        </FormItem>
        <FormItem>
          <Label htmlFor="thumbnail">থাম্বনেইল ছবি (ঐচ্ছিক)</Label>
          <Input id="thumbnail" type="file" accept="image/*" {...register("thumbnail")} />
          <p className="text-xs text-muted-foreground">নতুন ছবি আপলোড করলে এটি ইউটিউবের থাম্বনেইলকে পরিবর্তন করবে।</p>
          <FormMessage name="thumbnail" />
        </FormItem>
        {video?.thumbnail && (
          <div className="mt-2">
            <Label>বর্তমান থাম্বনেইল</Label>
            <img src={video.thumbnail} alt="Current thumbnail" className="mt-1 h-24 w-auto rounded-md object-cover" />
          </div>
        )}
        <FormItem> 
          <Label htmlFor="dataAiHint">AI Hint (Optional)</Label> 
          <Input id="dataAiHint" {...register("dataAiHint")} /> 
          <FormMessage name="dataAiHint" /> 
        </FormItem>
        <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => router.back()}>বাতিল করুন</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
    </form>
  );
}
