
'use server';

import pool from '../db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';


export interface AdminAccount extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: 'admin' | 'moderator' | 'visitor';
}

const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  role: z.enum(['admin', 'moderator', 'visitor']),
  password: z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
});


type AuthResult = { success: boolean; error?: string };

/*
SQL for creating/updating the admin_users table:

CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','moderator','visitor') NOT NULL DEFAULT 'visitor',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
);

-- Use this SQL to add the 'role' column to an existing table:
ALTER TABLE `admin_users`
ADD COLUMN `role` ENUM('admin', 'moderator', 'visitor') NOT NULL DEFAULT 'visitor' AFTER `password`;

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
        const [rows] = await pool.query<AdminAccount[]>('SELECT id, username, email, phone, role FROM admin_users LIMIT 1');
        return rows[0] || null;
    } catch (error) {
        console.error("Failed to get admin account:", error);
        return null;
    }
}

export async function getAllUsers(): Promise<AdminAccount[]> {
    if (!pool) return [];
    try {
        const [rows] = await pool.query<AdminAccount[]>('SELECT id, username, email, phone, role FROM admin_users ORDER BY username ASC');
        return rows;
    } catch (error) {
        console.error("Failed to get all users:", error);
        return [];
    }
}

export async function getUserById(id: number | string): Promise<AdminAccount | null> {
    if (!pool) return null;
    try {
        const [rows] = await pool.query<AdminAccount[]>('SELECT id, username, email, phone, role FROM admin_users WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Failed to get user by id ${id}:`, error);
        return null;
    }
}


export async function saveUser(formData: FormData, id?: number): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected.' };
    
    const data = Object.fromEntries(formData.entries());
    const parsed = userFormSchema.safeParse(data);
    
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') };
    }
    
    try {
        const { username, email, phone, password, role } = parsed.data;
        const fieldsToUpdate: {[key: string]: any} = { username, email, phone, role };

        if (password) {
            fieldsToUpdate.password = await bcrypt.hash(password, 10);
        } else if (!id) {
            // Password is required for new users
            return { success: false, error: "Password is required for new users." };
        }
        
        if (id) {
            await pool.query('UPDATE admin_users SET ? WHERE id = ?', [fieldsToUpdate, id]);
        } else {
            await pool.query('INSERT INTO admin_users SET ?', [fieldsToUpdate]);
        }
        
        revalidatePath('/admin/users');
        return { success: true };
    } catch(e: any) {
        console.error('Failed to save user:', e);
         if (e.code === 'ER_DUP_ENTRY') {
            return { success: false, error: 'Username, email, or phone already taken.' };
        }
        return { success: false, error: 'An unexpected error occurred.' };
    }
}


export async function deleteUser(id: number): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected' };
    
    // Prevent deleting the last admin account
    const [allUsers] = await pool.query<AdminAccount[]>('SELECT id, role FROM admin_users');
    const userToDelete = allUsers.find(u => u.id === id);
    const adminCount = allUsers.filter(u => u.role === 'admin').length;

    if (userToDelete?.role === 'admin' && adminCount <= 1) {
        return { success: false, error: "Cannot delete the last admin account." };
    }

    try {
        await pool.query('DELETE FROM admin_users WHERE id = ?', [id]);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (e: any) {
        console.error('Failed to delete user:', e);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}


export async function createAdmin(formData: FormData): Promise<AuthResult> {
    if (!pool) return { success: false, error: 'Database not connected.' };

    const adminExists = await hasAdminAccount();
    if (adminExists) {
        return { success: false, error: 'An admin account already exists.' };
    }
    
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    if (!password || !username || !email || !phone) {
        return { success: false, error: "All fields are required for setup." };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO admin_users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)', [username, email, phone, hashedPassword, 'admin']);
        return { success: true };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, error: 'Username, email, or phone already exists.' };
        }
        console.error('Failed to create admin:', error);
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
