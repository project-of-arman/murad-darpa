
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormsTable from "@/components/admin/forms/forms-table";
import type { FormConfig, FormSubmission } from "@/lib/config/forms-config";

interface FormsTabsProps {
    formTypes: string[];
    formConfigs: Record<string, FormConfig>;
    submissionsByType: Record<string, FormSubmission[]>;
}

export default function FormsTabs({ formTypes, formConfigs, submissionsByType }: FormsTabsProps) {
    const initialFormType = formTypes[0] || '';

    return (
        <Tabs defaultValue={initialFormType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto">
                {formTypes.map((formType) => (
                    <TabsTrigger key={formType} value={formType}>
                        {formConfigs[formType].displayName}
                    </TabsTrigger>
                ))}
            </TabsList>

            {formTypes.map((formType) => (
                <TabsContent key={formType} value={formType}>
                    <div className="py-4">
                        <FormsTable
                            formType={formType}
                            submissions={submissionsByType[formType] || []}
                            config={formConfigs[formType]}
                        />
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
