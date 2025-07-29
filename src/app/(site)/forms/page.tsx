
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Download, FilePenLine } from 'lucide-react';
import Link from "next/link";

const formsData = [
  { name: "ভর্তি আবেদন", href: "/forms/admission-apply", fileUrl: "/forms/admission-form.pdf" },
  { name: "ছাড়পত্র আবেদন", href: "/forms/transfer-certificate-apply", fileUrl: "/forms/transfer-certificate-form.pdf" },
  { name: "প্রশংসাপত্র আবেদন", href: "/forms/testimonial-apply", fileUrl: "/forms/testimonial-form.pdf" },
  { name: "সনদপত্র আবেদন", href: "/forms/certificate-apply", fileUrl: "/forms/certificate-form.pdf" },
  { name: "প্রবেশপত্র আবেদন", href: "/forms/admit-card-apply", fileUrl: "/forms/admit-card-form.pdf" },
  { name: "মার্কশিট আবেদন", href: "/forms/marksheet-apply", fileUrl: "/forms/marksheet-form.pdf" },
  { name: "অনুপস্থিতির ছুটির আবেদন", href: "/forms/leave-apply", fileUrl: "/forms/leave-form.pdf" },
  { name: "লাইব্রেরী কার্ড আবেদন", href: "/forms/library-card-apply", fileUrl: "/forms/library-card-form.pdf" },
  { name: "অভিভাবকের সম্মতিপত্র", href: "/forms/guardian-consent-apply", fileUrl: "/forms/guardian-consent-form.pdf" },
  { name: "বিষয় পরিবর্তনের আবেদন", href: "/forms/subject-change-apply", fileUrl: "/forms/subject-change-form.pdf" },
  { name: "উপবৃত্তি আবেদন", href: "/forms/stipend-apply", fileUrl: "/forms/stipend-form.pdf" },
];

export default function FormsPage() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">সকল ফরমস</h1>
          <p className="text-muted-foreground mt-2">প্রয়োজনীয় ফরমসমূহ এখান থেকে ডাউনলোড করুন অথবা অনলাইনে আবেদন করুন</p>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block">
            <Card className="shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-primary font-headline text-center">ফরম তালিকা</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table className="border">
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-bold">ফরমের নাম</TableHead>
                                    <TableHead className="text-center font-bold">অনলাইন আবেদন</TableHead>
                                    <TableHead className="text-center font-bold">অফলাইন ডাউনলোড</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formsData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-center">
                                            <Button asChild variant="default" size="sm">
                                                <Link href={item.href}>
                                                    <FilePenLine className="mr-2 h-4 w-4" />
                                                    আবেদন করুন
                                                </Link>
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button asChild variant="outline" size="sm">
                                                <a href={item.fileUrl} download>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    ডাউনলোড
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
            {formsData.map((item, index) => (
                <Card key={index} className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-end gap-4">
                         <Button asChild variant="default" size="sm" className="flex-1">
                            <Link href={item.href}>
                                <FilePenLine className="mr-2 h-4 w-4" />
                                আবেদন করুন
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="flex-1">
                            <a href={item.fileUrl} download>
                                <Download className="mr-2 h-4 w-4" />
                                ডাউনলোড
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
