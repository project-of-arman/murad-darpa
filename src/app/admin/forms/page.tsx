

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getFormSubmissions } from "@/lib/actions/forms-actions";
import { formConfigs } from "@/lib/config/forms-config";
import FormsTabs from "@/components/admin/forms/forms-tabs";
import type { FormSubmission } from "@/lib/config/forms-config";

export default async function AdminFormsPage() {
  const formTypes = Object.keys(formConfigs);

  // Fetch data for all tabs concurrently
  const allSubmissionsPromises = formTypes.map(formType => getFormSubmissions(formType));
  const allSubmissionsArray = await Promise.all(allSubmissionsPromises);

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
        />
      </CardContent>
    </Card>
  );
}
