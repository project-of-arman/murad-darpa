
'use server';

import pool from '../db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { RowDataPacket } from 'mysql2';


export interface AdminAccount extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  phone: string;
}

const createFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const updateFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  newPassword: z.string().min(6, "Password must be at least 6 characters.").optional(),
});


type AuthResult = { success: boolean; error?: string };

/*
SQL for creating the admin_users table:

CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
);
*/

export async function hasAdminAccount(): Promise<boolean> {
    if (!pool) return false;
    try {
        const [rows] = await pool.query<{ count: number }[]>('SELECT COUNT(*) as count FROM admin_users');
        return rows[0].count > 0;
    } catch (error: any) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return false;
        }
        console.error("Failed to check for admin account:", error);
        return false;
    }
}

export async function getAdminAccount(): Promise<AdminAccount | null> {
    if (!pool) return null;
    try {
        const [rows] = await pool.query<AdminAccount[]>('SELECT id, username, email, phone FROM admin_users LIMIT 1');
        return rows[0] || null;
    } catch (error) {
        console.error("Failed to get admin account:", error);
        return null;
    }
}

export async function createAdmin(formData: FormData): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected.' };

    const adminExists = await hasAdminAccount();
    if (adminExists) {
        return { success: false, error: 'An admin account already exists.' };
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = createFormSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') };
    }

    try {
        const { username, email, phone, password } = parsed.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO admin_users (username, email, phone, password) VALUES (?, ?, ?, ?)', [username, email, phone, hashedPassword]);

        return { success: true };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, error: 'Username, email, or phone already exists.' };
        }
        console.error('Failed to create admin:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

export async function updateAdminCredentials(formData: FormData): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected.' };

    const data = Object.fromEntries(formData.entries());
    const parsed = updateFormSchema.safeParse(data);

     if (!parsed.success) {
        return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') };
    }
    
    try {
        const { username, email, phone, newPassword } = parsed.data;
        const fieldsToUpdate: {[key: string]: any} = { username, email, phone };

        if (newPassword) {
            fieldsToUpdate.password = await bcrypt.hash(newPassword, 10);
        }

        // There should only be one admin, so we update the first one found.
        await pool.query('UPDATE admin_users SET ? ORDER BY id LIMIT 1', [fieldsToUpdate]);
        
        return { success: true };
    } catch(e: any) {
        console.error('Failed to update admin credentials:', e);
         if (e.code === 'ER_DUP_ENTRY') {
            return { success: false, error: 'Username, email, or phone already taken.' };
        }
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

export async function login(formData: FormData): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected.' };

    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    if (!identifier || !password) {
        return { success: false, error: 'Identifier and password are required.' };
    }

    try {
        const [rows] = await pool.query<any[]>('SELECT * FROM admin_users WHERE username = ? OR email = ? OR phone = ?', [identifier, identifier, identifier]);
        const user = rows[0];

        if (!user) {
            return { success: false, error: 'Invalid credentials.' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { success: false, error: 'Invalid credentials.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
