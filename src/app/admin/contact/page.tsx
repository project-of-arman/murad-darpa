
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getContactInfo, getContactSubmissions } from "@/lib/contact-data";
import ContactInfoForm from "@/components/admin/contact/contact-info-form";
import FeedbackTable from "@/components/admin/contact/feedback-table";

export default async function AdminContactPage() {
  const contactInfo = await getContactInfo();
  const feedbackSubmissions = await getContactSubmissions();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>যোগাযোগের তথ্য ব্যবস্থাপনা</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            ওয়েবসাইটের যোগাযোগ পেইজে যে তথ্য দেখানো হবে, তা এখানে সম্পাদনা করুন।
          </p>
          <ContactInfoForm contactInfo={contactInfo} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ব্যবহারকারীদের মতামত</CardTitle>
        </CardHeader>
        <CardContent>
            <FeedbackTable submissions={feedbackSubmissions} />
        </CardContent>
      </Card>
    </div>
  );
}
