
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getStudentByRoll } from "@/lib/student-data";


export default async function StudentDetailsPage({ params }: { params: { roll: string } }) {
  const student = await getStudentByRoll(params.roll);

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">শিক্ষার্থী পাওয়া যায়নি।</h1>
        <Button asChild className="mt-4">
          <Link href="/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            সকল শিক্ষার্থী দেখুন
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4">
            <div className="mb-8">
                <Button asChild variant="outline">
                  <Link href="/students">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    তালিকায় ফিরে যান
                  </Link>
                </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                    <Card className="overflow-hidden shadow-lg">
                        <Image src={student.image || "https://placehold.co/300x400.png"} alt={student.name} width={300} height={400} className="w-full object-cover aspect-[3/4]" data-ai-hint={student.data_ai_hint || 'student portrait'} />
                    </Card>
                </div>
                <div className="w-full md:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary font-headline">{student.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">রোল নং:</p>
                                    <p className="text-muted-foreground">{student.roll}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">শ্রেণী:</p>
                                    <p className="text-muted-foreground">{student.class_name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">লিঙ্গ:</p>
                                    <p className="text-muted-foreground">{student.gender}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">বছর:</p>
                                    <p className="text-muted-foreground">{student.year}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
