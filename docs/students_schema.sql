
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `roll` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `class_name` VARCHAR(100) NOT NULL,
  `gender` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `image` VARCHAR(255),
  `data_ai_hint` VARCHAR(255)
);

TRUNCATE TABLE `students`;

INSERT INTO `students` (`roll`, `name`, `class_name`, `gender`, `year`, `image`, `data_ai_hint`) VALUES
('101', 'আরিফ হোসেন', '১০ম', 'ছেলে', 2024, 'https://placehold.co/300x400.png', 'male student portrait'),
('102', 'সুমি আক্তার', '১০ম', 'মেয়ে', 2024, 'https://placehold.co/300x400.png', 'female student portrait'),
('201', 'জাহিদ হাসান', '৯ম', 'ছেলে', 2024, 'https://placehold.co/300x400.png', 'male student portrait'),
('202', 'রিয়া চৌধুরী', '৯ম', 'মেয়ে', 2024, 'https://placehold.co/300x400.png', 'female student portrait'),
('301', 'সাইফুল ইসলাম', '৮ম', 'ছেলে', 2023, 'https://placehold.co/300x400.png', 'male student portrait'),
('302', 'নাবিলা রহমান', '৮ম', 'মেয়ে', 2023, 'https://placehold.co/300x400.png', 'female student portrait'),
('103', 'করিম শেখ', '১০ম', 'ছেলে', 2023, 'https://placehold.co/300x400.png', 'male student portrait');
