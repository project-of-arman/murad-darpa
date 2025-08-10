
'use server';

import pool from './db';
import { RowDataPacket } from 'mysql2';
import { toDataURL } from './utils';

// ========= TYPES =========
export interface SiteSettings extends RowDataPacket {
  id: number;
  site_title: string;
  meta_description: string;
  meta_keywords: string | null;
  favicon_url: string | null | Buffer;
  school_id: number;
  school_name: string;
  school_address: string;
  school_logo_url: string | Buffer;
  mpo_code: string | null;
  eiin_number: string | null;
}

// ========= DATABASE ACTIONS =========
export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!pool) {
      console.warn("Database not connected. Site settings will be null.");
      return null;
  }
  try {
    const query = `
        SELECT 
            ss.id, 
            ss.site_title, 
            ss.meta_description, 
            ss.meta_keywords, 
            ss.favicon_url,
            si.id as school_id,
            si.name as school_name,
            si.address as school_address,
            si.logo_url as school_logo_url,
            si.mpo_code,
            si.eiin_number
        FROM site_settings ss
        LEFT JOIN school_info si ON ss.id = si.id
        WHERE ss.id = 1;
    `;
    const [rows] = await pool.query<any[]>(query);
    
    if (rows.length === 0) {
        // If site_settings doesn't exist, try to get school_info at least
        const [schoolRows] = await pool.query<any[]>('SELECT * from school_info where id = 1');
        if (schoolRows.length > 0) {
            return {
                id: 0, site_title: '', meta_description: '', meta_keywords: '', favicon_url: null,
                ...schoolRows[0]
            } as SiteSettings;
        }
        return null;
    }
    
    const settings = rows[0];

    // Convert Buffers to data URLs before returning
    if (settings.favicon_url && Buffer.isBuffer(settings.favicon_url)) {
        settings.favicon_url = toDataURL(settings.favicon_url, 'image/x-icon');
    }
    if (settings.school_logo_url && Buffer.isBuffer(settings.school_logo_url)) {
        settings.school_logo_url = toDataURL(settings.school_logo_url);
    }
    
    return settings as SiteSettings;

  } catch (error: any) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
        console.warn('`site_settings` or `school_info` table not found. Returning null.');
        return null;
    }
    console.error('Failed to fetch site settings:', error);
    return null;
  }
}
