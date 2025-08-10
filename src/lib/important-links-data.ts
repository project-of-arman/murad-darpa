
'use server';

import pool, { queryWithRetry } from './db';
import { revalidatePath } from 'next/cache';
import { toDataURL } from './utils';

export interface Link {
    id: number;
    group_id: number;
    text: string;
    href: string | null;
    sort_order: number;
}

export interface ImportantLinkGroup {
  id: number;
  title: string;
  image: string;
  data_ai_hint: string;
  sort_order: number;
  links: Link[];
}

export async function getImportantLinkGroups(): Promise<ImportantLinkGroup[]> {
    if (!pool) {
        console.error("Database not connected.");
        return [];
    }
    try {
        const groupQuery = 'SELECT id, title, data_ai_hint, sort_order, IF(image IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image)), NULL) as image FROM important_link_groups ORDER BY sort_order ASC';
        const linksQuery = 'SELECT * FROM important_links ORDER BY group_id, sort_order ASC';

        const [groups, allLinks] = await Promise.all([
            queryWithRetry<ImportantLinkGroup[]>(groupQuery),
            queryWithRetry<Link[]>(linksQuery)
        ]);

        const linksByGroupId = new Map<number, Link[]>();
        for (const link of allLinks) {
            if (!linksByGroupId.has(link.group_id)) {
                linksByGroupId.set(link.group_id, []);
            }
            linksByGroupId.get(link.group_id)!.push(link);
        }

        for (const group of groups) {
            group.links = linksByGroupId.get(group.id) || [];
        }

        return groups;
    } catch (error) {
        console.error('Failed to fetch important link groups:', error);
        return [];
    }
}

type SaveResult = { success: boolean; error?: string };

export async function getLinkGroupById(id: number | string): Promise<ImportantLinkGroup | null> {
    if (!pool) return null;
    try {
        const rows = await queryWithRetry<ImportantLinkGroup[]>('SELECT id, title, data_ai_hint, sort_order, IF(image IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image)), NULL) as image FROM important_link_groups WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Failed to fetch link group:', error);
        return null;
    }
}

export async function saveLinkGroup(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        const data = {
            title: formData.get('title') as string,
            sort_order: parseInt(formData.get('sort_order') as string, 10),
            data_ai_hint: formData.get('data_ai_hint') as string,
            image: formData.get('image') as Blob | null,
        };

        const imageBuffer = data.image ? Buffer.from(await data.image.arrayBuffer()) : null;
        
        if (id) {
            const fieldsToUpdate: any = { title: data.title, sort_order: data.sort_order, data_ai_hint: data.data_ai_hint };
            if (imageBuffer) {
                fieldsToUpdate.image = imageBuffer;
            }
            await queryWithRetry('UPDATE important_link_groups SET ? WHERE id = ?', [fieldsToUpdate, id]);
        } else {
            if (!imageBuffer) return { success: false, error: 'Image is required for new groups' };
            await queryWithRetry('INSERT INTO important_link_groups (title, sort_order, data_ai_hint, image) VALUES (?, ?, ?, ?)', [data.title, data.sort_order, data.data_ai_hint, imageBuffer]);
        }
        
        revalidatePath('/admin/important-links');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteLinkGroup(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        await queryWithRetry('DELETE FROM important_links WHERE group_id = ?', [id]);
        await queryWithRetry('DELETE FROM important_link_groups WHERE id = ?', [id]);
        revalidatePath('/admin/important-links');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getLinkById(id: number | string): Promise<Link | null> {
    if (!pool) return null;
    try {
        const rows = await queryWithRetry<Link[]>('SELECT * FROM important_links WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Failed to fetch link:', error);
        return null;
    }
}


export async function saveLink(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        const data = {
            text: formData.get('text') as string,
            href: (formData.get('href') as string) || null,
            sort_order: parseInt(formData.get('sort_order') as string, 10),
            group_id: parseInt(formData.get('group_id') as string, 10),
        };

        if (id) {
            await queryWithRetry('UPDATE important_links SET ? WHERE id = ?', [data, id]);
        } else {
            await queryWithRetry('INSERT INTO important_links (text, href, sort_order, group_id) VALUES (?, ?, ?, ?)', [data.text, data.href, data.sort_order, data.group_id]);
        }
        
        revalidatePath('/admin/important-links');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteLink(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        await queryWithRetry('DELETE FROM important_links WHERE id = ?', [id]);
        revalidatePath('/admin/important-links');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
