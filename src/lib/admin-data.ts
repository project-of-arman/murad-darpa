
'use server';

import pool from './db';

export interface DashboardStats {
    noticeCount: number;
    studentCount: number;
    teacherCount: number;
    admissionApplicationsCount: number;
}

export interface ApplicationCount {
    name: string;
    total: number;
}


async function getTableCount(tableName: string): Promise<number> {
    if (!pool) {
        // Return 0 if DB is not connected, prevents breaking the dashboard
        return 0;
    }
    try {
        const [rows] = await pool.query<{ 'COUNT(*)': number }[]>(`SELECT COUNT(*) FROM ${tableName}`);
        return rows[0]['COUNT(*)'] || 0;
    } catch (error) {
        // We will let the caller handle the error to provide more context.
        // The error will be caught in getDashboardStats or getApplicationCounts.
        console.error(`Error querying count for table ${tableName}:`, (error as Error).message);
        throw error;
    }
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        // Using Promise.all to fetch counts in parallel for better performance
        const [noticeCount, studentCount, teacherCount, admissionApplicationsCount] = await Promise.all([
            getTableCount('notices'),
            getTableCount('students'),
            getTableCount('teachers'),
            getTableCount('admission_applications'),
        ]);

        return {
            noticeCount,
            studentCount,
            teacherCount,
            admissionApplicationsCount,
        };
    } catch (error) {
        console.error("Failed to fetch one or more dashboard stats, returning zero values:", error);
        // If any of the table counts fail (e.g., table not found), return default zero values.
        return {
            noticeCount: 0,
            studentCount: 0,
            teacherCount: 0,
            admissionApplicationsCount: 0,
        };
    }
}


const applicationTables = [
    { dbTable: 'admission_applications', displayName: 'ভর্তি' },
    { dbTable: 'transfer_certificate_applications', displayName: 'ছাড়পত্র' },
    { dbTable: 'testimonial_applications', displayName: 'প্রশংসাপত্র' },
    { dbTable: 'certificate_applications', displayName: 'সনদপত্র' },
    { dbTable: 'admit_card_applications', displayName: 'প্রবেশপত্র' },
    { dbTable: 'marksheet_applications', displayName: 'মার্কশিট' },
    { dbTable: 'leave_applications', displayName: 'ছুটি' },
    { dbTable: 'library_card_applications', displayName: 'লাইব্রেরী কার্ড' },
    { dbTable: 'guardian_consent_applications', displayName: 'অভিভাবক সম্মতি' },
    { dbTable: 'subject_change_applications', displayName: 'বিষয় পরিবর্তন' },
    { dbTable: 'stipend_applications', displayName: 'উপবৃত্তি' },
];

export async function getApplicationCounts(): Promise<ApplicationCount[]> {
     if (!pool) {
        return applicationTables.map(table => ({ name: table.displayName, total: 0 }));
    }

    const results: ApplicationCount[] = [];

    for (const table of applicationTables) {
        try {
            const count = await getTableCount(table.dbTable);
            results.push({
                name: table.displayName,
                total: count
            });
        } catch (error) {
            // If a table doesn't exist or another error occurs, return 0 for that count.
             results.push({
                name: table.displayName,
                total: 0
            });
        }
    }
    
    return results;
}
