
'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';
import { toDataURL } from './utils';

export interface CommitteeMember {
    id: number;
    name: string;
    role: string;
    image: string | Buffer;
    dataAiHint: string;
    sort_order: number;
}

const mockCommitteeMembers: CommitteeMember[] = [
  {
    id: 1,
    name: "প্রফেসর ড. মোঃ আখতারুজ্জামান",
    role: "সভাপতি",
    image: "https://placehold.co/300x400.png",
    dataAiHint: "male portrait",
    sort_order: 1,
  },
  // ... other mock members
];

/*
SQL for table `committee_members`:

CREATE TABLE `committee_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` longblob,
  `dataAiHint` varchar(255) DEFAULT 'committee member portrait',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`)
);

-- Use this SQL to alter existing tables:
ALTER TABLE `committee_members` MODIFY COLUMN `image` LONGBLOB;

*/


export async function getCommitteeMembers(): Promise<CommitteeMember[]> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for committee members.");
        return mockCommitteeMembers;
    }
    try {
        const [rows] = await pool.query<CommitteeMember[]>('SELECT * FROM committee_members ORDER BY sort_order ASC');
        return rows.map(row => ({
            ...row,
            image: row.image ? toDataURL(row.image as Buffer) : ''
        }));
    } catch (error) {
        console.error('Failed to fetch committee members, returning mock data:', error);
        return mockCommitteeMembers;
    }
}

export async function getCommitteeMemberById(id: string | number): Promise<CommitteeMember | null> {
    if (!pool) {
        return null;
    }
    try {
        const [rows] = await pool.query<CommitteeMember[]>('SELECT * FROM committee_members WHERE id = ?', [id]);
        const member = (rows as CommitteeMember[])[0] || null;
        if (member && member.image) {
            member.image = toDataURL(member.image as Buffer);
        }
        return member;
    } catch (error) {
        console.error(`Failed to fetch committee member by id ${id}:`, error);
        return null;
    }
}

type SaveResult = { success: boolean; error?: string };

export async function saveCommitteeMember(formData: FormData, id?: number): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }

    try {
        const data = {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            sort_order: parseInt(formData.get('sort_order') as string, 10),
            dataAiHint: formData.get('dataAiHint') as string,
            image: formData.get('image') as Blob | null,
        };

        const imageBuffer = data.image ? Buffer.from(await data.image.arrayBuffer()) : null;

        if (id) {
            // Update
            const fieldsToUpdate: { [key: string]: any } = {
                name: data.name,
                role: data.role,
                sort_order: data.sort_order,
                dataAiHint: data.dataAiHint,
            };
            
            if (imageBuffer) {
                fieldsToUpdate.image = imageBuffer;
            }

            const query = 'UPDATE committee_members SET ? WHERE id = ?';
            await pool.query(query, [fieldsToUpdate, id]);
        } else {
             if (!imageBuffer) {
                return { success: false, error: "নতুন সদস্যের জন্য ছবি আবশ্যক।" };
            }
            // Insert
            const query = 'INSERT INTO committee_members (name, role, sort_order, dataAiHint, image) VALUES (?, ?, ?, ?, ?)';
            await pool.query(query, [data.name, data.role, data.sort_order, data.dataAiHint, imageBuffer]);
        }

        revalidatePath('/admin/committee');
        revalidatePath('/(site)/committee');

        return { success: true };
    } catch (error: any) {
        console.error("Failed to save committee member:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}

export async function deleteCommitteeMember(id: number): Promise<SaveResult> {
    if (!pool) {
        return { success: false, error: "Database not connected." };
    }
    try {
        await pool.query('DELETE FROM committee_members WHERE id = ?', [id]);
        
        revalidatePath('/admin/committee');
        revalidatePath('/(site)/committee');

        return { success: true };
    } catch (error) {
        console.error("Failed to delete committee member:", error);
        return { success: false, error: "একটি সার্ভার ত্রুটি হয়েছে।" };
    }
}

