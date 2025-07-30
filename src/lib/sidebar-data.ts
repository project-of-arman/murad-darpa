
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

const mockChairmanWidget: SidebarWidget = {
    id: 1,
    widget_type: 'profile',
    title: 'চেয়ারম্যান মহোদয়',
    subtitle: 'প্রফেসর মোঃ তৌহিদুল ইসলাম',
    image_url: 'https://dinajpureducationboard.gov.bd/sites/default/files/files/dinajpureducationboard.portal.gov.bd/officer_list/f9cf0e70_e4af_4764_8abe_83a9633483c9/Professor%20Md.%20Towhidul%20Islam.jpeg',
    link_url: null,
    link_text: null,
    content: null,
    sort_order: 1
};

const mockSecretaryWidget: SidebarWidget = {
    id: 2,
    widget_type: 'profile',
    title: 'সচিব',
    subtitle: 'প্রফেসর নূর মোঃ আব্দুর রাজ্জাক',
    image_url: 'https://images.unsplash.com/photo-1640583818579-740430212d27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8YmFuZ2xhZGVzaGklMjB0ZWFjaGVyfGVufDB8fHx8MTc1MzQxNDQ5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    link_url: null,
    link_text: null,
    content: null,
    sort_order: 2
};

const mockEServicesWidget: SidebarWidget = {
    id: 3,
    widget_type: 'links',
    title: 'অভ্যন্তরীণ ই-সেবাসমূহ',
    subtitle: null,
    image_url: null,
    link_url: '#',
    link_text: 'সকল',
    content: JSON.stringify([
        { text: "ই-নথি", url: "#" },
        { text: "DBTP", url: "#" },
        { text: "Sonali Sheba", url: "#" },
        { text: "বিদেশগামী শিক্ষার্থীদের অনলাইন যাচাই/সত্যায়ন", url: "#" },
        { text: "Sonali Bank Account Entry", url: "#" }
    ]),
    sort_order: 3
};





const mockNationalPortalWidget: SidebarWidget = {
    id: 7,
    widget_type: 'image_link',
    title: 'National Portal',
    subtitle: null,
    image_url: 'https://dinajpureducationboard.gov.bd/sites/default/files/files/bmeb.portal.gov.bd/page/f35745b2_55a9_4633_afe5_a2ccd180add8/National-portal_bn.gif',
    link_url: '#',
    link_text: null,
    content: null,
    sort_order: 6
};

const mockImportantLinksWidget: SidebarWidget = {
    id: 6,
    widget_type: 'links',
    title: 'গুরুত্বপূর্ণ লিঙ্ক সমূহ',
    subtitle: null,
    image_url: null,
    link_url: null,
    link_text: null,
    content: JSON.stringify([
        { text: "জনপ্রশাসন মন্ত্রণালয়", url: "#" },
        { text: "শিক্ষা মন্ত্রনালয়", url: "#" },
        { text: "প্রাথমিক শিক্ষা অধিদপ্তর", url: "#" },
        { text: "মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর", url: "#" }
    ]),
    sort_order: 7
};

const mockInternalEserviceWidget: SidebarWidget = {
    id: 8,
    widget_type: 'image_link',
    title: 'Internal E-Service',
    subtitle: null,
    image_url: 'https://dinajpureducationboard.gov.bd/sites/default/files/files/bmeb.portal.gov.bd/page/f35745b2_55a9_4633_afe5_a2ccd180add8/internal_eservice2.gif',
    link_url: '#',
    link_text: null,
    content: null,
    sort_order: 8
};


const mockWidgets: SidebarWidget[] = [
    mockChairmanWidget,
    mockSecretaryWidget,
    mockEServicesWidget, 
    mockInternalEserviceWidget, 
    mockNationalPortalWidget,
    mockImportantLinksWidget,
].sort((a, b) => a.sort_order - b.sort_order);


export async function getSidebarWidgets(): Promise<SidebarWidget[]> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for sidebar widgets.");
        return mockWidgets;
    }
    try {
        const query = 'SELECT id, widget_type, title, subtitle, link_url, link_text, content, sort_order, IF(image_url IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image_url)), NULL) as image_url FROM sidebar_widgets ORDER BY sort_order ASC';
        const rows = await queryWithRetry<SidebarWidget[]>(query);
        return rows as SidebarWidget[];
    } catch (error) {
        console.error('Failed to fetch sidebar widgets, returning mock data:', error);
        return mockWidgets;
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
