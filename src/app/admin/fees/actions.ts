
'use server';

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

/*
SQL for creating the necessary tables:

CREATE TABLE `fee_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `default_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
);

CREATE TABLE `fee_collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `fee_type_id` int NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `month` varchar(20) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'paid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `fee_type_id` (`fee_type_id`),
  CONSTRAINT `fee_collections_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fee_collections_ibfk_2` FOREIGN KEY (`fee_type_id`) REFERENCES `fee_types` (`id`) ON DELETE CASCADE
);

*/


export interface FeeType extends RowDataPacket {
  id: number;
  name: string;
  default_amount: number;
}

export interface FeeCollection extends RowDataPacket {
    id: number;
    student_id: number;
    student_name: string;
    roll: string;
    class_name: string;
    fee_type_id: number;
    fee_type_name: string;
    amount_paid: number;
    payment_date: string;
    month: string | null;
    year: number | null;
}

type SaveResult = { success: boolean; error?: string };

// ========= FEE TYPE ACTIONS =========

export async function getFeeTypes(): Promise<FeeType[]> {
    if (!pool) return [];
    try {
        const [rows] = await pool.query<FeeType[]>('SELECT * FROM fee_types ORDER BY name ASC');
        return rows;
    } catch (e: any) {
        if (e.code === 'ER_NO_SUCH_TABLE') return [];
        console.error("Failed to fetch fee types:", e);
        return [];
    }
}

export async function saveFeeType(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: 'Database not connected' };

    try {
        const data = {
            name: formData.get('name') as string,
            default_amount: parseFloat(formData.get('default_amount') as string),
        };

        if (!data.name || isNaN(data.default_amount)) {
            return { success: false, error: 'Invalid input data.' };
        }

        if (id) {
            await pool.query('UPDATE fee_types SET ? WHERE id = ?', [data, id]);
        } else {
            await pool.query('INSERT INTO fee_types SET ?', [data]);
        }
        revalidatePath('/admin/fees');
        return { success: true };
    } catch (e: any) {
        if (e.code === 'ER_DUP_ENTRY') {
            return { success: false, error: 'This fee type name already exists.' };
        }
        console.error('Failed to save fee type:', e);
        return { success: false, error: 'A server error occurred.' };
    }
}

export async function deleteFeeType(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: 'Database not connected' };
    try {
        await pool.query('DELETE FROM fee_types WHERE id = ?', [id]);
        revalidatePath('/admin/fees');
        return { success: true };
    } catch (e: any) {
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
             return { success: false, error: 'Cannot delete fee type because it has associated payments.' };
        }
        console.error('Failed to delete fee type:', e);
        return { success: false, error: 'A server error occurred.' };
    }
}


// ========= FEE COLLECTION ACTIONS =========

export async function getFeeCollections(filters: { class_name?: string } = {}): Promise<FeeCollection[]> {
    if (!pool) return [];
    try {
        let query = `
            SELECT 
                fc.id, fc.student_id, fc.fee_type_id, fc.amount_paid, fc.payment_date, fc.month, fc.year,
                s.name_bn as student_name, s.roll, s.class_name,
                ft.name as fee_type_name
            FROM fee_collections fc
            JOIN students s ON fc.student_id = s.id
            JOIN fee_types ft ON fc.fee_type_id = ft.id
        `;
        
        const params: any[] = [];
        if (filters.class_name && filters.class_name !== 'all') {
            query += ' WHERE s.class_name = ?';
            params.push(filters.class_name);
        }

        query += ' ORDER BY fc.payment_date DESC, fc.id DESC';
        
        const [rows] = await pool.query<FeeCollection[]>(query, params);
        return rows;
    } catch (e: any) {
        if (e.code === 'ER_NO_SUCH_TABLE') return [];
        console.error("Failed to fetch fee collections:", e);
        return [];
    }
}


export async function saveFeeCollection(formData: FormData): Promise<SaveResult> {
    if (!pool) return { success: false, error: 'Database not connected' };

    try {
        const data = {
            student_id: parseInt(formData.get('student_id') as string, 10),
            fee_type_id: parseInt(formData.get('fee_type_id') as string, 10),
            amount_paid: parseFloat(formData.get('amount_paid') as string),
            payment_date: formData.get('payment_date') as string,
            month: (formData.get('month') as string) || null,
            year: parseInt(formData.get('year') as string, 10) || null,
        };

        if (isNaN(data.student_id) || isNaN(data.fee_type_id) || isNaN(data.amount_paid) || !data.payment_date) {
            return { success: false, error: 'Invalid input data.' };
        }
        
        const dbData = { ...data, status: 'paid' };

        await pool.query('INSERT INTO fee_collections SET ?', [dbData]);
        
        revalidatePath('/admin/fees');
        return { success: true };
    } catch (e: any) {
        console.error('Failed to save fee collection:', e);
        return { success: false, error: 'A server error occurred.' };
    }
}

export async function deleteFeeCollection(id: number): Promise<SaveResult> {
    if (!pool) return { success: false, error: 'Database not connected' };
    try {
        await pool.query('DELETE FROM fee_collections WHERE id = ?', [id]);
        revalidatePath('/admin/fees');
        return { success: true };
    } catch (e: any) {
        console.error('Failed to delete fee collection:', e);
        return { success: false, error: 'A server error occurred.' };
    }
}

