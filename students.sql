--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roll` varchar(50) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `year` int NOT NULL,
  `image` text,
  `data_ai_hint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `roll`, `name`, `class_name`, `gender`, `year`, `image`, `data_ai_hint`) VALUES
(1, '101', 'আরিফ হোসেন', '১০ম', 'ছেলে', 2024, 'https://placehold.co/300x400.png', 'male student portrait'),
(2, '102', 'সুমি আক্তার', '১০ম', 'মেয়ে', 2024, 'https://placehold.co/300x400.png', 'female student portrait'),
(3, '201', 'জাহিদ হাসান', '৯ম', 'ছেলে', 2024, 'https://placehold.co/300x400.png', 'male student portrait'),
(4, '202', 'রিয়া চৌধুরী', '৯ম', 'মেয়ে', 2024, 'https://placehold.co/300x400.png', 'female student portrait'),
(5, '301', 'সাইফুল ইসলাম', '৮ম', 'ছেলে', 2023, 'https://placehold.co/300x400.png', 'male student portrait'),
(6, '302', 'নাবিলা রহমান', '৮ম', 'মেয়ে', 2023, 'https://placehold.co/300x400.png', 'female student portrait');
