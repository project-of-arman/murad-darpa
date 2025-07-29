
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Users, History, Award, Building } from "lucide-react";
import ImageGallery from "@/components/school-details/image-gallery";
import TeachersSection from "@/components/school-details/teachers-section";
import VideoGallery from "@/components/homepage/video-gallery";
import { getTeachers } from "@/lib/teacher-data";
import { getAboutSchool, getSchoolFeatures, SchoolFeature } from "@/lib/school-data";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

const IconComponent = ({ name }: { name: string }) => {
    const Icon = LucideIcons[name as IconName] as React.ElementType;
    if (!Icon) {
        // Return a default icon or null if the icon name is invalid
        return <BookOpen className="h-8 w-8" />;
    }
    return <Icon className="h-8 w-8" />;
};


export default async function SchoolDetailsPage() {
  const teachers = await getTeachers();
  const aboutSchool = await getAboutSchool();
  const features = await getSchoolFeatures();

  return (
    <div className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 space-y-24">
             <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-primary font-headline">স্কুল সম্পর্কিত বিস্তারিত</h1>
              <p className="text-muted-foreground mt-2">আমাদের প্রতিষ্ঠান সম্পর্কে আরো জানুন</p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-5/12 relative">
                    <div className="absolute -top-4 -left-4 w-full h-full border-4 border-accent rounded-lg transform -rotate-2"></div>
                    <Card className="overflow-hidden shadow-lg relative rounded-lg">
                    <Image
                        src={aboutSchool.image_url}
                        alt={aboutSchool.title}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full"
                        data-ai-hint="school building"
                    />
                    </Card>
                </div>
                <div className="w-full md:w-7/12">
                    <h2 className="text-3xl font-bold text-primary mb-4 font-headline">{aboutSchool.title}</h2>
                    <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                        {aboutSchool.description}
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="flex-shrink-0 bg-primary/10 text-primary p-4 rounded-full">
                                <IconComponent name={feature.icon} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </Card>
                ))}
            </div>

            <TeachersSection teachers={teachers} />
            <ImageGallery />
            <div className="bg-white py-12 sm:py-16 lg:py-20">
              <div className="container mx-auto px-4">
                <VideoGallery />
              </div>
            </div>

        </div>
    </div>
  );
}
