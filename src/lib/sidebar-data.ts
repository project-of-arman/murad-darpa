
'use server';

import pool, { queryWithRetry } from './db';
import { revalidatePath } from 'next/cache';

export interface SidebarWidget {
  id: number;
  widget_type: 'profile' | 'links' | 'image_link';
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
  content: string | null; // JSON for links
  sort_order: number;
}

const mockSidebarWidgets: SidebarWidget[] = [
    {
        id: 1,
        widget_type: 'profile',
        title: 'প্রধান শিক্ষক',
        subtitle: 'মোঃ আব্দুল্লাহ',
        image_url: 'https://placehold.co/280x380.png',
        link_url: '/teachers/1',
        link_text: 'বিস্তারিত দেখুন',
        content: null,
        sort_order: 1
    }
]

export async function getSidebarWidgets(): Promise<SidebarWidget[]> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for sidebar widgets.");
        return mockSidebarWidgets;
    }
    try {
        const query = 'SELECT id, widget_type, title, subtitle, link_url, link_text, content, sort_order, IF(image_url IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image_url)), NULL) as image_url FROM sidebar_widgets ORDER BY sort_order ASC';
        const rows = await queryWithRetry<SidebarWidget[]>(query);
        return rows as SidebarWidget[];
    } catch (error) {
        console.error('Failed to fetch sidebar widgets:', error);
        return mockSidebarWidgets;
    }
}

export async function getSidebarWidgetById(id: string | number): Promise<SidebarWidget | null> {
    if (!pool) return null;
    try {
        const [rows] = await pool.query<SidebarWidget[]>('SELECT *, IF(image_url IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image_url)), NULL) as image_url FROM sidebar_widgets WHERE id = ?', [id]);
        return (rows as any)[0] || null;
    } catch (error) {
        return null;
    }
}


type SaveResult = { success: boolean; error?: string };

export async function saveSidebarWidget(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    
    try {
        const data: {[key: string]: any} = {};
        formData.forEach((value, key) => {
            if (value === 'null' || value === '') {
                data[key] = null;
            } else {
                 data[key] = value;
            }
        });

        // Convert to correct types for DB
        const dbData: {[key: string]: any} = {
            widget_type: data.widget_type,
            title: data.title || null,
            subtitle: data.subtitle || null,
            link_url: data.link_url || null,
            link_text: data.link_text || null,
            content: data.content || null,
            sort_order: parseInt(data.sort_order, 10),
        };

        const imageBlob = data.image_url as Blob | null;
        if (imageBlob && imageBlob.size > 0) {
            dbData.image_url = Buffer.from(await imageBlob.arrayBuffer());
        }

        if (id) {
            await pool.query('UPDATE sidebar_widgets SET ? WHERE id = ?', [dbData, id]);
        } else {
            await pool.query('INSERT INTO sidebar_widgets SET ?', [dbData]);
        }
        
        revalidatePath('/admin/sidebar');
        revalidatePath('/(site)');
        return { success: true };
    } catch (e: any) {
        console.error("Error saving sidebar widget:", e.message);
        return { success: false, error: e.message };
    }
}


export async function deleteSidebarWidget(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    try {
        await pool.query('DELETE FROM sidebar_widgets WHERE id = ?', [id]);
        revalidatePath('/admin/sidebar');
        revalidatePath('/(site)');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
