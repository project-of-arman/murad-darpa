
'use server';

import { revalidatePath } from 'next/cache';
import pool from '../db';
import type { SiteSettings } from '../settings-data';
import type { SchoolInfo } from '../school-data';

type SaveResult = { success: boolean; error?: string };

export async function saveSiteSettings(formData: FormData): Promise<SaveResult> {
  if (!pool) return { success: false, error: 'Database not connected' };
  try {
    const data = {
        site_title: formData.get('site_title') as string,
        meta_description: formData.get('meta_description') as string,
        meta_keywords: formData.get('meta_keywords') as string,
        favicon_url: formData.get('favicon_url') as Blob | null,
    };
      
    const fieldsToUpdate: {[key: string]: any} = {
        site_title: data.site_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
    };

    if (data.favicon_url && data.favicon_url.size > 0) {
        fieldsToUpdate.favicon_url = Buffer.from(await data.favicon_url.arrayBuffer());
    }

    // There's only one row in this table, with id=1
    await pool.query('UPDATE site_settings SET ? WHERE id = 1', [fieldsToUpdate]);
    
    // Revalidate the root layout to apply new meta tags
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to save site settings:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

export async function saveSchoolInfo(formData: FormData): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    try {
        const data = {
            name: formData.get('name') as string,
            address: formData.get('address') as string,
            logo_url: formData.get('logo_url') as Blob | null,
        };

        const fieldsToUpdate: {[key: string]: any} = {
            name: data.name,
            address: data.address,
        };

        if (data.logo_url && data.logo_url.size > 0) {
            fieldsToUpdate.logo_url = Buffer.from(await data.logo_url.arrayBuffer());
        }
        
        // Assuming there is only one row with id = 1
        await pool.query('UPDATE school_info SET ? WHERE id = 1', [fieldsToUpdate]);

        revalidatePath('/admin/settings');
        revalidatePath('/', 'layout');

        return { success: true };

    } catch (e: any) {
        console.error("Failed to save school info:", e);
        return { success: false, error: "Failed to save school info." };
    }
}
