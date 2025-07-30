
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// In a real app, this phone number would come from a secure source or config
const SUPPORT_PHONE_NUMBER = "01701034883"; 

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            পাসওয়ার্ড রিসেট
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground space-y-4">
            <p>
                আপনার পাসওয়ার্ড রিসেট করতে, অনুগ্রহ করে নিচের নম্বরে আমাদের সাথে যোগাযোগ করুন।
            </p>
            <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-md">
                <Phone className="h-5 w-5 text-primary" />
                <a href={`tel:${SUPPORT_PHONE_NUMBER}`} className="text-lg font-bold text-primary hover:underline">
                    {SUPPORT_PHONE_NUMBER}
                </a>
            </div>
            <p className="text-xs">
                নিরাপত্তার জন্য, আমরা ফোনে আপনার পরিচয় যাচাই করব।
            </p>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                লগইন পেজে ফিরে যান
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
