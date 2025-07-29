
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { createAdmin } from '@/lib/actions/auth-actions';

interface AdminSetupPageProps {
    onSetupSuccess: () => void;
}

export default function AdminSetupPage({ onSetupSuccess }: AdminSetupPageProps) {
    const { toast } = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match.',
                variant: 'destructive',
            });
            return;
        }

        const formData = new FormData(e.target as HTMLFormElement);
        const result = await createAdmin(formData);
        
        if (result.success) {
            toast({
                title: 'Admin Account Created',
                description: 'You can now log in with your new account.',
            });
            onSetupSuccess();
        } else {
            toast({
                title: 'Setup Failed',
                description: result.error || 'Could not create admin account.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                        <UserPlus className="h-6 w-6" />
                        Admin Account Setup
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSetup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Choose a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Create Admin Account
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
