
-- Enable foreign key checks if they were disabled.
SET FOREIGN_KEY_CHECKS=0;

-- Truncate tables to clear old data in the correct order
TRUNCATE TABLE `subject_grades`;
TRUNCATE TABLE `results`;


-- Create the results table
CREATE TABLE IF NOT EXISTS `results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roll` varchar(255) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `exam_name` varchar(255) NOT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `data_ai_hint` varchar(255) DEFAULT NULL,
  `final_gpa` decimal(4,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roll_class_exam` (`roll`,`class_name`,`exam_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the subject_grades table
CREATE TABLE IF NOT EXISTS `subject_grades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `result_id` int NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `grade` varchar(5) NOT NULL,
  `gpa` decimal(3,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `result_id` (`result_id`),
  CONSTRAINT `subject_grades_ibfk_1` FOREIGN KEY (`result_id`) REFERENCES `results` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Insert sample data into results table
INSERT INTO `results` (`id`, `roll`, `class_name`, `name`, `exam_name`, `group_name`, `father_name`, `mother_name`, `image`, `data_ai_hint`, `final_gpa`, `status`) VALUES
(1, '101', '১০ম', 'আরিফ হোসেন', 'বার্ষিক পরীক্ষা - ২০২৪', 'বিজ্ঞান', 'মোঃ আব্দুল্লাহ', 'ফাতেমা বেগম', 'https://placehold.co/300x400.png', 'male student portrait', 4.44, 'Promoted'),
(2, '201', '৯ম', 'জাহিদ হাসান', 'বার্ষিক পরীক্ষা - ২০২৪', 'ব্যবসায় শিক্ষা', 'মোঃ হাসান', 'জোহরা বেগম', 'https://placehold.co/300x400.png', 'male student portrait', 3.88, 'Promoted');

-- Insert sample data into subject_grades table
INSERT INTO `subject_grades` (`result_id`, `subject_name`, `grade`, `gpa`) VALUES
(1, 'বাংলা ১ম পত্র', 'A+', 5.00),
(1, 'বাংলা ২য় পত্র', 'A', 4.00),
(1, 'ইংরেজি ১ম পত্র', 'A', 4.00),
(1, 'ইংরেজি ২য় পত্র', 'A', 4.00),
(1, 'গণিত', 'A+', 5.00),
(1, 'পদার্থবিজ্ঞান', 'A', 4.00),
(1, 'রসায়ন', 'A-', 3.50),
(1, 'জীববিজ্ঞান', 'A+', 5.00),
(2, 'বাংলা ১ম পত্র', 'A', 4.00),
(2, 'বাংলা ২য় পত্র', 'A-', 3.50),
(2, 'ইংরেজি ১ম পত্র', 'A', 4.00),
(2, 'ইংরেজি ২য় পত্র', 'B', 3.00),
(2, 'গণিত', 'A', 4.00),
(2, 'বিজ্ঞান', 'A-', 3.50),
(2, 'হিসাববিজ্ঞান', 'A', 4.00),
(2, 'ব্যবসায় উদ্যোগ', 'A+', 5.00);

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

