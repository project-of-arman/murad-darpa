
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

const mockResults: StudentResult[] = [
  { 
    id: 1,
    roll: '101', 
    class_name: '১০ম', 
    name: 'আরিফ হোসেন',
    exam_name: 'বার্ষিক পরীক্ষা - ২০২৪',
    group_name: 'বিজ্ঞান',
    father_name: 'মোঃ আব্দুল্লাহ',
    mother_name: 'ফাতেমা বেগম',
    image: 'https://placehold.co/300x400.png',
    data_ai_hint: 'male student portrait',
    final_gpa: '4.44',
    status: 'Promoted',
    subjects: [
        { name: 'বাংলা ১ম পত্র', marks: '85', grade: 'A+', gpa: '5.00' },
        { name: 'বাংলা ২য় পত্র', marks: '75', grade: 'A', gpa: '4.00' },
        { name: 'ইংরেজি ১ম পত্র', marks: '72', grade: 'A', gpa: '4.00' },
        { name: 'ইংরেজি ২য় পত্র', marks: '78', grade: 'A', gpa: '4.00' },
        { name: 'গণিত', marks: '90', grade: 'A+', gpa: '5.00' },
        { name: 'পদার্থবিজ্ঞান', marks: '76', grade: 'A', gpa: '4.00' },
        { name: 'রসায়ন', marks: '65', grade: 'A-', gpa: '3.50' },
        { name: 'জীববিজ্ঞান', marks: '88', grade: 'A+', gpa: '5.00' },
    ],
  },
  { 
    id: 2,
    roll: '201', 
    class_name: '৯ম', 
    name: 'জাহিদ হাসান',
    exam_name: 'বার্ষিক পরীক্ষা - ২০২৪',
    group_name: 'ব্যবসায় শিক্ষা',
    father_name: 'মোঃ হাসান',
    mother_name: 'জোহরা বেগম',
    image: 'https://placehold.co/300x400.png',
    data_ai_hint: 'male student portrait',
    final_gpa: '3.88',
    status: 'Promoted',
    subjects: [
        { name: 'বাংলা ১ম পত্র', marks: '75', grade: 'A', gpa: '4.00' },
        { name: 'বাংলা ২য় পত্র', marks: '65', grade: 'A-', gpa: '3.50' },
        { name: 'ইংরেজি ১ম পত্র', marks: '72', grade: 'A', gpa: '4.00' },
        { name: 'ইংরেজি ২য় পত্র', marks: '55', grade: 'B', gpa: '3.00' },
        { name: 'গণিত', marks: '78', grade: 'A', gpa: '4.00' },
        { name: 'বিজ্ঞান', marks: '68', grade: 'A-', gpa: '3.50' },
        { name: 'হিসাববিজ্ঞান', marks: '71', grade: 'A', gpa: '4.00' },
        { name: 'ব্যবসায় উদ্যোগ', marks: '82', grade: 'A+', gpa: '5.00' },
    ],
  },
];


export async function getResultByRollAndClass(roll: string, className: string): Promise<StudentResult | null> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for result.");
        const result = mockResults.find(r => r.roll === roll && r.class_name === className) || null;
        return result;
    }

    try {
        const [resultRows] = await pool.query<any[]>(`
            SELECT 
                r.id, s.roll, s.class_name, s.name_bn as name, r.exam_name,
                s.father_name_bn as father_name, s.mother_name_bn as mother_name,
                s.image, s.data_ai_hint, r.final_gpa, r.status
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
        console.error(`Failed to fetch result for roll ${roll}, returning mock data:`, error);
        const result = mockResults.find(r => r.roll === roll && r.class_name === className) || null;
        return result;
    }
}
