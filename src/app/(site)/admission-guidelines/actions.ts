
'use server';

import { getAdmissionGuidelines, getAdmissionImportantDates, getAdmissionPageContent, AdmissionGuideline, ImportantDate, AdmissionPageContent } from "@/lib/admission-data";

type AdmissionData = {
    content: AdmissionPageContent;
    dates: ImportantDate[];
    guides: AdmissionGuideline[];
}

export async function getAdmissionData(): Promise<AdmissionData> {
    const [content, dates, guides] = await Promise.all([
        getAdmissionPageContent(),
        getAdmissionImportantDates(),
        getAdmissionGuidelines(),
    ]);

    return { content, dates, guides };
}
