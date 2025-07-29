

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageForm } from "@/components/admin/pages/page-form";

export default function NewPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>নতুন পেজ তৈরি করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <PageForm />
      </CardContent>
    </Card>
  );
}
