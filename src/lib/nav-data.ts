
'use server';

import pool, { queryWithRetry } from './db';
import { revalidatePath } from 'next/cache';

/*
SQL for creating the nav_links table:

CREATE TABLE `nav_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `href` varchar(255) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `nav_links_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `nav_links` (`id`) ON DELETE CASCADE
);
*/


export interface NavLink {
  id: number;
  title: string;
  href: string | null;
  parent_id: number | null;
  sort_order: number;
  icon: string | null;
  subLinks?: NavLink[];
}

const mockNavLinks: NavLink[] = [
  { id: 1, title: 'হোম', href: '/', icon: 'Home', parent_id: null, sort_order: 1 },
  { id: 2, title: 'স্কুল সম্পর্কিত', href: '/school-details', icon: null, parent_id: null, sort_order: 2 },
  { id: 3, title: 'কমিটি', href: '/committee', icon: null, parent_id: null, sort_order: 3 },
  { id: 4, title: 'ভর্তি নির্দেশিকা', href: '/admission-guidelines', icon: null, parent_id: null, sort_order: 4 },
  { id: 5, title: 'ফলাফল', href: '/results', icon: null, parent_id: null, sort_order: 5 },
  { id: 6, title: 'সকল ফরমস', href: '/forms', icon: null, parent_id: null, sort_order: 6 },
  { id: 7, title: 'যোগাযোগ ও ফিডব্যাক', href: '/contact', icon: null, parent_id: null, sort_order: 7 },
  { id: 8, title: 'গ্যালারি', href: null, icon: null, parent_id: null, sort_order: 8,
    subLinks: [
      { id: 9, title: 'ছবি গ্যালারি', href: '/gallery', parent_id: 8, sort_order: 1, icon: null },
      { id: 10, title: 'ভিডিও গ্যালারি', href: '/#video-gallery', parent_id: 8, sort_order: 2, icon: null },
    ],
  },
];

export async function getNavLinks(): Promise<NavLink[]> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for nav links.");
        for (const link of mockNavLinks) {
            if (link.subLinks) {
                link.subLinks.sort((a, b) => a.sort_order - b.sort_order);
            }
        }
        return mockNavLinks.sort((a, b) => a.sort_order - b.sort_order);
    }
    try {
        const rows = await queryWithRetry<NavLink[]>('SELECT * FROM nav_links ORDER BY parent_id ASC, sort_order ASC');
        const links = rows;
        
        const linkMap: { [key: number]: NavLink } = {};
        const topLevelLinks: NavLink[] = [];

        for (const link of links) {
            link.subLinks = [];
            linkMap[link.id] = link;
        }

        for (const link of links) {
            if (link.parent_id) {
                if (linkMap[link.parent_id]) {
                    linkMap[link.parent_id].subLinks!.push(link);
                }
            } else {
                topLevelLinks.push(link);
            }
        }
        
        return topLevelLinks.sort((a,b) => a.sort_order - b.sort_order);

    } catch (error) {
        console.error('Failed to fetch nav links, returning mock data:', error);
        return mockNavLinks.sort((a, b) => a.sort_order - b.sort_order);
    }
}

export async function getNavLinkById(id: string | number): Promise<NavLink | null> {
    if (!pool) return null;
    try {
        const rows = await queryWithRetry<NavLink[]>('SELECT * FROM nav_links WHERE id = ?', [id]);
        return (rows as any)[0] || null;
    } catch (error) {
        console.error(`Failed to fetch nav link by id ${id}:`, error);
        return null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveNavLink(data: Omit<NavLink, 'id' | 'subLinks'>, id?: number): Promise<SaveResult> {
  if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  
  const { title, href, parent_id, sort_order, icon } = data;
  const dbData = { title, href: href || null, parent_id: parent_id || null, sort_order, icon: icon || null };

  try {
    if (id) {
      await queryWithRetry('UPDATE nav_links SET ? WHERE id = ?', [dbData, id]);
    } else {
      await queryWithRetry('INSERT INTO nav_links SET ?', [dbData]);
    }
    revalidatePath('/admin/nav-manager');
    revalidatePath('/(site)/layout', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save nav link:", error);
    return { success: false, error: "A server error occurred." };
  }
}

export async function deleteNavLink(id: number): Promise<SaveResult> {
  if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    await queryWithRetry('DELETE FROM nav_links WHERE id = ?', [id]);
    revalidatePath('/admin/nav-manager');
    revalidatePath('/(site)/layout', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete nav link:", error);
    if (error.code?.includes('ER_ROW_IS_REFERENCED')) {
      return { success: false, error: "Cannot delete a parent link with sub-links. Please delete the sub-links first." };
    }
    return { success: false, error: "A server error occurred." };
  }
}
