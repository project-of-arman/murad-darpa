
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateAdminCredentials, AdminAccount } from "@/lib/actions/auth-actions";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters.").optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminAccountForm({ account }: { account: AdminAccount | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        username: account?.username || '',
        email: account?.email || '',
        phone: account?.phone || '',
        newPassword: '',
        confirmPassword: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (values.newPassword && values.newPassword !== values.confirmPassword) {
      toast({
        title: "ত্রুটি",
        description: "নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    if (values.newPassword) {
      formData.append('newPassword', values.newPassword);
    }
    
    const result = await updateAdminCredentials(formData);
    
    if (result.success) {
      toast({ title: "সফল!", description: "অ্যাডমিন তথ্য সফলভাবে আপডেট করা হয়েছে।" });
      router.refresh();
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormItem>
          <Label htmlFor="username">ইউজারনেম</Label>
          <Input id="username" {...register("username")} />
          {errors.username && <p className="text-sm font-medium text-destructive">{errors.username.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="email">ইমেইল</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="phone">ফোন নম্বর</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="newPassword">নতুন পাসওয়ার্ড (খালি রাখলে পরিবর্তন হবে না)</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} />
          {errors.newPassword && <p className="text-sm font-medium text-destructive">{errors.newPassword.message}</p>}
        </FormItem>
        <FormItem>
          <Label htmlFor="confirmPassword">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>}
        </FormItem>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
        </Button>
      </div>
    </form>
  );
}
