
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';

export interface GalleryImage {
    id: number;
    title: string;
    image_url: string;
    data_ai_hint: string;
    sort_order: number;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
    if (!pool) {
        console.error("Database not connected.");
        return [];
    }
    try {
        const [rows] = await pool.query('SELECT id, title, data_ai_hint, sort_order, IF(image_url IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image_url)), NULL) as image_url FROM gallery_images ORDER BY sort_order ASC');
        return rows as GalleryImage[];
    } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        return [];
    }
}

export async function getGalleryImageById(id: string | number): Promise<GalleryImage | null> {
    if (!pool) return null;
    try {
        const [rows] = await pool.query<GalleryImage[]>('SELECT id, title, data_ai_hint, sort_order, IF(image_url IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image_url)), NULL) as image_url FROM gallery_images WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Failed to fetch gallery image:', error);
        return null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveGalleryImage(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        const data = {
            title: formData.get('title') as string,
            sort_order: parseInt(formData.get('sort_order') as string, 10),
            data_ai_hint: formData.get('data_ai_hint') as string,
            image: formData.get('image') as Blob | null
        };
        
        const imageBuffer = data.image ? Buffer.from(await data.image.arrayBuffer()) : null;
        
        if (id) {
            const fieldsToUpdate: any = { title: data.title, sort_order: data.sort_order, data_ai_hint: data.data_ai_hint };
            if (imageBuffer) {
                fieldsToUpdate.image_url = imageBuffer;
            }
            await pool.query('UPDATE gallery_images SET ? WHERE id = ?', [fieldsToUpdate, id]);
        } else {
            if (!imageBuffer) return { success: false, error: 'Image is required for new entries' };
            await pool.query('INSERT INTO gallery_images (title, sort_order, data_ai_hint, image_url) VALUES (?, ?, ?, ?)', [data.title, data.sort_order, data.data_ai_hint, imageBuffer]);
        }
        
        revalidatePath('/admin/gallery/photos');
        revalidatePath('/(site)/gallery');
        return { success: true };
    } catch (e: any) {
        console.error("Failed to save gallery image:", e);
        return { success: false, error: e.message };
    }
}

export async function deleteGalleryImage(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        await pool.query('DELETE FROM gallery_images WHERE id = ?', [id]);
        revalidatePath('/admin/gallery/photos');
        revalidatePath('/(site)/gallery');
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete gallery image:", e);
        return { success: false, error: e.message };
    }
}
