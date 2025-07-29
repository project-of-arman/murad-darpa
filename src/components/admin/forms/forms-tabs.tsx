

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormsTable from "@/components/admin/forms/forms-table";
import type { FormConfig, FormSubmission } from "@/lib/config/forms-config";
import { cn } from "@/lib/utils";

interface FormsTabsProps {
    formTypes: string[];
    formConfigs: Record<string, FormConfig>;
    submissionsByType: Record<string, FormSubmission[]>;
    pendingCounts: Record<string, number>;
}

export default function FormsTabs({ formTypes, formConfigs, submissionsByType, pendingCounts }: FormsTabsProps) {
    const initialFormType = formTypes[0] || '';

    return (
        <Tabs defaultValue={initialFormType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto">
                {formTypes.map((formType) => {
                    const hasPending = pendingCounts[formType] > 0;
                    return (
                        <TabsTrigger key={formType} value={formType} className="relative">
                            {formConfigs[formType].displayName}
                            {hasPending && (
                                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                </span>
                            )}
                        </TabsTrigger>
                    )
                })}
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
