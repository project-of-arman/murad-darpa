
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

export interface ExamRoutine extends RowDataPacket {
  id: number;
  class_name: string;
  exam_name: string;
  subject: string;
  exam_date: string; // Stored as DATE, retrieved as string
  start_time: string; // Stored as TIME, retrieved as string
  end_time: string; // Stored as TIME, retrieved as string
}

export async function getExamRoutines(): Promise<ExamRoutine[]> {
  if (!pool) {
    console.error("Database not connected.");
    return [];
  }
  try {
    const [rows] = await pool.query('SELECT * FROM exam_routines ORDER BY exam_date, start_time');
    return rows as ExamRoutine[];
  } catch (error: any) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
        console.warn('`exam_routines` table not found. Returning empty array.');
        return [];
    }
    console.error('Failed to fetch exam routines:', error);
    return [];
  }
}

export async function getExamRoutineById(id: string | number): Promise<ExamRoutine | null> {
    if (!pool) return null;
    try {
        const [rows] = await pool.query<ExamRoutine[]>('SELECT * FROM exam_routines WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to fetch exam routine by id ${id}:`, error);
        return null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveExamRoutine(
  data: Omit<ExamRoutine, 'id'>,
  id?: number
): Promise<SaveResult> {
  if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    const { class_name, exam_name, subject, exam_date, start_time, end_time } = data;
    
    // Basic validation
    if (!class_name || !exam_name || !subject || !exam_date || !start_time || !end_time) {
        return { success: false, error: "All fields are required." };
    }

    if (id) {
      // Update
      const query = 'UPDATE exam_routines SET class_name = ?, exam_name = ?, subject = ?, exam_date = ?, start_time = ?, end_time = ? WHERE id = ?';
      await pool.query(query, [class_name, exam_name, subject, exam_date, start_time, end_time, id]);
    } else {
      // Insert
      const query = 'INSERT INTO exam_routines (class_name, exam_name, subject, exam_date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)';
      await pool.query(query, [class_name, exam_name, subject, exam_date, start_time, end_time]);
    }
    revalidatePath('/admin/exam-routine');
    revalidatePath('/exam-routine');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save exam routine:", error);
    return { success: false, error: "A server error occurred." };
  }
}

export async function deleteExamRoutine(id: number): Promise<SaveResult> {
   if (!pool) {
    return { success: false, error: "Database not connected." };
  }
  try {
    await pool.query('DELETE FROM exam_routines WHERE id = ?', [id]);
    revalidatePath('/admin/exam-routine');
    revalidatePath('/exam-routine');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete exam routine:", error);
    return { success: false, error: "A server error occurred." };
  }
}
