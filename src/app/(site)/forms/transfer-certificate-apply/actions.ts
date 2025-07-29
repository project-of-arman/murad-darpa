
'use server';

import { z } from "zod";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

/*
SQL for creating the transfer_certificate_applications table:

CREATE TABLE `transfer_certificate_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `roll_no` varchar(50) NOT NULL,
  `session` varchar(100) NOT NULL,
  `father_name` varchar(255) NOT NULL,
  `mother_name` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `contact_mobile` varchar(50) NOT NULL,
  `post_office` varchar(255) DEFAULT NULL,
  `upazila` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
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
  fatherName: z.string().min(1),
  motherName: z.string().min(1),
  reason: z.string().min(1),
  post_office: z.string().min(1, "ডাকঘর আবশ্যক"),
  upazila: z.string().min(1, "উপজেলা আবশ্যক"),
  district: z.string().min(1, "জেলা আবশ্যক"),
  mobile: z.string().min(1),
});

export type TransferCertificateData = z.infer<typeof formSchema>;

export async function saveTransferCertificateApplication(formData: FormData): Promise<{ success: boolean; error?: string; data?: TransferCertificateData }> {
  try {
    if (!pool) {
      throw new Error("Database not connected.");
    }

    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = formSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
      console.error(validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        error: "ফর্মের ডেটা অবৈধ।",
      };
    }
    
    const { data } = validatedFields;

    const query = `
      INSERT INTO transfer_certificate_applications (
        student_name, class_name, roll_no, session, father_name, mother_name, reason, contact_mobile, post_office, upazila, district, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const values = [
      data.studentName, data.className, data.rollNo, data.session, 
      data.fatherName, data.motherName, data.reason, data.mobile,
      data.post_office, data.upazila, data.district
    ];

    await pool.query(query, values);
    
    revalidatePath('/admin/forms');

    return { success: true, data: data };
  } catch (error) {
    console.error("Failed to save transfer certificate application:", error);
    return {
      success: false,
      error: "আবেদন জমা দেওয়ার সময় একটি সার্ভার ত্রুটি হয়েছে।",
    };
  }
}
