import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { getAboutSchool, getSchoolFeatures, AboutSchoolInfo, SchoolFeature } from "@/lib/school-data";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

const IconComponent = ({ name }: { name: string }) => {
    const Icon = LucideIcons[name as IconName] as React.ElementType;
    if (!Icon) {
        return <BookOpen className="h-5 w-5" />;
    }
    return <Icon className="h-5 w-5" />;
};


function AboutSchoolContent({ aboutInfo, features }: { aboutInfo: AboutSchoolInfo, features: SchoolFeature[] }) {
  return (
    <div className="flex flex-col md:flex-row gap-12 items-center">
      <div className="w-full md:w-5/12 relative">
        <div className="absolute -top-4 -left-4 w-full h-full border-4 border-accent rounded-lg transform -rotate-2"></div>
        <Card className="overflow-hidden shadow-lg relative rounded-lg">
          <Image
            src={aboutInfo.image_url}
            alt="School Building"
            width={400}
            height={500}
            className="object-cover w-full h-full"
            data-ai-hint="school building"
          />
        </Card>
      </div>
      <div className="w-full md:w-7/12">
        <h2 className="text-3xl font-bold text-primary mb-4 font-headline">{aboutInfo.title}</h2>
        <p className="text-muted-foreground mb-6 text-base leading-relaxed">
          {aboutInfo.description?.slice(0,200)}{aboutInfo.description?.length>=200 ? '...':''}
        </p>
        <div className="space-y-4 mb-8">
            {features.slice(0, 3).map((feature) => (
              <div key={feature.id} className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-full">
                  <IconComponent name={feature.icon} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
        </div>
        <Button asChild>
          <Link href="/school-details">আরো জানুন</Link>
        </Button>
      </div>
    </div>
  );
}


export default async function AboutSchool() {
  const aboutInfo = await getAboutSchool();
  const features = await getSchoolFeatures();
  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <AboutSchoolContent aboutInfo={aboutInfo} features={features} />
      </div>
    </div>
  );
}
