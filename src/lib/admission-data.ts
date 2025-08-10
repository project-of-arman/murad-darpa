
'use server';

import pool from './db';

export interface AdmissionGuideline {
    id: number;
    title: string;
    icon: string;
    content: string;
    sort_order: number;
}

export interface ImportantDate {
    id: number;
    label: string;
    date_value: string;
    sort_order: number;
}

export interface AdmissionPageContent {
    id: number;
    title: string;
    subtitle: string;
    form_download_url: string | null;
    contact_title: string | null;
    contact_description: string | null;
    contact_phone: string | null;
}

export async function getAdmissionGuidelines(): Promise<AdmissionGuideline[]> {
    if (!pool) {
        console.error("Database not connected.");
        return [];
    }
    try {
        const [rows] = await pool.query('SELECT * FROM admission_guidelines ORDER BY sort_order ASC');
        return rows as AdmissionGuideline[];
    } catch (error) {
        console.error('Failed to fetch admission guidelines:', error);
        return [];
    }
}

export async function getAdmissionImportantDates(): Promise<ImportantDate[]> {
    if (!pool) {
        console.error("Database not connected.");
        return [];
    }
    try {
        const [rows] = await pool.query('SELECT * FROM admission_important_dates ORDER BY sort_order ASC');
        return rows as ImportantDate[];
    } catch (error) {
        console.error('Failed to fetch admission dates:', error);
        return [];
    }
}

export async function getAdmissionPageContent(): Promise<AdmissionPageContent | null> {
    if (!pool) {
        console.error("Database not connected.");
        return null;
    }
    try {
        const [rows] = await pool.query('SELECT * FROM admission_page_content LIMIT 1');
        const results = rows as AdmissionPageContent[];
        return results[0] || null;
    } catch (error) {
        console.error('Failed to fetch admission page content:', error);
        return null;
    }
}
