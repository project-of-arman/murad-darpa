
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
  favicon_url: string | null;
  school_id: number;
  school_name: string;
  school_address: string;
  school_logo_url: string;
}

// ========= MOCK DATA (for fallback) =========
const mockSiteSettings: SiteSettings = {
  id: 1,
  site_title: 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়',
  meta_description: 'Official website for মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়',
  meta_keywords: 'school, education, bangladesh',
  favicon_url: '/favicon.ico',
  school_id: 1,
  school_name: 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়',
  school_address: 'কাফ্রিখাল, মিঠাপুকুর, রংপুর।',
  school_logo_url: 'https://placehold.co/80x80.png',
};

// ========= DATABASE ACTIONS =========
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!pool) {
      console.warn("Database not connected. Returning mock data for site settings.");
      return mockSiteSettings;
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
            si.logo_url as school_logo_url
        FROM site_settings ss, school_info si 
        WHERE ss.id = 1 AND si.id = 1;
    `;
    const [rows] = await pool.query<any[]>(query);
    
    if (rows.length === 0) {
        return mockSiteSettings;
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
        console.warn('`site_settings` or `school_info` table not found. Returning mock data.');
        return mockSiteSettings;
    }
    console.error('Failed to fetch site settings:', error);
    return mockSiteSettings;
  }
}
