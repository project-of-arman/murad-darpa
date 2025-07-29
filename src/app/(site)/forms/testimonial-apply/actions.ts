
'use server';

import { z } from "zod";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

/*
SQL for creating the testimonial_applications table:

CREATE TABLE `testimonial_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) NOT NULL,
  `father_name` varchar(255) NOT NULL,
  `mother_name` varchar(255) NOT NULL,
  `last_class` varchar(100) NOT NULL,
  `last_roll` varchar(50) NOT NULL,
  `passing_year` varchar(10) NOT NULL,
  `registration_no` varchar(100) NOT NULL,
  `contact_mobile` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

*/

const formSchema = z.object({
  studentName: z.string().min(1),
  fatherName: z.string().min(1),
  motherName: z.string().min(1),
  lastClass: z.string().min(1),
  lastRoll: z.string().min(1),
  passingYear: z.string().min(4).max(4),
  registrationNo: z.string().min(1),
  mobile: z.string().min(1),
});

export async function saveTestimonialApplication(formData: FormData) {
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
      INSERT INTO testimonial_applications (
        student_name, father_name, mother_name, last_class, last_roll, passing_year, registration_no, contact_mobile, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const values = [
      data.studentName, data.fatherName, data.motherName, data.lastClass, 
      data.lastRoll, data.passingYear, data.registrationNo, data.mobile
    ];

    await pool.query(query, values);
    
    revalidatePath('/admin/forms');

    return { success: true };
  } catch (error) {
    console.error("Failed to save testimonial application:", error);
    return { success: false, error: "আবেদন জমা দেওয়ার সময় একটি সার্ভার ত্রুটি হয়েছে।" };
  }
}
