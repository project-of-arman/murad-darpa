
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

// ========= MOCK DATA (for fallback) =========
const mockContactInfo: ContactInfo = {
  id: 1,
  school_name: 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়',
  address: '১ নং রোড, ব্লক এ, মিরপুর, ঢাকা-১২১৬',
  phone: '+৮৮০ ১২৩৪ ৫৬৭৮৯০',
  email: 'info@shikkhaangan.edu',
  map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.0950338381005!2d90.36399991544456!3d23.81513519228574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1e6c38a79ef%3A0x28637993b8f683f2!2sMirpur%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1675868516053!5m2!1sen!2sbd'
};

// ========= DATABASE ACTIONS =========

// --- Contact Info Actions ---

export async function getContactInfo(): Promise<ContactInfo> {
  if (!pool) return mockContactInfo;
  try {
    const [rows] = await pool.query<ContactInfo[]>('SELECT * FROM contact_info LIMIT 1');
    return rows[0] || mockContactInfo;
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    return mockContactInfo;
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
