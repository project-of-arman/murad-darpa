
'use server';

import pool, { queryWithRetry } from './db';
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

-- Use this SQL to alter existing tables:
ALTER TABLE `notices` MODIFY COLUMN `file_data` LONGBLOB DEFAULT NULL;
ALTER TABLE `notices` MODIFY COLUMN `file_name` VARCHAR(255) DEFAULT NULL;

*/


export interface Notice {
  id: number;
  title: string;
  date: string;
  description: string;
  is_marquee?: boolean;
  file_name: string | null;
}

export async function getNotices(options: { is_marquee?: boolean } = {}): Promise<Notice[]> {
    const { is_marquee } = options;

    if (!pool) {
        console.warn("Database not connected. Notices will be empty.");
        return [];
    }
    
    try {
        let query = 'SELECT id, title, date, description, is_marquee, file_name FROM notices ORDER BY id DESC';
        const params: any[] = [];
        
        if (is_marquee) {
            query = 'SELECT id, title, date, description, is_marquee, file_name FROM notices WHERE is_marquee = ? ORDER BY id DESC';
            params.push(true);
        }

        const rows = await queryWithRetry<Notice[]>(query, params);
        return rows;
    } catch (error) {
        console.error('Failed to fetch notices:', error);
        return [];
    }
}

export async function getNoticeById(id: string): Promise<Notice | null> {
    if (!pool) {
        console.warn("Database not connected. Notice will be null.");
        return null;
    }
    try {
        const rows = await queryWithRetry<Notice[]>('SELECT id, title, date, description, is_marquee, file_name FROM notices WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to fetch notice by id ${id}:`, error);
        return null;
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

        const fileBuffer = data.file && data.file.size > 0 ? Buffer.from(await data.file.arrayBuffer()) : null;
        
        const getFileExtension = (filename: string) => {
            return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
        }
        
        const fieldsToUpdate: { [key: string]: any } = {
            title: data.title,
            date: data.date,
            description: data.description,
            is_marquee: data.is_marquee,
        };

        if (fileBuffer && data.file) {
            const extension = getFileExtension(data.file.name);
            fieldsToUpdate.file_data = fileBuffer;
            fieldsToUpdate.file_name = `${data.title.replace(/\s/g, '_')}.${extension}`;
        }
        
        if (id) {
            // If updating and no new file is provided, we might want to keep the old one.
            // This logic assumes we replace or clear. If we want to clear, we should set fields to NULL.
            if (!fileBuffer) {
                // If you want to allow clearing the file on update, you'd do:
                // fieldsToUpdate.file_data = null;
                // fieldsToUpdate.file_name = null;
            }
             await pool.query('UPDATE notices SET ? WHERE id = ?', [fieldsToUpdate, id]);
        } else {
             // On insert, if there's no file, don't include those columns in the insert
             const query = 'INSERT INTO notices SET ?';
             if (!fileBuffer) {
                 delete fieldsToUpdate.file_data;
                 delete fieldsToUpdate.file_name;
             }
            await pool.query(query, [fieldsToUpdate]);
        }
        
        revalidatePath('/admin/notices');
        revalidatePath('/(site)/notice');
        revalidatePath('/(site)/');
        if (id) {
            revalidatePath(`/api/notice-file/${id}`);
            revalidatePath(`/(site)/notice/${id}`);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Failed to save notice:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}


export async function deleteNotice(id: number): Promise<SaveResult> {
   if (!pool) return { success: false, error: "Database not connected." };
  try {
    await queryWithRetry('DELETE FROM notices WHERE id = ?', [id]);
    revalidatePath('/admin/notices');
    revalidatePath('/(site)/notice');
    revalidatePath('/(site)/');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete notice:", error);
    return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}
