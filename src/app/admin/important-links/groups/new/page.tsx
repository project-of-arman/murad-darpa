
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkGroupForm } from "@/components/admin/important-links/link-group-form";

export default function NewLinkGroupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন লিংক গ্রুপ যোগ করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <LinkGroupForm />
      </CardContent>
    </Card>
  );
}
