
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';

export interface Notice {
  id: number;
  title: string;
  date: string;
  fileUrl: string;
  description: string;
  is_marquee?: boolean;
}

const mockNotices: Notice[] = [
    {
    id: 1,
    title: "ভর্তি পরীক্ষার ফলাফল প্রকাশ",
    date: "২০ জুলাই, ২০২৪",
    fileUrl: "#",
    description: "২০২৪-২৫ শিক্ষাবর্ষের ভর্তি পরীক্ষার ফলাফল প্রকাশিত হয়েছে। উত্তীর্ণ শিক্ষার্থীদের তালিকা এবং ভর্তির পরবর্তী নির্দেশনা জানতে পারবেন συνημμένο ফাইল থেকে।",
    is_marquee: true,
  },
  {
    id: 2,
    title: "বার্ষিক ক্রীড়া প্রতিযোগিতার সময়সূচী",
    date: "১৮ জুলাই, ২০২৪",
    fileUrl: "#",
    description: "প্রতিষ্ঠানের বার্ষিক ক্রীড়া প্রতিযোগিতা আগামী ২৫শে জুলাই অনুষ্ঠিত হবে। বিস্তারিত সময়সূচী জানতে পারবেন συνημμένο ফাইল থেকে।"
  },
  {
    id: 3,
    title: "অভিভাবক সমাবেশ সংক্রান্ত বিজ্ঞপ্তি",
    date: "১৫ জুলাই, ২০২৪",
    fileUrl: "#",
    description: "সকল শ্রেণীর শিক্ষার্থীদের অভিভাবকদের নিয়ে একটি গুরুত্বপূর্ণ সভা আগামী ২২শে জুলাই অনুষ্ঠিত হবে। আপনাদের উপস্থিতি একান্ত কাম্য।"
  },
  {
    id: 4,
    title: "গ্রীষ্মকালীন ছুটির নোটিশ",
    date: "১০ জুলাই, ২০২৪",
    fileUrl: "#",
    description: "আগামী ১লা আগস্ট থেকে ১৫ই আগস্ট পর্যন্ত গ্রীষ্মকালীন ছুটি উপলক্ষে প্রতিষ্ঠান বন্ধ থাকবে। ১৬ই আগস্ট থেকে যথারীতি ক্লাস চলবে।"
  },
    {
    id: 5,
    title: "বিজ্ঞান মেলার আয়োজন",
    date: "০৫ জুলাই, ২০২৪",
    fileUrl: "#",
    description: "আগামী ১০ই আগস্ট তারিখে বিদ্যালয়ে একটি বিজ্ঞান মেলার আয়োজন করা হয়েছে। আগ্রহী শিক্ষার্থীদের প্রকল্প জমা দেওয়ার জন্য অনুরোধ করা হলো।"
  },
  {
    id: 6,
    title: "ডিবেটিং ক্লাব সদস্য আহ্বান",
    date: "০২ জুলাই, ২০২৪",
    fileUrl: "#",
    description: "আমাদের স্কুলের ডিবেটিং ক্লাবের নতুন সদস্য আহ্বান করা হচ্ছে। আগ্রহী শিক্ষার্থীদের যোগাযোগ করার জন্য বলা হলো।"
  },
  {
    id: 7,
    title: "ঈদুল আযহা উপলক্ষে ছুটি",
    date: "২৮ জুন, ২০২৪",
    fileUrl: "#",
    description: "পবিত্র ঈদুল আযহা উপলক্ষে আগামী ৩০শে জুন থেকে ৫ই জুলাই পর্যন্ত স্কুল বন্ধ থাকবে।"
  },
  {
    id: 8,
    title: "কলেজ ইউনিফর্ম সংক্রান্ত বিজ্ঞপ্তি",
    date: "২৫ জুন, ২০২৪",
    fileUrl: "#",
    description: "সকল শিক্ষার্থীদের নতুন শিক্ষাবর্ষ থেকে নির্ধারিত ইউনিফর্ম পরিধান করার জন্য নির্দেশ দেওয়া হচ্ছে।"
  },
  {
    id: 9,
    title: "শিক্ষক-অভিভাবক সভা",
    date: "২০ জুন, ২০২৪",
    fileUrl: "#",
    description: "শিক্ষার্থীদের সার্বিক অবস্থা পর্যালোচনার জন্য একটি শিক্ষক-অভিভাবক সভা অনুষ্ঠিত হবে।"
  },
  {
    id: 10,
    title: "আন্তঃস্কুল ফুটবল টুর্নামেন্ট",
    date: "১৫ জুন, ২০২৪",
    fileUrl: "#",
    description: "আন্তঃস্কুল ফুটবল টুর্নামেন্টে অংশগ্রহণের জন্য আগ্রহী খেলোয়াড়দের নাম জমা দেওয়ার অনুরোধ করা হচ্ছে।"
  }
];

export async function getNotices(options: { is_marquee?: boolean } = {}): Promise<Notice[]> {
    const { is_marquee } = options;

    if (!pool) {
        console.warn("Database not connected. Returning mock data for notices.");
        if (is_marquee) {
            return mockNotices.filter(n => n.is_marquee);
        }
        return mockNotices;
    }
    
    try {
        let query = 'SELECT * FROM notices ORDER BY id DESC';
        const params: any[] = [];
        
        if (is_marquee) {
            query = 'SELECT * FROM notices WHERE is_marquee = ? ORDER BY id DESC';
            params.push(true);
        }

        const [rows] = await pool.query(query, params);
        return rows as Notice[];
    } catch (error) {
        console.error('Failed to fetch notices, returning mock data:', error);
        if (is_marquee) {
            return mockNotices.filter(n => n.is_marquee);
        }
        return mockNotices;
    }
}

export async function getNoticeById(id: string): Promise<Notice | null> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for notice.");
        return mockNotices.find(n => n.id.toString() === id) || null;
    }
    try {
        const [rows] = await pool.query('SELECT * FROM notices WHERE id = ?', [id]);
        const notices = rows as Notice[];
        return notices[0] || null;
    } catch (error) {
        console.error(`Failed to fetch notice by id ${id}, returning mock data:`, error);
        return mockNotices.find(n => n.id.toString() === id) || null;
    }
}


type SaveResult = { success: boolean; error?: string };

export async function saveNotice(
  data: Omit<Notice, 'id'>,
  id?: number
): Promise<SaveResult> {
  if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    if (id) {
      // Update
      const query = 'UPDATE notices SET title = ?, date = ?, description = ?, fileUrl = ?, is_marquee = ? WHERE id = ?';
      await pool.query(query, [data.title, data.date, data.description, data.fileUrl || null, data.is_marquee, id]);
    } else {
      // Insert
      const query = 'INSERT INTO notices (title, date, description, fileUrl, is_marquee) VALUES (?, ?, ?, ?, ?)';
      await pool.query(query, [data.title, data.date, data.description, data.fileUrl || null, data.is_marquee]);
    }
    revalidatePath('/admin/notices');
    revalidatePath('/(site)/notice');
    revalidatePath('/(site)/');
    return { success: true };
  } catch (error) {
    console.error("Failed to save notice:", error);
    return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}

export async function deleteNotice(id: number): Promise<SaveResult> {
   if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    await pool.query('DELETE FROM notices WHERE id = ?', [id]);
    revalidatePath('/admin/notices');
    revalidatePath('/(site)/notice');
    revalidatePath('/(site)/');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete notice:", error);
    return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}
