
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Phone, Calendar, BookOpen, FilePenLine } from 'lucide-react';
import { getAdmissionGuidelines, getAdmissionImportantDates, getAdmissionPageContent } from "@/lib/admission-data";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

type IconName = keyof typeof LucideIcons;

const IconComponent = ({ name }: { name: string | null | undefined }) => {
    if (!name) return <BookOpen className="h-6 w-6 text-primary" />;
    const Icon = LucideIcons[name as IconName] as React.ElementType;
    if (!Icon) {
        return <BookOpen className="h-6 w-6 text-primary" />;
    }
    return <Icon className="h-6 w-6 text-primary" />;
};


export default async function AdmissionGuidelinesPage() {
  const pageContent = await getAdmissionPageContent();
  const importantDates = await getAdmissionImportantDates();
  const guidelines = await getAdmissionGuidelines();
  
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">{pageContent.title}</h1>
          <p className="text-muted-foreground mt-2">{pageContent.subtitle}</p>
        </div>

        <Card className="shadow-lg border-primary/20 mb-12">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                        <Calendar className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl text-primary font-headline">গুরুত্বপূর্ণ তারিখ ও সময়</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                    {importantDates.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                            <span className="font-semibold text-foreground w-40">{item.label}</span>
                            <span>{item.date_value}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <div>
            <h2 className="text-2xl font-bold text-primary mb-6 text-center font-headline">আবেদন প্রক্রিয়া ও নিয়মাবলী</h2>
            <Accordion type="single" collapsible className="w-full">
                {guidelines.map((item, index) => (
                    <AccordionItem value={`item-${index+1}`} key={item.id}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                            <div className="flex items-center gap-3">
                                <IconComponent name={item.icon} />
                                <span>{item.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-12 text-base text-muted-foreground leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: item.content }} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

        <div className="mt-12 text-center space-y-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                 <Button size="lg" asChild>
                    <a href={pageContent.form_download_url || '#'} download>
                        <Download className="mr-2 h-5 w-5" />
                        ভর্তি ফরম ডাউনলোড করুন
                    </a>
                </Button>
                <Button size="lg" asChild variant="outline">
                    <Link href="/forms/admission-apply">
                        <FilePenLine className="mr-2 h-5 w-5" />
                        অনলাইনে আবেদন করুন
                    </Link>
                </Button>
            </div>
            <Card className="max-w-md mx-auto bg-primary/5 border-primary/20 p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{pageContent.contact_title}</h3>
                <p className="text-muted-foreground">{pageContent.contact_description}</p>
                <div className="flex items-center justify-center gap-2 mt-4 text-foreground font-semibold">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{pageContent.contact_phone}</span>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
