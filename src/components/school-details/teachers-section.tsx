

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Teacher } from "@/lib/teacher-data";


export default function TeachersSection({ teachers }: { teachers: Teacher[] }) {

  return (
    <section id="teachers-section">
       <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary font-headline">আমাদের শিক্ষকগণ</h2>
        <Button asChild variant="outline">
          <Link href="/staff">সকলকে দেখুন</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teachers.slice(0, 4).map((teacher, index) => (
            <Link href={`/teachers/${teacher.id}`} key={teacher.id}>
                <Card className="group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="relative flex aspect-[3/4] items-center justify-center p-0">
                    <Image
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={teacher.dataAiHint}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                        <p className="text-sm text-primary-foreground/80">{teacher.role}</p>
                    </div>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </section>
  );
}
