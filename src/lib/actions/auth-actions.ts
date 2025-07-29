
'use server';

import pool from '../db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const createFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const updateFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  newPassword: z.string().min(6, "Password must be at least 6 characters.").optional(),
});


type AuthResult = { success: boolean; error?: string };

/*
SQL for creating the admin_users table:

CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
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

export async function getAdminUsername(): Promise<string | null> {
    if (!pool) return null;
    try {
        const [rows] = await pool.query<any[]>('SELECT username FROM admin_users LIMIT 1');
        return rows[0]?.username || null;
    } catch (error) {
        console.error("Failed to get admin username:", error);
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
        const { username, password } = parsed.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO admin_users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        return { success: true };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, error: 'Username already exists.' };
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
        const { username, newPassword } = parsed.data;
        const fieldsToUpdate: {[key: string]: any} = { username };

        if (newPassword) {
            fieldsToUpdate.password = await bcrypt.hash(newPassword, 10);
        }

        // There should only be one admin, so we update the first one found.
        await pool.query('UPDATE admin_users SET ? ORDER BY id LIMIT 1', [fieldsToUpdate]);
        
        return { success: true };
    } catch(e: any) {
        console.error('Failed to update admin credentials:', e);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

export async function login(formData: FormData): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected.' };

    const data = Object.fromEntries(formData.entries());
    const username = data.username as string;
    const password = data.password as string;

    if (!username || !password) {
        return { success: false, error: 'Username and password are required.' };
    }

    try {
        const [rows] = await pool.query<any[]>('SELECT * FROM admin_users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return { success: false, error: 'Invalid username or password.' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { success: false, error: 'Invalid username or password.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
