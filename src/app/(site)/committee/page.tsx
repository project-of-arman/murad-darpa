
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getCommitteeMembers } from "@/lib/committee-data";
import { toDataURL } from "@/lib/utils";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'পরিচালনা পর্ষদ',
};

export default async function CommitteePage() {
  const committeeMembers = await getCommitteeMembers();

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-headline">পরিচালনা পর্ষদ</h1>
          <p className="text-muted-foreground mt-2">আমাদের প্রতিষ্ঠানের সম্মানিত পরিচালনা পর্ষদের সদস্যবৃন্দ</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {committeeMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={toDataURL(member.image as Buffer)}
                    alt={member.name}
                    fill
                    className="object-cover"
                    data-ai-hint={member.dataAiHint}
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-lg font-bold text-primary">{member.name}</h3>
                  <p className="text-sm text-accent-foreground font-medium">{member.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
