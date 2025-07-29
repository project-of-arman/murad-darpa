
'use server';

import { z } from "zod";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

/*
SQL for creating the admission_applications table:

CREATE TABLE `admission_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_name_bn` varchar(255) NOT NULL,
  `student_name_en` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `birth_cert_no` varchar(100) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `religion` varchar(50) NOT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `applying_for_class` varchar(50) NOT NULL,
  `previous_school` varchar(255) DEFAULT NULL,
  `father_name_bn` varchar(255) NOT NULL,
  `father_name_en` varchar(255) NOT NULL,
  `father_nid` varchar(100) NOT NULL,
  `father_mobile` varchar(50) NOT NULL,
  `mother_name_bn` varchar(255) NOT NULL,
  `mother_name_en` varchar(255) NOT NULL,
  `mother_nid` varchar(100) NOT NULL,
  `mother_mobile` varchar(50) NOT NULL,
  `present_address` text NOT NULL,
  `permanent_address` text NOT NULL,
  `student_photo_path` longblob,
  `birth_cert_photo_path` longblob,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Use this SQL to alter existing tables:
ALTER TABLE `admission_applications` 
MODIFY COLUMN `student_photo_path` LONGBLOB,
MODIFY COLUMN `birth_cert_photo_path` LONGBLOB;


*/

// Helper to get file buffer from FormData
const getFileBuffer = async (formData: FormData, key: string): Promise<Buffer | null> => {
    const file = formData.get(key) as File | null;
    if (!file || file.size === 0) return null;
    const bytes = await file.arrayBuffer();
    return Buffer.from(bytes);
};


const admissionFormSchema = z.object({
  studentNameBn: z.string().min(1),
  studentNameEn: z.string().min(1),
  dob: z.string().min(1),
  birthCertNo: z.string().min(1),
  gender: z.string().min(1),
  religion: z.string().min(1),
  bloodGroup: z.string().optional(),
  applyingForClass: z.string().min(1),
  previousSchool: z.string().optional(),
  fatherNameBn: z.string().min(1),
  fatherNameEn: z.string().min(1),
  fatherNid: z.string().min(1),
  fatherMobile: z.string().min(1),
  motherNameBn: z.string().min(1),
  motherNameEn: z.string().min(1),
  motherNid: z.string().min(1),
  motherMobile: z.string().min(1),
  presentAddress: z.string().min(1),
  permanentAddress: z.string().min(1),
  // We no longer validate file content here as we'll handle it on the server
});

type AdmissionFormData = Omit<z.infer<typeof admissionFormSchema>, 'studentPhoto' | 'birthCertPhoto'>;

export async function saveAdmissionApplication(formData: FormData): Promise<{ success: boolean; error?: string; data?: AdmissionFormData & { studentPhoto: string, birthCertPhoto: string } }> {
  try {
    if (!pool) {
      throw new Error("Database not connected.");
    }

    const rawFormData = Object.fromEntries(formData.entries());
     const validatedFields = admissionFormSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
      console.error(validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        error: "ফর্মের ডেটা অবৈধ।",
      };
    }
    
    const { data } = validatedFields;
    
    const studentPhotoBuffer = await getFileBuffer(formData, 'studentPhoto');
    const birthCertPhotoBuffer = await getFileBuffer(formData, 'birthCertPhoto');

    if (!studentPhotoBuffer || !birthCertPhotoBuffer) {
        return { success: false, error: "শিক্ষার্থীর ছবি এবং জন্ম সনদ আবশ্যক।" };
    }

    const query = `
      INSERT INTO admission_applications (
        student_name_bn, student_name_en, dob, birth_cert_no, gender, religion, blood_group,
        applying_for_class, previous_school,
        father_name_bn, father_name_en, father_nid, father_mobile,
        mother_name_bn, mother_name_en, mother_nid, mother_mobile,
        present_address, permanent_address,
        student_photo_path, birth_cert_photo_path,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const values = [
      data.studentNameBn, data.studentNameEn, data.dob, data.birthCertNo, data.gender, data.religion, data.bloodGroup || null,
      data.applyingForClass, data.previousSchool || null,
      data.fatherNameBn, data.fatherNameEn, data.fatherNid, data.fatherMobile,
      data.motherNameBn, data.motherNameEn, data.motherNid, data.motherMobile,
      data.presentAddress, data.permanentAddress,
      studentPhotoBuffer, birthCertPhotoBuffer
    ];

    await pool.query(query, values);
    
    revalidatePath('/admin/admissions');

    const submittedData = {
        ...data,
        studentPhoto: `data:image/jpeg;base64,${studentPhotoBuffer.toString('base64')}`,
        birthCertPhoto: `data:image/jpeg;base64,${birthCertPhotoBuffer.toString('base64')}`,
    }

    return { success: true, data: submittedData };
  } catch (error) {
    console.error("Failed to save admission application:", error);
    return {
      success: false,
      error: "আবেদন জমা দেওয়ার সময় একটি সার্ভার ত্রুটি হয়েছে।",
    };
  }
}
