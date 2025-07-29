
'use server';

import pool from '../db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
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
    if (!pool) return false; // If no DB, assume no admin for setup flow
    try {
        const [rows] = await pool.query<{ count: number }[]>('SELECT COUNT(*) as count FROM admin_users');
        return rows[0].count > 0;
    } catch (error: any) {
        // If table doesn't exist, treat as no admin accounts
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return false;
        }
        console.error("Failed to check for admin account:", error);
        return false; // Fail safe
    }
}

export async function createAdmin(formData: FormData): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected.' };

    const adminExists = await hasAdminAccount();
    if (adminExists) {
        return { success: false, error: 'An admin account already exists.' };
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = formSchema.safeParse(data);

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
