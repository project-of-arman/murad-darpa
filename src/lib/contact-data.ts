
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

// ========= TYPES =========
export interface ContactInfo extends RowDataPacket {
  id: number;
  school_name: string;
  address: string;
  phone: string;
  email: string;
  map_embed_url: string;
}

export interface ContactSubmission extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

type SaveResult = { success: boolean; error?: string };

// ========= DATABASE ACTIONS =========

// --- Contact Info Actions ---

export async function getContactInfo(): Promise<ContactInfo | null> {
  if (!pool) {
    console.error("Database not connected.");
    return null;
  }
  try {
    const [rows] = await pool.query<ContactInfo[]>('SELECT * FROM contact_info LIMIT 1');
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    return null;
  }
}

export async function saveContactInfo(data: Omit<ContactInfo, 'id'>): Promise<SaveResult> {
  if (!pool) return { success: false, error: 'Database not connected' };
  try {
    await pool.query('UPDATE contact_info SET ? WHERE id = 1', [data]);
    revalidatePath('/admin/contact');
    revalidatePath('/(site)/contact');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to save contact info:', error);
    return { success: false, error: 'Failed to save data' };
  }
}

// --- Contact Submission Actions ---

export async function saveContactSubmission(data: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<SaveResult> {
    if (!pool) return { success: false, error: 'Database not connected' };
    try {
        const query = 'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)';
        await pool.query(query, [data.name, data.email, data.subject, data.message]);
        revalidatePath('/admin/contact');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to save contact submission:', error);
        return { success: false, error: 'Failed to send message' };
    }
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    if (!pool) return [];
    try {
        const [rows] = await pool.query<ContactSubmission[]>('SELECT * FROM contact_submissions ORDER BY created_at DESC');
        return rows;
    } catch (error) {
        console.error('Failed to fetch contact submissions:', error);
        return [];
    }
}

export async function deleteContactSubmission(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: 'Database not connected' };
    try {
        await pool.query('DELETE FROM contact_submissions WHERE id = ?', [id]);
        revalidatePath('/admin/contact');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete contact submission:', error);
        return { success: false, error: 'Failed to delete submission' };
    }
}
