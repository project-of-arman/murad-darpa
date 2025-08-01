
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getFormSubmissions, getPendingSubmissionCounts } from "@/lib/actions/forms-actions";
import { formConfigs } from "@/lib/config/forms-config";
import FormsTabs from "@/components/admin/forms/forms-tabs";
import type { FormSubmission } from "@/lib/config/forms-config";

type AdminFormsPageProps = {
  userRole: 'admin' | 'moderator' | 'visitor';
}

export default async function AdminFormsPage({ userRole }: AdminFormsPageProps) {
  const formTypes = Object.keys(formConfigs);

  // Fetch all data concurrently
  const [allSubmissionsArray, pendingCounts] = await Promise.all([
    Promise.all(formTypes.map(formType => getFormSubmissions(formType))),
    getPendingSubmissionCounts()
  ]);

  const submissionsByType: Record<string, FormSubmission[]> = {};
  formTypes.forEach((formType, index) => {
    submissionsByType[formType] = allSubmissionsArray[index];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>ফরমস ব্যবস্থাপনা</CardTitle>
      </CardHeader>
      <CardContent>
        <FormsTabs 
          formTypes={formTypes}
          formConfigs={formConfigs}
          submissionsByType={submissionsByType}
          pendingCounts={pendingCounts}
          userRole={userRole}
        />
      </CardContent>
    </Card>
  );
}
