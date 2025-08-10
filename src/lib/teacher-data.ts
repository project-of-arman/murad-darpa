
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';

/*
SQL for table `teachers`:
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` longblob,
  `address` text,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `educational_qualification` text,
  `experience` text,
  `dataAiHint` varchar(255) DEFAULT 'teacher portrait',
  PRIMARY KEY (`id`)
);

-- Use this SQL to alter existing tables:
ALTER TABLE `teachers` MODIFY COLUMN `image` LONGBLOB;

*/

export interface Teacher {
  id: string;
  name: string;
  role: string;
  image: string | Buffer;
  address: string;
  phone: string;
  email: string;
  educational_qualification: string | null;
  experience: string | null;
  dataAiHint: string;
}

export async function getTeachers(): Promise<Teacher[]> {
    if (!pool) {
        console.error("Database not connected.");
        return [];
    }
    try {
        const [rows] = await pool.query('SELECT *, IF(image IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image)), NULL) as image FROM teachers');
        return rows as Teacher[];
    } catch (error) {
        console.error('Failed to fetch teachers:', error);
        return [];
    }
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
    if (!pool) {
        console.error("Database not connected.");
        return null;
    }
    try {
        const [rows] = await pool.query('SELECT *, IF(image IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(image)), NULL) as image FROM teachers WHERE id = ?', [id]);
        const teachers = rows as Teacher[];
        return teachers[0] || null;
    } catch (error) {
        console.error(`Failed to fetch teacher by id ${id}:`, error);
        return null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveTeacher(formData: FormData, id?: string): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }

    const teacherData: { [key: string]: any } = {};
    formData.forEach((value, key) => {
        teacherData[key] = value || null;
    });

    try {
        const { name, role, email, phone, address, dataAiHint, educational_qualification, experience } = teacherData;
        
        const imageBlob = formData.get('image') as Blob | null;
        const imageBuffer = imageBlob ? Buffer.from(await imageBlob.arrayBuffer()) : null;

        
        let query;
        let params;
        
        if (id) {
            // Update
            const fieldsToUpdate: { [key: string]: any } = { name, role, email, phone, address, dataAiHint, educational_qualification, experience };
            if (imageBuffer) {
                fieldsToUpdate.image = imageBuffer;
            }
            query = 'UPDATE teachers SET ? WHERE id = ?';
            params = [fieldsToUpdate, id];
        } else {
            // Insert
            query = 'INSERT INTO teachers (name, role, email, phone, address, image, dataAiHint, educational_qualification, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            params = [name, role, email, phone, address, imageBuffer, dataAiHint, educational_qualification, experience];
        }

        await pool.query(query, params);

        revalidatePath('/admin/teachers');
        revalidatePath('/(site)/staff');
        revalidatePath('/(site)/teachers');

        return { success: true };
    } catch (error: any) {
        console.error("Failed to save teacher:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}

export async function deleteTeacher(id: string): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }
    try {
        await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
        
        revalidatePath('/admin/teachers');
        revalidatePath('/(site)/staff');
        revalidatePath('/(site)/teachers');

        return { success: true };
    } catch (error) {
        console.error("Failed to delete teacher:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}
