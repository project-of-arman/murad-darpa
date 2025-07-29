
'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { RowDataPacket } from 'mysql2';

export interface Result extends RowDataPacket {
  id: number;
  student_id: number;
  exam_name: string;
  year: number;
  final_gpa: string;
  status: 'Promoted' | 'Failed';
}

export interface SubjectGrade extends RowDataPacket {
  id: number;
  result_id: number;
  subject_name: string;
  marks: string | null;
  grade: string;
  gpa: string;
}

export interface ResultWithStudentInfo extends RowDataPacket {
    id: number;
    student_name: string;
    student_roll: string;
    class_name: string;
    exam_name: string;
    year: number;
    final_gpa: string;
}

const subjectGradeSchema = z.object({
  subject_name: z.string().min(1, 'Subject name is required'),
  marks: z.string().optional(),
  grade: z.string().min(1, 'Grade is required'),
  gpa: z.string().min(1, 'GPA is required'),
});

const resultFormSchema = z.object({
  student_id: z.coerce.number().min(1, "শিক্ষার্থী নির্বাচন আবশ্যক।"),
  exam_name: z.string().min(1, "পরীক্ষার নাম আবশ্যক।"),
  year: z.coerce.number().min(2000, "বছর আবশ্যক।"),
  final_gpa: z.string().min(1, "চূড়ান্ত GPA আবশ্যক।"),
  status: z.enum(['Promoted', 'Failed']),
  subjects: z.array(subjectGradeSchema).min(1, "At least one subject is required."),
});

type SaveResult = { success: boolean; error?: string; resultId?: number };

export async function getAllResults(): Promise<ResultWithStudentInfo[]> {
    if (!pool) return [];
    try {
        const query = `
            SELECT 
                r.id, 
                s.name_bn as student_name,
                s.roll as student_roll,
                s.class_name,
                r.exam_name, 
                r.year, 
                r.final_gpa 
            FROM results r
            JOIN students s ON r.student_id = s.id
            ORDER BY r.year DESC, r.id DESC
        `;
        const [rows] = await pool.query(query);
        return rows as ResultWithStudentInfo[];
    } catch (error) {
        console.error('Failed to fetch all results:', error);
        return [];
    }
}

export async function getResultForEdit(id: number): Promise<(Result & { subjects: SubjectGrade[] }) | null> {
    if (!pool) return null;
    try {
        const [resultRows] = await pool.query<Result[]>('SELECT * FROM results WHERE id = ?', [id]);
        if (resultRows.length === 0) return null;
        
        const result = resultRows[0];
        
        const [subjectRows] = await pool.query<SubjectGrade[]>('SELECT * FROM subject_grades WHERE result_id = ?', [id]);
        
        return {
            ...result,
            subjects: subjectRows,
        };
    } catch (error) {
        console.error('Failed to fetch result for editing:', error);
        return null;
    }
}

export async function saveResult(data: unknown, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };

    const parsed = resultFormSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: JSON.stringify(parsed.error.flatten().fieldErrors) };
    }
    
    const { student_id, exam_name, year, final_gpa, status, subjects } = parsed.data;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Prevent duplicate results for the same student, exam, and year.
        const [existing] = await connection.query<Result[]>(
            'SELECT id FROM results WHERE student_id = ? AND exam_name = ? AND year = ? AND id != ?',
            [student_id, exam_name, year, id || 0]
        );

        if (existing.length > 0) {
            throw new Error('এই শিক্ষার্থীর জন্য এই পরীক্ষা ও বছরের ফলাফল ইতিমধ্যে বিদ্যমান।');
        }

        let resultId = id;

        if (id) { // Update
            await connection.query('UPDATE results SET ? WHERE id = ?', [{ student_id, exam_name, year, final_gpa, status }, id]);
            await connection.query('DELETE FROM subject_grades WHERE result_id = ?', [id]);
        } else { // Create
            const [result] = await connection.query('INSERT INTO results SET ?', [{ student_id, exam_name, year, final_gpa, status }]);
            resultId = (result as any).insertId;
        }

        if (!resultId) throw new Error("Failed to get result ID.");

        const subjectValues = subjects.map(s => [resultId, s.subject_name, s.marks, s.grade, s.gpa]);
        await connection.query('INSERT INTO subject_grades (result_id, subject_name, marks, grade, gpa) VALUES ?', [subjectValues]);
        
        await connection.commit();

        revalidatePath('/admin/results');
        return { success: true, resultId };

    } catch (e: any) {
        await connection.rollback();
        console.error("Failed to save result:", e);
        return { success: false, error: e.message || 'একটি সার্ভার ত্রুটি হয়েছে।' };
    } finally {
        connection.release();
    }
}


export async function deleteResult(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query('DELETE FROM subject_grades WHERE result_id = ?', [id]);
        await connection.query('DELETE FROM results WHERE id = ?', [id]);
        await connection.commit();
        
        revalidatePath('/admin/results');
        return { success: true };
    } catch (e: any) {
        await connection.rollback();
        console.error("Failed to delete result:", e);
        return { success: false, error: e.message || "একটি সার্ভার ত্রুটি হয়েছে।" };
    } finally {
        connection.release();
    }
}
