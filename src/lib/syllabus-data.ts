
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

export interface Syllabus extends RowDataPacket {
  id: number;
  class_name: string;
  subject: string;
  file_url: string | null;
}

const mockSyllabuses: Syllabus[] = [
  { id: 1, class_name: '১০ম শ্রেণী', subject: 'বাংলা ১ম পত্র', file_url: '#' },
  { id: 2, class_name: '১০ম শ্রেণী', subject: 'গণিত', file_url: '#' },
];

export async function getSyllabuses(): Promise<Syllabus[]> {
  if (!pool) {
    console.warn("Database not connected. Returning mock data for syllabuses.");
    return mockSyllabuses as Syllabus[];
  }
  try {
    const [rows] = await pool.query('SELECT * FROM syllabuses ORDER BY class_name, subject');
    return rows as Syllabus[];
  } catch (error: any) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
        console.warn("`syllabuses` table not found. Returning mock data.");
        return mockSyllabuses as Syllabus[];
    }
    console.error('Failed to fetch syllabuses, returning mock data:', error);
    return mockSyllabuses as Syllabus[];
  }
}

export async function getSyllabusById(id: string | number): Promise<Syllabus | null> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for a syllabus.");
        return mockSyllabuses.find(r => r.id.toString() === id.toString()) || null;
    }
    try {
        const [rows] = await pool.query<Syllabus[]>('SELECT * FROM syllabuses WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to fetch syllabus by id ${id}, returning mock data:`, error);
        return mockSyllabuses.find(r => r.id.toString() === id.toString()) || null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveSyllabus(
  data: Omit<Syllabus, 'id'>,
  id?: number
): Promise<SaveResult> {
  if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    const { class_name, subject, file_url } = data;
    if (id) {
      // Update
      const query = 'UPDATE syllabuses SET class_name = ?, subject = ?, file_url = ? WHERE id = ?';
      await pool.query(query, [class_name, subject, file_url, id]);
    } else {
      // Insert
      const query = 'INSERT INTO syllabuses (class_name, subject, file_url) VALUES (?, ?, ?)';
      await pool.query(query, [class_name, subject, file_url]);
    }
    revalidatePath('/admin/syllabus');
    revalidatePath('/(site)/syllabus');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save syllabus:", error);
    if (error.code === 'ER_DUP_ENTRY') {
        return { success: false, error: "এই ক্লাসের জন্য এই বিষয়টি ইতিমধ্যে তৈরি করা আছে।" };
    }
    return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}

export async function deleteSyllabus(id: number): Promise<SaveResult> {
   if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    await pool.query('DELETE FROM syllabuses WHERE id = ?', [id]);
    revalidatePath('/admin/syllabus');
    revalidatePath('/(site)/syllabus');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete syllabus:", error);
    return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}
