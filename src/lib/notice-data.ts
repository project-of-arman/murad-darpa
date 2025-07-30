
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';

/*
SQL for table `notices`:

CREATE TABLE `notices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `description` text,
  `is_marquee` tinyint(1) DEFAULT '0',
  `file_data` longblob,
  `file_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- Use this SQL to add new columns to an existing table:
ALTER TABLE `notices`
ADD COLUMN `file_data` LONGBLOB DEFAULT NULL,
ADD COLUMN `file_name` VARCHAR(255) DEFAULT NULL;

*/


export interface Notice {
  id: number;
  title: string;
  date: string;
  description: string;
  is_marquee?: boolean;
  file_name: string | null;
}

const mockNotices: Notice[] = [
    {
    id: 1,
    title: "ভর্তি পরীক্ষার ফলাফল প্রকাশ",
    date: "২০ জুলাই, ২০২৪",
    description: "২০২৪-২৫ শিক্ষাবর্ষের ভর্তি পরীক্ষার ফলাফল প্রকাশিত হয়েছে। উত্তীর্ণ শিক্ষার্থীদের তালিকা এবং ভর্তির পরবর্তী নির্দেশনা জানতে পারবেন συνημμένο ফাইল থেকে।",
    is_marquee: true,
    file_name: "result.pdf"
  },
  {
    id: 2,
    title: "বার্ষিক ক্রীড়া প্রতিযোগিতার সময়সূচী",
    date: "১৮ জুলাই, ২০২৪",
    description: "প্রতিষ্ঠানের বার্ষিক ক্রীড়া প্রতিযোগিতা আগামী ২৫শে জুলাই অনুষ্ঠিত হবে। বিস্তারিত সময়সূচী জানতে পারবেন συνημμένο ফাইল থেকে।",
    file_name: "sports-schedule.pdf"
  },
  // ... other notices
];

export async function getNotices(options: { is_marquee?: boolean } = {}): Promise<Notice[]> {
    const { is_marquee } = options;

    if (!pool) {
        console.warn("Database not connected. Returning mock data for notices.");
        return is_marquee ? mockNotices.filter(n => n.is_marquee) : mockNotices;
    }
    
    try {
        let query = 'SELECT id, title, date, description, is_marquee, file_name FROM notices ORDER BY id DESC';
        const params: any[] = [];
        
        if (is_marquee) {
            query = 'SELECT id, title, date, description, is_marquee, file_name FROM notices WHERE is_marquee = ? ORDER BY id DESC';
            params.push(true);
        }

        const [rows] = await pool.query(query, params);
        return rows as Notice[];
    } catch (error) {
        console.error('Failed to fetch notices, returning mock data:', error);
        return is_marquee ? mockNotices.filter(n => n.is_marquee) : mockNotices;
    }
}

export async function getNoticeById(id: string): Promise<Notice | null> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for notice.");
        return mockNotices.find(n => n.id.toString() === id) || null;
    }
    try {
        const [rows] = await pool.query('SELECT id, title, date, description, is_marquee, file_name FROM notices WHERE id = ?', [id]);
        const notices = rows as Notice[];
        return notices[0] || null;
    } catch (error) {
        console.error(`Failed to fetch notice by id ${id}, returning mock data:`, error);
        return mockNotices.find(n => n.id.toString() === id) || null;
    }
}


type SaveResult = { success: boolean; error?: string };

export async function saveNotice(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected." };

    try {
        const data = {
            title: formData.get('title') as string,
            date: formData.get('date') as string,
            description: formData.get('description') as string,
            is_marquee: formData.get('is_marquee') === 'true',
            file: formData.get('file') as File | null,
        };

        const fileBuffer = data.file ? Buffer.from(await data.file.arrayBuffer()) : null;
        
        if (id) {
            const fieldsToUpdate: any = {
                title: data.title,
                date: data.date,
                description: data.description,
                is_marquee: data.is_marquee,
            };
            if (fileBuffer) {
                fieldsToUpdate.file_data = fileBuffer;
                fieldsToUpdate.file_name = data.file?.name;
            }
            await pool.query('UPDATE notices SET ? WHERE id = ?', [fieldsToUpdate, id]);
        } else {
            const query = 'INSERT INTO notices (title, date, description, is_marquee, file_data, file_name) VALUES (?, ?, ?, ?, ?, ?)';
            await pool.query(query, [data.title, data.date, data.description, data.is_marquee, fileBuffer, data.file?.name || null]);
        }
        
        revalidatePath('/admin/notices');
        revalidatePath('/(site)/notice');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to save notice:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}

export async function deleteNotice(id: number): Promise<SaveResult> {
   if (!pool) return { success: false, error: "Database not connected." };
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
