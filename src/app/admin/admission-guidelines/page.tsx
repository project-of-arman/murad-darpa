import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAdmissionGuidelines, getAdmissionImportantDates, getAdmissionPageContent } from "@/lib/admission-data";
import PageContentForm from "@/components/admin/admission-guidelines/page-content-form";
import ImportantDates from "@/components/admin/admission-guidelines/important-dates";
import Guidelines from "@/components/admin/admission-guidelines/guidelines";

export default async function AdminAdmissionGuidelinesPage() {
  const pageContent = await getAdmissionPageContent();
  const importantDates = await getAdmissionImportantDates();
  const guidelines = await getAdmissionGuidelines();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>পেজের সাধারণ তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <PageContentForm content={pageContent} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>গুরুত্বপূর্ণ তারিখ</CardTitle>
        </CardHeader>
        <CardContent>
          <ImportantDates dates={importantDates} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>নির্দেশিকা ধাপসমূহ</CardTitle>
        </CardHeader>
        <CardContent>
          <Guidelines guidelines={guidelines} />
        </CardContent>
      </Card>
    </div>
  );
}
