
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getContactInfo, saveContactSubmission } from "@/lib/contact-data";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ContactInfo = {
    school_name: string;
    address: string;
    phone: string;
    email: string;
    map_embed_url: string;
};

const contactFormSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  email: z.string().email("অবৈধ ইমেইল ঠিকানা"),
  subject: z.string().min(1, "বিষয় আবশ্যক"),
  message: z.string().min(1, "বার্তা আবশ্যক"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
      resolver: zodResolver(contactFormSchema)
  });

  useEffect(() => {
    async function fetchContactInfo() {
      setLoading(true);
      const info = await getContactInfo();
      setContactInfo(info);
      setLoading(false);
    }
    fetchContactInfo();
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    const result = await saveContactSubmission(data);
    if (result.success) {
        toast({
            title: "ধন্যবাদ!",
            description: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে।",
        });
        reset();
    } else {
        toast({
            title: "ত্রুটি",
            description: result.error || "বার্তা পাঠাতে একটি সমস্যা হয়েছে।",
            variant: "destructive"
        });
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">যোগাযোগ ও ফিডব্যাক</h1>
          <p className="text-muted-foreground mt-2">আপনার যেকোনো জিজ্ঞাসা বা মতামতের জন্য আমাদের সাথে যোগাযোগ করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {loading ? (
                <>
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </>
            ) : (
                <>
                    <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-primary font-headline">আমাদের ঠিকানা</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">{contactInfo?.school_name}</h3>
                            <p className="text-muted-foreground">{contactInfo?.address}</p>
                        </div>
                        </div>
                        <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">ফোন</h3>
                            <a href={`tel:${contactInfo?.phone}`} className="text-muted-foreground hover:text-primary transition-colors">{contactInfo?.phone}</a>
                        </div>
                        </div>
                        <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">ইমেইল</h3>
                            <a href={`mailto:${contactInfo?.email}`} className="text-muted-foreground hover:text-primary transition-colors">{contactInfo?.email}</a>
                        </div>
                        </div>
                    </CardContent>
                    </Card>

                    <Card className="shadow-lg border-primary/20 overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe 
                                src={contactInfo?.map_embed_url}
                                width="100%" 
                                height="100%"
                                style={{border:0}} 
                                allowFullScreen
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="School Location"
                            ></iframe>
                        </div>
                    </Card>
                </>
            )}
          </div>

          {/* Feedback Form */}
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary font-headline">আপনার মতামত দিন</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">আপনার নাম</Label>
                  <Input id="name" placeholder="আপনার সম্পূর্ণ নাম" {...register("name")} />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="email">আপনার ইমেইল</Label>
                  <Input id="email" type="email" placeholder="আপনার ইমেইল ঠিকানা" {...register("email")} />
                   {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="subject">বিষয়</Label>
                  <Input id="subject" placeholder="আপনার বার্তার বিষয়" {...register("subject")} />
                  {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="message">বার্তা</Label>
                  <Textarea id="message" placeholder="আপনার বার্তা এখানে লিখুন..." {...register("message")} rows={5} />
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
                </div>
                <div>
                   <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'পাঠানো হচ্ছে...' : <><Send className="mr-2 h-5 w-5" />বার্তা পাঠান</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
