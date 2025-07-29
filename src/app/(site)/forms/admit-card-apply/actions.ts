
'use server';

import { z } from "zod";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

/*
SQL for creating the admit_card_applications table:

CREATE TABLE `admit_card_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `roll_no` varchar(50) NOT NULL,
  `session` varchar(100) NOT NULL,
  `exam_name` varchar(255) NOT NULL,
  `contact_mobile` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Use this SQL to add the new columns:
ALTER TABLE `admit_card_applications`
ADD COLUMN `father_name` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `mother_name` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `village` VARCHAR(255) DEFAULT NULL;

*/

const formSchema = z.object({
  studentName: z.string().min(1),
  fatherName: z.string().min(1),
  motherName: z.string().min(1),
  village: z.string().min(1),
  className: z.string().min(1),
  rollNo: z.string().min(1),
  session: z.string().min(1),
  examName: z.string().min(1),
  mobile: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export async function saveAdmitCardApplication(formData: FormData): Promise<{ success: boolean; error?: string; data?: FormValues }> {
  try {
    if (!pool) {
      throw new Error("Database not connected.");
    }

    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = formSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
      console.error(validatedFields.error.flatten().fieldErrors);
      return { success: false, error: "ফর্মের ডেটা অবৈধ।" };
    }
    
    const { data } = validatedFields;

    const query = `
      INSERT INTO admit_card_applications (
        student_name, father_name, mother_name, village, class_name, roll_no, session, exam_name, contact_mobile, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const values = [
      data.studentName, data.fatherName, data.motherName, data.village, 
      data.className, data.rollNo, data.session, 
      data.examName, data.mobile
    ];

    await pool.query(query, values);
    
    revalidatePath('/admin/forms');

    return { success: true, data };
  } catch (error) {
    console.error("Failed to save admit card application:", error);
    return { success: false, error: "আবেদন জমা দেওয়ার সময় একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}
