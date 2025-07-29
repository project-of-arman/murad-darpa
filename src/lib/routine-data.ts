
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

export interface Routine extends RowDataPacket {
  id: number;
  class_name: string;
  day_of_week: string;
  period: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_name: string;
}

const mockRoutines: Routine[] = [
  // This is just for fallback if DB is not connected
  { id: 1, class_name: '১০ম শ্রেণী', day_of_week: 'রবিবার', period: 1, start_time: '09:00', end_time: '09:40', subject: 'বাংলা ১ম পত্র', teacher_name: 'আয়েশা সিদ্দিকা' },
  { id: 2, class_name: '১০ম শ্রেণী', day_of_week: 'রবিবার', period: 2, start_time: '09:40', end_time: '10:20', subject: 'ইংরেজি ১ম পত্র', teacher_name: 'কামরুল হাসান' },
];

export async function getRoutines(): Promise<Routine[]> {
  if (!pool) {
    console.warn("Database not connected. Returning mock data for routines.");
    return mockRoutines as Routine[];
  }
  try {
    const [rows] = await pool.query('SELECT * FROM routines ORDER BY class_name, FIELD(day_of_week, "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"), period');
    return rows as Routine[];
  } catch (error) {
    console.error('Failed to fetch routines, returning mock data:', error);
    return mockRoutines as Routine[];
  }
}

export async function getRoutineById(id: string | number): Promise<Routine | null> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for a routine.");
        return mockRoutines.find(r => r.id.toString() === id.toString()) || null;
    }
    try {
        const [rows] = await pool.query<Routine[]>('SELECT * FROM routines WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to fetch routine by id ${id}, returning mock data:`, error);
        return mockRoutines.find(r => r.id.toString() === id.toString()) || null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveRoutine(
  data: Omit<Routine, 'id'>,
  id?: number
): Promise<SaveResult> {
  if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    const { class_name, day_of_week, period, start_time, end_time, subject, teacher_name } = data;
    if (id) {
      // Update
      const query = 'UPDATE routines SET class_name = ?, day_of_week = ?, period = ?, start_time = ?, end_time = ?, subject = ?, teacher_name = ? WHERE id = ?';
      await pool.query(query, [class_name, day_of_week, period, start_time, end_time, subject, teacher_name, id]);
    } else {
      // Insert
      const query = 'INSERT INTO routines (class_name, day_of_week, period, start_time, end_time, subject, teacher_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
      await pool.query(query, [class_name, day_of_week, period, start_time, end_time, subject, teacher_name]);
    }
    revalidatePath('/admin/routine');
    revalidatePath('/(site)/routine');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save routine:", error);
    if (error.code === 'ER_DUP_ENTRY') {
        return { success: false, error: "এই ক্লাসের এই দিনে এই পিরিয়ডটি ইতিমধ্যে তৈরি করা আছে।" };
    }
    return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}

export async function deleteRoutine(id: number): Promise<SaveResult> {
   if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    await pool.query('DELETE FROM routines WHERE id = ?', [id]);
    revalidatePath('/admin/routine');
    revalidatePath('/(site)/routine');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete routine:", error);
    return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}
