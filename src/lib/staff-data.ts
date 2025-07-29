
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';

/*
SQL for table `staff`:

CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` longblob,
  `address` text,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `data_ai_hint` varchar(255) DEFAULT 'staff portrait',
  PRIMARY KEY (`id`)
);

-- Use this SQL to alter existing tables:
ALTER TABLE `staff` MODIFY COLUMN `image` LONGBLOB;

*/


export interface Staff {
  id: number;
  name: string;
  role: string;
  image: string | Buffer;
  address: string;
  phone: string;
  email: string;
  data_ai_hint: string;
}

const mockStaff: Staff[] = [
    {
      id: 1,
      name: "মোঃ রফিকুল ইসলাম",
      role: "হিসাবরক্ষক",
      image: "https://placehold.co/300x400.png",
      address: "ঢাকা, বাংলাদেশ",
      phone: "01712345678",
      email: "rafiqul@example.com",
      data_ai_hint: "male staff portrait"
    },
    {
      id: 2,
      name: "আকলিমা খাতুন",
      role: "অফিস সহকারী",
      image: "https://placehold.co/300x400.png",
      address: "ঢাকা, বাংলাদেশ",
      phone: "01812345678",
      email: "aklima@example.com",
      data_ai_hint: "female staff portrait"
    }
  ];

export async function getStaff(): Promise<Staff[]> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data.");
        return mockStaff;
    }
    try {
        const [rows] = await pool.query('SELECT *, IF(image IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image)), NULL) as image FROM staff');
        return rows as Staff[];
    } catch (error) {
        console.error('Failed to fetch staff, returning mock data:', error);
        return mockStaff;
    }
}

export async function getStaffById(id: number): Promise<Staff | null> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data.");
        return mockStaff.find(t => t.id === id) || null;
    }
    try {
        const [rows] = await pool.query('SELECT *, IF(image IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image)), NULL) as image FROM staff WHERE id = ?', [id]);
        const staff = rows as Staff[];
        return staff[0] || null;
    } catch (error) {
        console.error(`Failed to fetch staff by id ${id}:`, error);
        return mockStaff.find(t => t.id === id) || null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveStaff(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }

    try {
        const data = {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            email: (formData.get('email') as string) || null,
            phone: (formData.get('phone') as string) || null,
            address: (formData.get('address') as string) || null,
            image: formData.get('image') as Blob | null,
            data_ai_hint: (formData.get('dataAiHint') as string) || 'staff portrait',
        };

        const imageBuffer = data.image ? Buffer.from(await data.image.arrayBuffer()) : null;
        
        const dbData = {
            name: data.name,
            role: data.role,
            email: data.email,
            phone: data.phone,
            address: data.address,
            image: imageBuffer,
            data_ai_hint: data.data_ai_hint,
        };

        if (id) {
            // Update
            const fieldsToUpdate: { [key: string]: any } = { ...dbData };
            if (!imageBuffer) {
                delete fieldsToUpdate.image; // Don't update image if not provided
            }
            await pool.query('UPDATE staff SET ? WHERE id = ?', [fieldsToUpdate, id]);
        } else {
            // Insert
             await pool.query('INSERT INTO staff SET ?', [dbData]);
        }

        revalidatePath('/admin/staff');
        revalidatePath('/(site)/staff');
        if (id) {
            revalidatePath(`/(site)/staff/${id}`);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to save staff:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}


export async function deleteStaff(id: number): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }
    try {
        await pool.query('DELETE FROM staff WHERE id = ?', [id]);
        
        revalidatePath('/admin/staff');
        revalidatePath('/(site)/staff');

        return { success: true };
    } catch (error) {
        console.error("Failed to delete staff:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}
