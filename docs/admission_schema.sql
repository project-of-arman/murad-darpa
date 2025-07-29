-- Drop tables if they exist to start clean
DROP TABLE IF EXISTS admission_guidelines;
DROP TABLE IF EXISTS admission_important_dates;
DROP TABLE IF EXISTS admission_page_content;

-- Table for the main content of the admission page
CREATE TABLE admission_page_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    form_download_url VARCHAR(255),
    contact_title VARCHAR(255),
    contact_description VARCHAR(255),
    contact_phone VARCHAR(50)
);

-- Table for the important dates
CREATE TABLE admission_important_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    date_value VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- Table for the admission guidelines (accordion items)
CREATE TABLE admission_guidelines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- Insert sample data
INSERT INTO admission_page_content (id, title, subtitle, form_download_url, contact_title, contact_description, contact_phone) VALUES
(1, 'ভর্তি নির্দেশিকা', '২০২৪-২০২৫ শিক্ষাবর্ষে ভর্তির জন্য বিস্তারিত তথ্য', '#', 'সাহায্যের জন্য যোগাযোগ করুন', 'ভর্তি সংক্রান্ত যেকোনো তথ্যের জন্য যোগাযোগ করুন:', '+৮৮০ ১২৩৪ ৫৬৭৮৯০');

INSERT INTO admission_important_dates (label, date_value, sort_order) VALUES
('আবেদন ফরম বিতরণ শুরু:', '০১ নভেম্বর, ২০২৪', 1),
('আবেদন ফরম জমার শেষ তারিখ:', '৩০ নভেম্বর, ২০২৪', 2),
('ভর্তি পরীক্ষার তারিখ:', '১০ ডিসেম্বর, ২০২৪ (সকাল ১০টা)', 3),
('ফলাফল প্রকাশ:', '১৫ ডিসেম্বর, ২০২৪', 4),
('ভর্তির তারিখ:', '২০ থেকে ৩০ ডিসেম্বর, ২০২৪', 5);

INSERT INTO admission_guidelines (title, icon, content, sort_order) VALUES
('ভর্তির যোগ্যতা', 'UserCheck', '<p>ষষ্ঠ থেকে নবম শ্রেণীতে ভর্তির জন্য আবেদন করা যাবে। আবেদনকারীকে অবশ্যই পূর্ববর্তী শ্রেণীর বার্ষিক পরীক্ষায় উত্তীর্ণ হতে হবে।</p>', 1),
('আবেদন প্রক্রিয়া', 'FileSignature', '<p>অফিস থেকে আবেদন ফরম সংগ্রহ করে অথবা ওয়েবসাইট থেকে ডাউনলোড করে পূরণকৃত ফরম প্রয়োজনীয় কাগজপত্রসহ অফিসে জমা দিতে হবে। অনলাইনেও আবেদন করার সুযোগ রয়েছে।</p>', 2),
('প্রয়োজনীয় কাগজপত্র', 'ListChecks', '<ul class=\"list-disc pl-5 space-y-2\"><li>পূর্ববর্তী শ্রেণীর পরীক্ষার মার্কশিট/প্রশংসাপত্রের সত্যায়িত কপি।</li><li>শিক্ষার্থীর জন্ম নিবন্ধনের সত্যায়িত কপি।</li><li>পিতা-মাতার জাতীয় পরিচয়পত্রের সত্যায়িত কপি।</li><li>২ কপি পাসপোর্ট সাইজের রঙিন ছবি।</li></ul>', 3),
('ভর্তি পরীক্ষা', 'Pencil', '<p>ভর্তি পরীক্ষা বাংলা, ইংরেজি, গণিত এবং সাধারণ জ্ঞান বিষয়ের উপর অনুষ্ঠিত হবে। পরীক্ষার পূর্ণমান ১০০ এবং সময় ২ ঘণ্টা।</p>', 4),
('ভর্তি ফি ও বেতন', 'Banknote', '<p>ভর্তি সংক্রান্ত সকল ফি অফিসে সরাসরি অথবা指定 ব্যাংক একাউন্টের মাধ্যমে জমা দেওয়া যাবে। বিস্তারিত তথ্যের জন্য অফিসিয়াল নোটিশ দেখুন।</p>', 5);
