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

  // Handle case where data might not be available yet
  if (!aboutInfoData) {
    return (
        <Card>
            <CardHeader><CardTitle>স্কুল সম্পর্কে তথ্য</CardTitle></CardHeader>
            <CardContent><p>Loading data or initial setup required...</p></CardContent>
        </Card>
    );
  }

  // Convert buffer to data URL before passing to client component
  const aboutInfo = {
      ...aboutInfoData,
      image_url: aboutInfoData.image_url ? toDataURL(aboutInfoData.image_url as Buffer) : ''
  }

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
