CREATE TABLE `syllabuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(100) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `file_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `class_subject_unique` (`class_name`,`subject`)
);

-- Mock Data for syllabuses
INSERT INTO `syllabuses` (class_name, subject, file_url) VALUES
('১০ম শ্রেণী', 'বাংলা ১ম পত্র', '#'),
('১০ম শ্রেণী', 'বাংলা ২য় পত্র', '#'),
('১০ম শ্রেণী', 'ইংরেজি ১ম পত্র', '#'),
('১০ম শ্রেণী', 'ইংরেজি ২য় পত্র', '#'),
('১০ম শ্রেণী', 'গণিত', '#'),
('৯ম শ্রেণী', 'বাংলা ১ম পত্র', '#'),
('৯ম শ্রেণী', 'গণিত', '#'),
('৮ম শ্রেণী', 'বাংলা ১ম পত্র', '#'),
('৮ম শ্রেণী', 'গণিত', '#');
