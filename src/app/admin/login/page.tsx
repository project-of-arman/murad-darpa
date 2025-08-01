
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import { login } from '@/lib/actions/auth-actions';
import Link from 'next/link';

interface LoginPageProps {
  onLoginSuccess: (identifier: string) => void;
}

const loginSchema = z.object({
    identifier: z.string().min(1, "Identifier is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
      resolver: zodResolver(loginSchema)
  });

  const handleLogin = async (values: LoginValues) => {
    const formData = new FormData();
    formData.append('identifier', values.identifier);
    formData.append('password', values.password);
    
    const result = await login(formData);

    if (result.success) {
      onLoginSuccess(values.identifier);
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin dashboard.',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: result.error || 'Incorrect credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Lock className="h-6 w-6" />
            Admin Login
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(handleLogin)}>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="identifier">Username, Email, or Phone</Label>
              <Input
                id="identifier"
                {...register("identifier")}
                placeholder="Enter your username, email, or phone"
              />
              {errors.identifier && <p className="text-sm text-destructive mt-1">{errors.identifier.message}</p>}
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/admin/forgot-password"
                        className="text-sm text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter your password"
              />
               {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
