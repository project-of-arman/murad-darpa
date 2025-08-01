
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AdminAccount, saveUser } from "@/lib/actions/auth-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  role: z.enum(['admin', 'moderator', 'visitor']),
  password: z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof userFormSchema>;

export function UserForm({ user }: { user?: AdminAccount }) {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'visitor',
    },
  });

  async function onSubmit(values: FormValues) {
    if (values.password && values.password !== values.confirmPassword) {
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
    formData.append('role', values.role);
    if (values.password) {
      formData.append('password', values.password);
    }
    
    const result = await saveUser(formData, user?.id);
    
    if (result.success) {
      toast({ title: "সফল!", description: `ব্যবহারকারী সফলভাবে ${user ? 'আপডেট' : 'তৈরি'} করা হয়েছে।` });
      router.push('/admin/users');
    } else {
      toast({ title: "ত্রুটি", description: result.error, variant: "destructive" });
    }
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
  const FormMessage = ({ name }: { name: keyof FormValues }) => errors[name] ? <p className="text-sm font-medium text-destructive">{errors[name]?.message as string}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormItem>
          <Label htmlFor="username">ইউজারনেম</Label>
          <Input id="username" {...register("username")} />
          <FormMessage name="username" />
        </FormItem>
        <FormItem>
          <Label htmlFor="email">ইমেইল</Label>
          <Input id="email" type="email" {...register("email")} />
          <FormMessage name="email" />
        </FormItem>
        <FormItem>
          <Label htmlFor="phone">ফোন নম্বর</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          <FormMessage name="phone" />
        </FormItem>
         <FormItem>
          <Label>ভূমিকা (Role)</Label>
          <Controller name="role" control={control} render={({field}) => (
               <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="ভূমিকা নির্বাচন করুন" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                  </SelectContent>
              </Select>
          )} />
          <FormMessage name="role" />
        </FormItem>
        <FormItem>
          <Label htmlFor="password">পাসওয়ার্ড {user && '(খালি রাখলে পরিবর্তন হবে না)'}</Label>
          <Input id="password" type="password" {...register("password")} />
          <FormMessage name="password" />
        </FormItem>
        <FormItem>
          <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          <FormMessage name="confirmPassword" />
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

