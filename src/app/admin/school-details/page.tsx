
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAboutSchool, getSchoolFeatures } from "@/lib/school-data";
import AboutSchoolForm from "@/components/admin/school-details/about-school-form";
import SchoolFeatures from "@/components/admin/school-details/school-features";
import { toDataURL } from "@/lib/utils";

export default async function AdminSchoolDetailsPage() {
  const [aboutInfoData, features] = await Promise.all([
    getAboutSchool(),
    getSchoolFeatures()
  ]);

  // If aboutInfoData is null, create a default object to pass to the form
  // This allows creating the information for the first time.
  const aboutInfo = aboutInfoData 
    ? {
        ...aboutInfoData,
        image_url: aboutInfoData.image_url && Buffer.isBuffer(aboutInfoData.image_url)
          ? toDataURL(aboutInfoData.image_url) 
          : aboutInfoData.image_url || ''
      }
    : {
        id: 0, // Placeholder ID
        title: "",
        description: "",
        image_url: ""
    };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>স্কুল সম্পর্কে তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <AboutSchoolForm content={aboutInfo} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>স্কুলের বৈশিষ্ট্য কার্ড</CardTitle>
        </CardHeader>
        <CardContent>
          <SchoolFeatures features={features} />
        </CardContent>
      </Card>
    </div>
  );
}
