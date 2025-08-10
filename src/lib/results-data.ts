
'use server';

import pool from './db';

interface SubjectGrade {
    name: string;
    marks: string | null;
    grade: string;
    gpa: string;
}

export interface StudentResult {
    id: number;
    roll: string;
    class_name: string;
    name: string;
    exam_name: string;
    group_name: string;
    father_name: string;
    mother_name: string;
    image: string | null;
    data_ai_hint: string | null;
    final_gpa: string;
    status: string;
    subjects: SubjectGrade[];
}

export async function getResultByRollAndClass(roll: string, className: string): Promise<StudentResult | null> {
    if (!pool) {
        console.error("Database not connected.");
        return null;
    }

    try {
        const [resultRows] = await pool.query<any[]>(`
            SELECT 
                r.id, s.roll, s.class_name, s.name_bn as name, r.exam_name,
                s.father_name_bn as father_name, s.mother_name_bn as mother_name,
                IF(s.image IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(s.image)), NULL) as image, 
                s.data_ai_hint, r.final_gpa, r.status
            FROM results r
            JOIN students s ON r.student_id = s.id
            WHERE s.roll = ? AND s.class_name = ?
        `, [roll, className]);

        if (resultRows.length === 0) {
            return null;
        }

        const studentResultData = resultRows[0];
         // In a real app, you might have a 'group' field in the students or results table.
        // For now, we'll determine it based on subjects or set a default.
        studentResultData.group_name = 'বিজ্ঞান'; 

        const [subjectRows] = await pool.query<any[]>(
            'SELECT subject_name, marks, grade, gpa FROM subject_grades WHERE result_id = ?',
            [studentResultData.id]
        );

        const subjects: SubjectGrade[] = subjectRows.map(row => ({
            name: row.subject_name,
            marks: row.marks,
            grade: row.grade,
            gpa: row.gpa
        }));

        return {
            ...studentResultData,
            subjects: subjects
        };

    } catch (error) {
        console.error(`Failed to fetch result for roll ${roll}:`, error);
        return null;
    }
}
