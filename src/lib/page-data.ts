
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';

export interface Page {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    created_at: string;
    updated_at: string;
}

export async function getPages(): Promise<Page[]> {
    if (!pool) {
        console.warn("Database not connected. Returning empty array for pages.");
        return [];
    }
    try {
        const [rows] = await pool.query('SELECT id, title, slug, description, IF(thumbnail IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(thumbnail)), NULL) as thumbnail, created_at, updated_at FROM pages ORDER BY created_at DESC');
        return rows as Page[];
    } catch (error) {
        console.error('Failed to fetch pages:', error);
        return [];
    }
}

export async function getPageById(id: string | number): Promise<Page | null> {
    if (!pool) {
        return null;
    }
    try {
        const [rows] = await pool.query<Page[]>('SELECT id, title, slug, description, IF(thumbnail IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(thumbnail)), NULL) as thumbnail, created_at, updated_at FROM pages WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to fetch page by id ${id}:`, error);
        return null;
    }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
    if (!pool) {
        return null;
    }
    try {
        const [rows] = await pool.query<Page[]>('SELECT id, title, slug, description, IF(thumbnail IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(thumbnail)), NULL) as thumbnail, created_at, updated_at FROM pages WHERE slug = ?', [slug]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to fetch page by slug ${slug}:`, error);
        return null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function savePage(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }

    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const thumbnail = formData.get('thumbnail') as Blob | null;
        
        // Check for slug uniqueness
        const [existing] = await pool.query<Page[]>('SELECT id FROM pages WHERE slug = ? AND id != ?', [slug, id || 0]);
        if (existing.length > 0) {
            return { success: false, error: "এই স্লাগ (URL) ইতিমধ্যে ব্যবহৃত হয়েছে।" };
        }
        
        const thumbnailBuffer = thumbnail ? Buffer.from(await thumbnail.arrayBuffer()) : null;


        if (id) {
            // Update
            const fieldsToUpdate: { [key: string]: any } = { title, slug, description };
            if (thumbnailBuffer) {
                fieldsToUpdate.thumbnail = thumbnailBuffer;
            }

            const query = 'UPDATE pages SET ? WHERE id = ?';
            await pool.query(query, [fieldsToUpdate, id]);
        } else {
            // Insert
            const query = 'INSERT INTO pages (title, slug, description, thumbnail) VALUES (?, ?, ?, ?)';
            await pool.query(query, [title, slug, description, thumbnailBuffer]);
        }

        revalidatePath('/admin/pages');
        revalidatePath(`/(site)/${slug}`);

        return { success: true };
    } catch (error: any) {
        console.error("Failed to save page:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}

export async function deletePage(id: number): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }
    try {
        // First get the slug to revalidate the path
        const page = await getPageById(id);

        await pool.query('DELETE FROM pages WHERE id = ?', [id]);
        
        revalidatePath('/admin/pages');
        if (page) {
            revalidatePath(`/(site)/${page.slug}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to delete page:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}
