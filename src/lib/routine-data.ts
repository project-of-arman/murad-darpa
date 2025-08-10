
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

export async function getRoutines(): Promise<Routine[]> {
  if (!pool) {
    console.error("Database not connected.");
    return [];
  }
  try {
    const [rows] = await pool.query<Routine[]>('SELECT * FROM routines');
    
    // Sort in application code for better performance than `FIELD` in SQL
    const dayOrder = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];
    rows.sort((a, b) => {
        if (a.class_name < b.class_name) return -1;
        if (a.class_name > b.class_name) return 1;
        const dayA = dayOrder.indexOf(a.day_of_week);
        const dayB = dayOrder.indexOf(b.day_of_week);
        if (dayA < dayB) return -1;
        if (dayA > dayB) return 1;
        if (a.period < b.period) return -1;
        if (a.period > b.period) return 1;
        return 0;
    });

    return rows;
  } catch (error) {
    console.error('Failed to fetch routines:', error);
    return [];
  }
}

export async function getRoutineById(id: string | number): Promise<Routine | null> {
    if (!pool) {
      console.error("Database not connected.");
      return null;
    }
    try {
        const [rows] = await pool.query<Routine[]>('SELECT * FROM routines WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to fetch routine by id ${id}:`, error);
        return null;
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
