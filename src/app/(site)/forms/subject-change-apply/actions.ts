
'use server';

import { z } from "zod";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

/*
SQL for creating the subject_change_applications table:

CREATE TABLE `subject_change_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `roll_no` varchar(50) NOT NULL,
  `session` varchar(100) NOT NULL,
  `current_subjects` text NOT NULL,
  `requested_subjects` text NOT NULL,
  `reason` text NOT NULL,
  `contact_mobile` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

*/

const formSchema = z.object({
  studentName: z.string().min(1),
  className: z.string().min(1),
  rollNo: z.string().min(1),
  session: z.string().min(1),
  currentSubjects: z.string().min(1),
  requestedSubjects: z.string().min(1),
  reason: z.string().min(1),
  mobile: z.string().min(1),
});

export async function saveSubjectChangeApplication(formData: FormData) {
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
      INSERT INTO subject_change_applications (
        student_name, class_name, roll_no, session, current_subjects, requested_subjects, reason, contact_mobile, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const values = [
      data.studentName, data.className, data.rollNo, data.session,
      data.currentSubjects, data.requestedSubjects, data.reason, data.mobile
    ];

    await pool.query(query, values);
    
    revalidatePath('/admin/forms');

    return { success: true };
  } catch (error) {
    console.error("Failed to save subject change application:", error);
    return { success: false, error: "আবেদন জমা দেওয়ার সময় একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}
