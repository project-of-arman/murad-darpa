
'use server';

import pool, { queryWithRetry } from './db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { toDataURL } from './utils';

/*
SQL for table `school_info`:

ALTER TABLE school_info
ADD COLUMN mpo_code VARCHAR(255) DEFAULT NULL,
ADD COLUMN eiin_number VARCHAR(255) DEFAULT NULL;
*/

export interface CarouselItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  dataAiHint: string;
  sort_order: number;
}

export interface SchoolFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface AboutSchoolInfo {
    id: number;
    title: string;
    description: string;
    image_url: string | Buffer;
}

export interface SchoolInfo {
    id: number;
    name: string;
    address: string;
    logo_url: string;
    mpo_code: string | null;
    eiin_number: string | null;
}

type SaveResult = { success: boolean; error?: string };

// ========= CAROUSEL ACTIONS =========
export async function getCarouselItems(): Promise<CarouselItem[]> {
    if (!pool) {
        return [];
    }
    try {
        const [rows] = await pool.query('SELECT id, title, description, alt, dataAiHint, sort_order, IF(src IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(src)), NULL) as src FROM carousel_items ORDER BY sort_order ASC');
        return rows as CarouselItem[];
    } catch (error) {
        console.error('Failed to fetch carousel items:', error);
        return [];
    }
}

export async function getCarouselItemById(id: string | number): Promise<CarouselItem | null> {
    if (!pool) return null;
    try {
        const [rows] = await pool.query<CarouselItem[]>('SELECT * FROM carousel_items WHERE id = ?', [id]);
        return (rows as any)[0] || null;
    } catch (error) {
        return null;
    }
}

export async function saveCarouselItem(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            alt: formData.get('alt') as string,
            dataAiHint: formData.get('dataAiHint') as string,
            sort_order: parseInt(formData.get('sort_order') as string, 10),
            src: formData.get('src') as Blob | null
        };
        
        const imageBuffer = data.src ? Buffer.from(await data.src.arrayBuffer()) : null;
        
        if (id) {
            const fieldsToUpdate: any = { 
                title: data.title, 
                description: data.description,
                alt: data.alt,
                dataAiHint: data.dataAiHint,
                sort_order: data.sort_order 
            };
            if (imageBuffer) fieldsToUpdate.src = imageBuffer;
            await pool.query('UPDATE carousel_items SET ? WHERE id = ?', [fieldsToUpdate, id]);
        } else {
            if (!imageBuffer) return { success: false, error: 'Image is required for new carousel items' };
            await pool.query('INSERT INTO carousel_items (title, description, alt, dataAiHint, sort_order, src) VALUES (?, ?, ?, ?, ?, ?)', 
                [data.title, data.description, data.alt, data.dataAiHint, data.sort_order, imageBuffer]);
        }
        
        revalidatePath('/admin/gallery/carousel');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteCarouselItem(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    try {
        await pool.query('DELETE FROM carousel_items WHERE id = ?', [id]);
        revalidatePath('/admin/gallery/carousel');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ========= SCHOOL INFO ACTIONS =========
export async function getSchoolInfo(): Promise<SchoolInfo | null> {
  if (!pool) {
    return null;
  }
  try {
    const query = 'SELECT id, name, address, mpo_code, eiin_number, IF(logo_url IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(logo_url)), NULL) as logo_url FROM school_info LIMIT 1';
    const rows = await queryWithRetry<SchoolInfo[]>(query);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Failed to fetch school info:", error);
    return null;
  }
}

// ========= ABOUT SCHOOL ACTIONS =========
export async function getAboutSchool(): Promise<AboutSchoolInfo | null> {
  if (!pool) {
    return null;
  }
  try {
    const [rows] = await pool.query('SELECT id, title, description, IF(image_url IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image_url)), NULL) as image_url FROM about_school LIMIT 1');
    return (rows as AboutSchoolInfo[])[0] || null;
  } catch (error) {
    console.error("Failed to fetch about school info:", error);
    return null;
  }
}

export async function saveAboutSchool(formData: FormData): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    try {
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            image: formData.get('image_url') as Blob | null
        };
        
        const imageBuffer = data.image && data.image.size > 0 ? Buffer.from(await data.image.arrayBuffer()) : null;

        const fieldsToUpdate: any = { 
            id: 1, // Always operate on the single row with id=1
            title: data.title, 
            description: data.description 
        };
        
        if (imageBuffer) {
            fieldsToUpdate.image_url = imageBuffer;
        }
        
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both create and update
        const query = `
            INSERT INTO about_school (id, title, description, image_url) 
            VALUES (1, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            title = VALUES(title), 
            description = VALUES(description),
            image_url = IF(VALUES(image_url) IS NOT NULL, VALUES(image_url), image_url);
        `;
        
        await pool.query(query, [fieldsToUpdate.title, fieldsToUpdate.description, fieldsToUpdate.image_url]);

        revalidatePath('/admin/school-details');
        revalidatePath('/(site)/');
        revalidatePath('/(site)/school-details');
        return { success: true };
    } catch(e: any) {
        console.error("Failed to save about school info:", e);
        return { success: false, error: e.message };
    }
}


// ========= SCHOOL FEATURES ACTIONS =========
const featureSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  icon: z.string().min(1, "আইকন আবশ্যক"),
  description: z.string().min(1, "বিবরণ আবশ্যক"),
});

export async function getSchoolFeatures(): Promise<SchoolFeature[]> {
    if (!pool) {
        return [];
    }
    try {
        const [rows] = await pool.query('SELECT * FROM school_features ORDER BY id ASC');
        return rows as SchoolFeature[];
    } catch (error) {
        console.error("Failed to fetch school features:", error);
        return [];
    }
}

export async function saveSchoolFeature(data: unknown, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    const parsed = featureSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: "Invalid data" };

    try {
        if (id) {
            await pool.query('UPDATE school_features SET ? WHERE id = ?', [parsed.data, id]);
        } else {
            await pool.query('INSERT INTO school_features SET ?', [parsed.data]);
        }
        revalidatePath('/admin/school-details');
        revalidatePath('/(site)/');
        revalidatePath('/(site)/school-details');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteSchoolFeature(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    try {
        await pool.query('DELETE FROM school_features WHERE id = ?', [id]);
        revalidatePath('/admin/school-details');
        revalidatePath('/(site)/');
        revalidatePath('/(site)/school-details');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
