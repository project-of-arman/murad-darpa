
import { RowDataPacket } from 'mysql2';

// ========= TYPES =========

export interface FormSubmission extends RowDataPacket {
  id: number;
  [key: string]: any; // Allow for dynamic properties from different tables
}

export interface FormConfig {
  tableName: string;
  displayName: string;
  columns: { key: string; label: string; isPrimary?: boolean }[];
}

// ========= CONFIGURATION =========

export const formConfigs: Record<string, FormConfig> = {
  admission_applications: {
    tableName: 'admission_applications',
    displayName: 'ভর্তি আবেদন',
    columns: [
      { key: 'student_name_bn', label: 'শিক্ষার্থীর নাম', isPrimary: true },
      { key: 'applying_for_class', label: 'শ্রেণী' },
      { key: 'father_mobile', label: 'মোবাইল' },
      { key: 'status', label: 'স্ট্যাটাস' },
    ],
  },
  transfer_certificate_applications: {
    tableName: 'transfer_certificate_applications',
    displayName: 'ছাড়পত্র আবেদন',
    columns: [
      { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
      { key: 'class_name', label: 'শ্রেণী' },
      { key: 'contact_mobile', label: 'মোবাইল' },
      { key: 'status', label: 'স্ট্যাটাস' },
    ],
  },
  testimonial_applications: {
    tableName: 'testimonial_applications',
    displayName: 'প্রশংসাপত্র আবেদন',
    columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'last_class', label: 'সর্বশেষ শ্রেণী'},
        { key: 'contact_mobile', label: 'মোবাইল' },
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
  certificate_applications: {
    tableName: 'certificate_applications',
    displayName: 'সনদপত্র আবেদন',
    columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'last_class', label: 'সর্বশেষ শ্রেণী'},
        { key: 'contact_mobile', label: 'মোবাইল' },
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
  admit_card_applications: {
    tableName: 'admit_card_applications',
    displayName: 'প্রবেশপত্র আবেদন',
    columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'class_name', label: 'শ্রেণী'},
        { key: 'roll_no', label: 'রোল'},
        { key: 'exam_name', label: 'পরীক্ষা'},
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
  marksheet_applications: {
    tableName: 'marksheet_applications',
    displayName: 'মার্কশিট আবেদন',
     columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'class_name', label: 'শ্রেণী'},
        { key: 'roll_no', label: 'রোল'},
        { key: 'exam_name', label: 'পরীক্ষা'},
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
   leave_applications: {
    tableName: 'leave_applications',
    displayName: 'ছুটির আবেদন',
     columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'class_name', label: 'শ্রেণী'},
        { key: 'roll_no', label: 'রোল'},
        { key: 'start_date', label: 'শুরুর তারিখ'},
        { key: 'end_date', label: 'শেষের তারিখ'},
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
  library_card_applications: {
    tableName: 'library_card_applications',
    displayName: 'লাইব্রেরী কার্ড আবেদন',
     columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'class_name', label: 'শ্রেণী'},
        { key: 'roll_no', label: 'রোল'},
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
  guardian_consent_applications: {
    tableName: 'guardian_consent_applications',
    displayName: 'অভিভাবকের সম্মতিপত্র',
     columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'guardian_name', label: 'অভিভাবকের নাম'},
        { key: 'event_name', label: 'কার্যক্রম'},
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
  subject_change_applications: {
    tableName: 'subject_change_applications',
    displayName: 'বিষয় পরিবর্তনের আবেদন',
     columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'class_name', label: 'শ্রেণী'},
        { key: 'roll_no', label: 'রোল'},
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
  stipend_applications: {
    tableName: 'stipend_applications',
    displayName: 'উপবৃত্তি আবেদন',
     columns: [
        { key: 'student_name', label: 'শিক্ষার্থীর নাম', isPrimary: true },
        { key: 'class_name', label: 'শ্রেণী'},
        { key: 'father_name', label: 'পিতার নাম'},
        { key: 'status', label: 'স্ট্যাটাস' },
    ]
  },
};
