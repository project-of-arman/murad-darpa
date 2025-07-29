
'use server';

import pool from './db';

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
  {
    id: 1,
    title: 'হোম',
    href: '/',
    icon: 'Home',
    parent_id: null,
    sort_order: 1,
  },
  {
    id: 2,
    title: 'স্কুল সম্পর্কিত',
    href: '/school-details',
    icon: null,
    parent_id: null,
    sort_order: 2,
  },
  {
    id: 3,
    title: 'কমিটি',
    href: '/committee',
    icon: null,
    parent_id: null,
    sort_order: 3,
  },
  {
    id: 4,
    title: 'ভর্তি নির্দেশিকা',
    href: '/admission-guidelines',
    icon: null,
    parent_id: null,
    sort_order: 4,
  },
  {
    id: 5,
    title: 'ফলাফল',
    href: '/results',
    icon: null,
    parent_id: null,
    sort_order: 5,
  },
  {
    id: 6,
    title: 'সকল ফরমস',
    href: '/forms',
    icon: null,
    parent_id: null,
    sort_order: 6,
  },
  {
    id: 7,
    title: 'যোগাযোগ ও ফিডব্যাক',
    href: '/contact',
    icon: null,
    parent_id: null,
    sort_order: 7,
  },
  {
    id: 8,
    title: 'গ্যালারি',
    href: null,
    icon: null,
    parent_id: null,
    sort_order: 8,
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
        // Fetch all links, sorted by parent and then by order
        const [rows] = await pool.query('SELECT * FROM nav_links ORDER BY parent_id ASC, sort_order ASC');
        const links = rows as NavLink[];
        
        const linkMap: { [key: number]: NavLink } = {};
        const topLevelLinks: NavLink[] = [];

        // First pass: create a map of all links by their ID
        for (const link of links) {
            link.subLinks = [];
            linkMap[link.id] = link;
        }

        // Second pass: build the hierarchy
        for (const link of links) {
            if (link.parent_id) {
                // This is a sub-link
                if (linkMap[link.parent_id]) {
                    linkMap[link.parent_id].subLinks!.push(link);
                }
            } else {
                // This is a top-level link
                topLevelLinks.push(link);
            }
        }
        
        // The SQL query already sorts the links, including sub-links.
        // And since we process them in order, the sub-links should be pushed in the correct order.
        // We just need to sort the top-level links.
        return topLevelLinks.sort((a,b) => a.sort_order - b.sort_order);

    } catch (error) {
        console.error('Failed to fetch nav links, returning mock data:', error);
        for (const link of mockNavLinks) {
            if (link.subLinks) {
                link.subLinks.sort((a, b) => a.sort_order - b.sort_order);
            }
        }
        return mockNavLinks.sort((a, b) => a.sort_order - b.sort_order);
    }
}
