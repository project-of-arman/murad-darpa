
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
        id: 1, // Ensure we are targeting the correct row
        site_title: data.site_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
    };

    if (data.favicon_url && data.favicon_url.size > 0) {
        fieldsToUpdate.favicon_url = Buffer.from(await data.favicon_url.arrayBuffer());
    }

    // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both creation and updates.
    // This is safer if the row with id=1 doesn't exist yet.
    const query = `
      INSERT INTO site_settings (id, site_title, meta_description, meta_keywords, favicon_url)
      VALUES (1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        site_title = VALUES(site_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        favicon_url = IF(VALUES(favicon_url) IS NOT NULL, VALUES(favicon_url), favicon_url)
    `;

    await pool.query(query, [
        fieldsToUpdate.site_title,
        fieldsToUpdate.meta_description,
        fieldsToUpdate.meta_keywords,
        fieldsToUpdate.favicon_url,
    ]);
    
    revalidatePath('/admin/settings');
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
            mpo_code: formData.get('mpo_code') as string | null,
            eiin_number: formData.get('eiin_number') as string | null,
            logo_url: formData.get('logo_url') as Blob | null,
        };

        const fieldsToUpdate: {[key: string]: any} = {
            id: 1, // Target id=1
            name: data.name,
            address: data.address,
            mpo_code: data.mpo_code,
            eiin_number: data.eiin_number,
        };

        if (data.logo_url && data.logo_url.size > 0) {
            fieldsToUpdate.logo_url = Buffer.from(await data.logo_url.arrayBuffer());
        }
        
        const query = `
            INSERT INTO school_info (id, name, address, mpo_code, eiin_number, logo_url)
            VALUES(1, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                address = VALUES(address),
                mpo_code = VALUES(mpo_code),
                eiin_number = VALUES(eiin_number),
                logo_url = IF(VALUES(logo_url) IS NOT NULL, VALUES(logo_url), logo_url)
        `;
        
        await pool.query(query, [
            fieldsToUpdate.name,
            fieldsToUpdate.address,
            fieldsToUpdate.mpo_code,
            fieldsToUpdate.eiin_number,
            fieldsToUpdate.logo_url
        ]);

        revalidatePath('/admin/settings');
        revalidatePath('/', 'layout');

        return { success: true };

    } catch (e: any) {
        console.error("Failed to save school info:", e);
        return { success: false, error: "Failed to save school info." };
    }
}
