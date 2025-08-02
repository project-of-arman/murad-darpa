

'use server';

import pool, { queryWithRetry } from '../db';
import { revalidatePath } from 'next/cache';
import type { FormSubmission } from '../config/forms-config';
import { formConfigs } from '../config/forms-config';


/*
This file centralizes actions for all form submissions across the application.
It provides functions to:
- Fetch all submissions for a specific form type.
- Fetch a single submission by its ID and type.
- Update the status of a submission (e.g., to 'approved' or 'rejected').
- Delete a submission.
*/

// ========= HELPERS =========
// The queryWithRetry helper is now in db.ts


// ========= DATA FETCHING =========

export async function getFormSubmissions(formType: string): Promise<FormSubmission[]> {
  const config = formConfigs[formType];
  if (!config || !pool) return [];

  try {
    const columnKeys = config.columns.map(c => c.key).join(', ');
    const query = `SELECT id, ${columnKeys} FROM ${config.tableName} ORDER BY created_at DESC`;
    const rows = await queryWithRetry<FormSubmission[]>(query);
    return rows;
  } catch (error) {
    console.error(`Failed to fetch submissions for ${formType}:`, (error as Error).message);
    // Return empty array if table doesn't exist or another error occurs
    return [];
  }
}

export async function getSubmissionDetails(formType: string, id: number): Promise<FormSubmission | null> {
  const config = formConfigs[formType];
  if (!config || !pool) return null;

  try {
    const query = `SELECT * FROM ${config.tableName} WHERE id = ?`;
    const rows = await queryWithRetry<FormSubmission[]>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    const submission = rows[0];

    // Convert any Buffer fields to base64 strings
    for (const key in submission) {
      if (Buffer.isBuffer(submission[key])) {
        submission[key] = `data:image/jpeg;base64,${submission[key].toString('base64')}`;
      }
    }

    return submission;
  } catch (error) {
    console.error(`Failed to fetch submission details for ${formType} with id ${id}:`, (error as Error).message);
    return null;
  }
}


// ========= DATA MUTATION =========

type MutationResult = { success: boolean; error?: string };

async function createStudentFromApplication(application: any) {
  if (!pool) throw new Error("Database not connected");

  // Find the next available roll number for the given class and year
  const year = new Date().getFullYear();
  const [lastRollRows] = await pool.query<any[]>('SELECT MAX(CAST(roll AS UNSIGNED)) as max_roll FROM students WHERE class_name = ? AND year = ?', [application.applying_for_class, year]);
  
  const lastRoll = lastRollRows[0]?.max_roll || 0;
  const newRoll = (lastRoll + 1).toString();

  const studentData = {
    name_bn: application.student_name_bn,
    name_en: application.student_name_en,
    roll: newRoll,
    class_name: application.applying_for_class,
    year,
    dob: application.dob,
    birth_cert_no: application.birth_cert_no,
    gender: application.gender,
    religion: application.religion,
    blood_group: application.blood_group,
    previous_school: application.previous_school,
    father_name_bn: application.father_name_bn,
    father_name_en: application.father_name_en,
    father_nid: application.father_nid,
    father_mobile: application.father_mobile,
    mother_name_bn: application.mother_name_bn,
    mother_name_en: application.mother_name_en,
    mother_nid: application.mother_nid,
    mother_mobile: application.mother_mobile,
    present_address: application.present_address,
    permanent_address: application.permanent_address,
    image: application.student_photo_path,
  };

  await pool.query('INSERT INTO students SET ?', [studentData]);
}


export async function updateSubmissionStatus(formType: string, id: number, status: 'approved' | 'rejected'): Promise<MutationResult> {
  const config = formConfigs[formType];
  if (!config || !pool) return { success: false, error: 'Invalid request' };

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const query = `UPDATE ${config.tableName} SET status = ? WHERE id = ?`;
    await connection.query(query, [status, id]);

    if (formType === 'admission_applications' && status === 'approved') {
        const [appRows] = await connection.query<any[]>('SELECT * FROM admission_applications WHERE id = ?', [id]);
        if (appRows.length > 0) {
            await createStudentFromApplication(appRows[0]);
        }
    }
    
    await connection.commit();
    
    revalidatePath('/admin/forms');
    revalidatePath('/admin/students');

    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error(`Failed to update status for ${formType} with id ${id}:`, (error as Error).message);
    return { success: false, error: 'Database error' };
  } finally {
      connection.release();
  }
}

export async function deleteSubmission(formType: string, id: number): Promise<MutationResult> {
  const config = formConfigs[formType];
  if (!config || !pool) return { success: false, error: 'Invalid request' };

  try {
    const query = `DELETE FROM ${config.tableName} WHERE id = ?`;
    await queryWithRetry(query, [id]);
    revalidatePath('/admin/forms');
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete submission for ${formType} with id ${id}:`, (error as Error).message);
    return { success: false, error: 'Database error' };
  }
}

export async function getPendingSubmissionCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    if (!pool) return {};

    for (const formType in formConfigs) {
        const config = formConfigs[formType];
        try {
            const query = `SELECT COUNT(*) as count FROM ${config.tableName} WHERE status = 'pending'`;
            const rows = await queryWithRetry<{ count: number }[]>(query);
            counts[formType] = rows[0]?.count || 0;
        } catch (error) {
            // If table doesn't exist, count is 0.
            counts[formType] = 0;
        }
    }
    return counts;
}
