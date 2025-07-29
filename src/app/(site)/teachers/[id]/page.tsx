
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getTeacherById } from "@/lib/teacher-data";


export default async function TeacherDetailsPage({ params }: { params: { id: string } }) {
  const teacher = await getTeacherById(params.id);

  if (!teacher) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">শিক্ষক পাওয়া যায়নি।</h1>
        <Button asChild className="mt-4">
          <Link href="/staff">
            <ArrowLeft className="mr-2 h-4 w-4" />
            সকল শিক্ষক দেখুন
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-8">
                <Button asChild variant="outline">
                  <Link href="/staff">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    তালিকায় ফিরে যান
                  </Link>
                </Button>
            </div>
            <Card className="shadow-lg border-primary/20">
              <div className="flex flex-col md:flex-row gap-0">
                  <div className="w-full md:w-1/3 relative aspect-[3/4] md:aspect-auto">
                      <Image 
                        src={teacher.image} 
                        alt={teacher.name} 
                        fill 
                        className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
                        data-ai-hint={teacher.dataAiHint} 
                      />
                  </div>
                  <div className="w-full md:w-2/3">
                      <CardHeader>
                          <CardTitle className="text-3xl text-primary font-headline">{teacher.name}</CardTitle>
                          <p className="text-muted-foreground text-lg">{teacher.role}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                              <a href={`mailto:${teacher.email}`} className="text-muted-foreground hover:text-primary">{teacher.email}</a>
                          </div>
                          <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                              <a href={`tel:${teacher.phone}`} className="text-muted-foreground hover:text-primary">{teacher.phone}</a>
                          </div>
                          <div className="flex items-start gap-3">
                              <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                              <span className="text-muted-foreground">{teacher.address}</span>
                          </div>
                           <div className="pt-4">
                              <h4 className="font-semibold text-primary mb-2">শিক্ষাগত যোগ্যতা</h4>
                              <p className="text-muted-foreground whitespace-pre-wrap">{teacher.educational_qualification || "N/A"}</p>
                          </div>
                          <div>
                              <h4 className="font-semibold text-primary mb-2">অভিজ্ঞতা</h4>
                              <p className="text-muted-foreground whitespace-pre-wrap">{teacher.experience || "N/A"}</p>
                          </div>
                      </CardContent>
                  </div>
              </div>
            </Card>
        </div>
    </div>
  );
}
