
'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';

type SaveResult = { success: boolean; error?: string };

// Page Content Actions
export async function savePageContent(formData: FormData): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected." };
    try {
        const data = {
            title: formData.get('title') as string,
            subtitle: formData.get('subtitle') as string,
            form_download_url: formData.get('form_download_url') as string,
            contact_title: formData.get('contact_title') as string,
            contact_description: formData.get('contact_description') as string,
            contact_phone: formData.get('contact_phone') as string,
        };
        await pool.query('UPDATE admission_page_content SET ? WHERE id = 1', [data]);
        revalidatePath('/admin/admission-guidelines');
        revalidatePath('/(site)/admission-guidelines');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// Important Date Actions
export async function saveImportantDate(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected." };
    try {
        const data = {
            label: formData.get('label') as string,
            date_value: formData.get('date_value') as string,
            sort_order: parseInt(formData.get('sort_order') as string, 10),
        };
        if (id) {
            await pool.query('UPDATE admission_important_dates SET ? WHERE id = ?', [data, id]);
        } else {
            await pool.query('INSERT INTO admission_important_dates SET ?', [data]);
        }
        revalidatePath('/admin/admission-guidelines');
        revalidatePath('/(site)/admission-guidelines');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteImportantDate(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected." };
    try {
        await pool.query('DELETE FROM admission_important_dates WHERE id = ?', [id]);
        revalidatePath('/admin/admission-guidelines');
        revalidatePath('/(site)/admission-guidelines');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// Guideline Actions
export async function saveGuideline(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected." };
    try {
        const data = {
            title: formData.get('title') as string,
            icon: formData.get('icon') as string,
            content: formData.get('content') as string,
            sort_order: parseInt(formData.get('sort_order') as string, 10),
        };
        if (id) {
            await pool.query('UPDATE admission_guidelines SET ? WHERE id = ?', [data, id]);
        } else {
            await pool.query('INSERT INTO admission_guidelines SET ?', [data]);
        }
        revalidatePath('/admin/admission-guidelines');
        revalidatePath('/(site)/admission-guidelines');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteGuideline(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected." };
    try {
        await pool.query('DELETE FROM admission_guidelines WHERE id = ?', [id]);
        revalidatePath('/admin/admission-guidelines');
        revalidatePath('/(site)/admission-guidelines');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

