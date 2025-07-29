
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import type { Teacher } from "@/lib/teacher-data";
import type { Staff } from "@/lib/staff-data";

type Member = (Teacher | Staff) & { id: number | string };

export default function StaffList({ members, memberType }: { members: Member[]; memberType: 'teachers' | 'staff' }) {
  
  if (members.length === 0) {
    return <p className="text-center text-muted-foreground">কোনো তথ্য পাওয়া যায়নি।</p>
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {members.map((person) => (
        <Card key={person.id} className="overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 text-center h-full flex flex-col">
          <CardContent className="p-0 flex flex-col flex-grow">
            <Link href={`/${memberType}/${person.id}`} className="block relative aspect-[3/4]">
              <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover"
                  data-ai-hint={person.dataAiHint}
              />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-primary">
                <Link href={`/${memberType}/${person.id}`}>{person.name}</Link>
              </h3>
              <p className="text-sm text-accent-foreground font-medium mb-4">{person.role}</p>
              <div className="space-y-2 text-left text-sm text-muted-foreground mt-auto">
                  {person.address && (
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{person.address}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                          <a
                            href={`tel:${person.phone}`}
                            className="hover:text-primary z-10 relative"
                          >
                            {person.phone}
                          </a>
                    </div>
                  )}
                  {person.email && (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0" />
                        <a
                          href={`mailto:${person.email}`}
                          className="hover:text-primary truncate z-10 relative"
                        >
                          {person.email}
                        </a>
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
