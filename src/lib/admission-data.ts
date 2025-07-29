
'use server';

import pool from './db';

export interface AdmissionGuideline {
    id: number;
    title: string;
    icon: string;
    content: string;
    sort_order: number;
}

export interface ImportantDate {
    id: number;
    label: string;
    date_value: string;
    sort_order: number;
}

export interface AdmissionPageContent {
    id: number;
    title: string;
    subtitle: string;
    form_download_url: string | null;
    contact_title: string | null;
    contact_description: string | null;
    contact_phone: string | null;
}

const mockGuidelines: AdmissionGuideline[] = [
    {
        id: 1,
        title: "ভর্তির যোগ্যতা",
        icon: 'UserCheck',
        content: "<p>ষষ্ঠ থেকে নবম শ্রেণীতে ভর্তির জন্য আবেদন করা যাবে। আবেদনকারীকে অবশ্যই পূর্ববর্তী শ্রেণীর বার্ষিক পরীক্ষায় উত্তীর্ণ হতে হবে।</p>",
        sort_order: 1
    },
    {
        id: 2,
        title: "আবেদন প্রক্রিয়া",
        icon: 'FileSignature',
        content: "<p>অফিস থেকে আবেদন ফরম সংগ্রহ করে অথবা ওয়েবসাইট থেকে ডাউনলোড করে পূরণকৃত ফরম প্রয়োজনীয় কাগজপত্রসহ অফিসে জমা দিতে হবে। অনলাইনেও আবেদন করার সুযোগ রয়েছে।</p>",
        sort_order: 2
    },
    {
        id: 3,
        title: "প্রয়োজনীয় কাগজপত্র",
        icon: 'ListChecks',
        content: "<ul class='list-disc pl-5 space-y-2'><li>পূর্ববর্তী শ্রেণীর পরীক্ষার মার্কশিট/প্রশংসাপত্রের সত্যায়িত কপি।</li><li>শিক্ষার্থীর জন্ম নিবন্ধনের সত্যায়িত কপি।</li><li>পিতা-মাতার জাতীয় পরিচয়পত্রের সত্যায়িত কপি।</li><li>২ কপি পাসপোর্ট সাইজের রঙিন ছবি।</li></ul>",
        sort_order: 3
    },
    {
        id: 4,
        title: "ভর্তি পরীক্ষা",
        icon: 'Pencil',
        content: "<p>ভর্তি পরীক্ষা বাংলা, ইংরেজি, গণিত এবং সাধারণ জ্ঞান বিষয়ের উপর অনুষ্ঠিত হবে। পরীক্ষার পূর্ণমান ১০০ এবং সময় ২ ঘণ্টা।</p>",
        sort_order: 4
    },
    {
        id: 5,
        title: "ভর্তি ফি ও বেতন",
        icon: 'Banknote',
        content: "<p>ভর্তি সংক্রান্ত সকল ফি অফিসে সরাসরি অথবা指定 ব্যাংক একাউন্টের মাধ্যমে জমা দেওয়া যাবে। বিস্তারিত তথ্যের জন্য অফিসিয়াল নোটিশ দেখুন।</p>",
        sort_order: 5
    }
];

const mockImportantDates: ImportantDate[] = [
    { id: 1, label: 'আবেদন ফরম বিতরণ শুরু:', date_value: '০১ নভেম্বর, ২০২৪', sort_order: 1 },
    { id: 2, label: 'আবেদন ফরম জমার শেষ তারিখ:', date_value: '৩০ নভেম্বর, ২০২৪', sort_order: 2 },
    { id: 3, label: 'ভর্তি পরীক্ষার তারিখ:', date_value: '১০ ডিসেম্বর, ২০২৪ (সকাল ১০টা)', sort_order: 3 },
    { id: 4, label: 'ফলাফল প্রকাশ:', date_value: '১৫ ডিসেম্বর, ২০২৪', sort_order: 4 },
    { id: 5, label: 'ভর্তির তারিখ:', date_value: '২০ থেকে ৩০ ডিসেম্বর, ২০২৪', sort_order: 5 },
];

const mockPageContent: AdmissionPageContent = {
    id: 1,
    title: 'ভর্তি নির্দেশিকা',
    subtitle: '২০২৪-২০২৫ শিক্ষাবর্ষে ভর্তির জন্য বিস্তারিত তথ্য',
    form_download_url: '#',
    contact_title: 'সাহায্যের জন্য যোগাযোগ করুন',
    contact_description: 'ভর্তি সংক্রান্ত যেকোনো তথ্যের জন্য যোগাযোগ করুন:',
    contact_phone: '+৮৮০ ১২৩৪ ৫৬৭৮৯০'
};

export async function getAdmissionGuidelines(): Promise<AdmissionGuideline[]> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for admission guidelines.");
        return mockGuidelines;
    }
    try {
        const [rows] = await pool.query('SELECT * FROM admission_guidelines ORDER BY sort_order ASC');
        return rows as AdmissionGuideline[];
    } catch (error) {
        console.error('Failed to fetch admission guidelines, returning mock data:', error);
        return mockGuidelines;
    }
}

export async function getAdmissionImportantDates(): Promise<ImportantDate[]> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for admission dates.");
        return mockImportantDates;
    }
    try {
        const [rows] = await pool.query('SELECT * FROM admission_important_dates ORDER BY sort_order ASC');
        return rows as ImportantDate[];
    } catch (error) {
        console.error('Failed to fetch admission dates, returning mock data:', error);
        return mockImportantDates;
    }
}

export async function getAdmissionPageContent(): Promise<AdmissionPageContent> {
    if (!pool) {
        console.warn("Database not connected. Returning mock data for admission page content.");
        return mockPageContent;
    }
    try {
        const [rows] = await pool.query('SELECT * FROM admission_page_content LIMIT 1');
        const results = rows as AdmissionPageContent[];
        return results[0] || mockPageContent;
    } catch (error) {
        console.error('Failed to fetch admission page content, returning mock data:', error);
        return mockPageContent;
    }
}
