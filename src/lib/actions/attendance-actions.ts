
'use server';

import pool from '../db';
import { revalidatePath } from 'next/cache';
import { RowDataPacket } from 'mysql2';

/*
SQL for creating the student_attendance table:

CREATE TABLE `student_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('Present','Absent') NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_date_unique` (`student_id`,`attendance_date`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
);

*/


export interface StudentAttendanceRecord extends RowDataPacket {
  id: number;
  name_bn: string;
  roll: string;
  class_name: string;
  status: 'Present' | 'Absent' | null;
  reason: string | null;
}

export interface AttendanceReportRecord extends RowDataPacket {
    id: number;
    student_id: number;
    student_name: string;
    class_name: string;
    roll: string;
    status: 'Present' | 'Absent';
    reason: string | null;
}

export async function getStudentsWithAttendance(
  date: string,
  className: string
): Promise<StudentAttendanceRecord[]> {
  if (!pool) {
    console.error("Database not connected.");
    return [];
  }
  
  try {
    const query = `
      SELECT 
        s.id,
        s.name_bn,
        s.roll,
        sa.status,
        sa.reason
      FROM students s
      LEFT JOIN student_attendance sa ON s.id = sa.student_id AND sa.attendance_date = ?
      WHERE s.class_name = ?
      ORDER BY CAST(s.roll as UNSIGNED) ASC
    `;
    const [rows] = await pool.query(query, [date, className]);
    return rows as StudentAttendanceRecord[];
  } catch (error) {
    console.error('Failed to fetch student attendance:', error);
    return [];
  }
}

export async function getAttendanceByDate(date: string): Promise<AttendanceReportRecord[]> {
    if (!pool) {
        console.error("Database not connected.");
        return [];
    }
    try {
        const query = `
            SELECT 
                sa.id, sa.student_id, sa.status, sa.reason,
                s.name_bn as student_name, s.class_name, s.roll
            FROM student_attendance sa
            JOIN students s ON sa.student_id = s.id
            WHERE sa.attendance_date = ?
            ORDER BY s.class_name, CAST(s.roll as UNSIGNED) ASC
        `;
        const [rows] = await pool.query(query, [date]);
        return rows as AttendanceReportRecord[];
    } catch (error) {
        console.error('Failed to fetch attendance report:', error);
        return [];
    }
}


type SaveResult = { success: boolean; error?: string };
type AttendanceData = {
    [key: string]: {
        status: 'Present' | 'Absent';
        reason?: string;
    }
}

export async function saveAttendance(date: string, attendanceData: AttendanceData): Promise<SaveResult> {
  if (!pool) {
    return { success: false, error: 'Database not connected' };
  }
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const deleteQuery = 'DELETE FROM student_attendance WHERE attendance_date = ? AND student_id IN (?)';
    const studentIds = Object.keys(attendanceData);
    if (studentIds.length > 0) {
      await connection.query(deleteQuery, [date, studentIds]);
    }
    
    const insertQuery = 'INSERT INTO student_attendance (student_id, attendance_date, status, reason) VALUES ?';
    const valuesToInsert = studentIds.map(studentId => {
      const record = attendanceData[studentId];
      return [studentId, date, record.status, record.status === 'Absent' ? record.reason : null];
    });

    if (valuesToInsert.length > 0) {
      await connection.query(insertQuery, [valuesToInsert]);
    }

    await connection.commit();
    revalidatePath('/admin/attendance');
    return { success: true };

  } catch (error) {
    await connection.rollback();
    console.error('Failed to save attendance:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  } finally {
    connection.release();
  }
}
