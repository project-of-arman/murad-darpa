
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getSyllabuses, Syllabus } from '@/lib/syllabus-data';

export default function SyllabusPage() {
  const [allSyllabuses, setAllSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSyllabuses() {
      setLoading(true);
      const data = await getSyllabuses();
      setAllSyllabuses(data);
      setLoading(false);
    }
    fetchSyllabuses();
  }, []);
  
  const syllabusByClass = allSyllabuses.reduce((acc, syllabus) => {
    (acc[syllabus.class_name] = acc[syllabus.class_name] || []).push(syllabus);
    return acc;
  }, {} as Record<string, Syllabus[]>);

  const classes = Object.keys(syllabusByClass);
  const [selectedClass, setSelectedClass] = useState(classes[0] || '');
  
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  if (loading) {
      return (
          <div className="bg-white py-16">
              <div className="container mx-auto px-4">
                  <p>লোড হচ্ছে...</p>
              </div>
          </div>
      )
  }

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">সিলেবাস</h1>
          <p className="text-muted-foreground mt-2">আপনার শ্রেণীর সিলেবাস ডাউনলোড করুন</p>
        </div>

        <Card className="shadow-lg border-primary/20">
            <CardHeader>
                 <Tabs value={selectedClass} onValueChange={setSelectedClass} className="w-full">
                    <div className="flex justify-center mb-4">
                        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 h-auto">
                        {classes.map((c) => (
                            <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
                        ))}
                        </TabsList>
                    </div>
                </Tabs>
                <CardTitle className="text-2xl text-primary font-headline text-center">{selectedClass} সিলেবাস</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table className="border">
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px] font-bold">ক্রমিক নং</TableHead>
                                <TableHead className="font-bold">বিষয়</TableHead>
                                <TableHead className="text-right font-bold">ডাউনলোড</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(syllabusByClass[selectedClass] || []).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{item.subject}</TableCell>
                                    <TableCell className="text-right">
                                        {item.file_url ? (
                                            <Button asChild variant="outline" size="sm">
                                                <a href={item.file_url} download target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    ডাউনলোড
                                                </a>
                                            </Button>
                                        ): (
                                            <span className="text-muted-foreground text-xs">ফাইল নেই</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
