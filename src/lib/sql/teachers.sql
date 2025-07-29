
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` longtext,
  `address` text,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `educational_qualification` text,
  `experience` text,
  `dataAiHint` varchar(255) DEFAULT 'teacher portrait',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO `teachers` (name, role, image, address, phone, email, educational_qualification, experience, dataAiHint) VALUES
('মোঃ আব্দুল্লাহ আল-আমিন', 'প্রধান শিক্ষক', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01700000000', 'abdullah@example.com', 'এম.এ, এম.এড', '২০ বছরের শিক্ষকতার অভিজ্ঞতা', 'male teacher portrait'),
('ফাতেমা আক্তার', 'সহকারী প্রধান শিক্ষক', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01800000000', 'fatema@example.com', 'বি.এস.সি, এম.এস.সি', '১৫ বছরের শিক্ষকতার অভিজ্ঞতা', 'female teacher portrait'),
('রহিম উদ্দিন আহমেদ', 'সিনিয়র শিক্ষক (গণিত)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01900000000', 'rahim@example.com', 'এম.এস.সি (গণিত)', '১২ বছরের শিক্ষকতার অভিজ্ঞতা', 'male teacher portrait'),
('সালমা চৌধুরী', 'সিনিয়র শিক্ষক (বিজ্ঞান)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01500000000', 'salma@example.com', 'এম.এস.সি (পদার্থবিজ্ঞান)', '১০ বছরের শিক্ষকতার অভিজ্ঞতা', 'female teacher portrait'),
('কামরুল হাসান', 'সহকারী শিক্ষক (ইংরেজি)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01600000000', 'kamrul@example.com', 'এম.এ (ইংরেজি)', '৮ বছরের শিক্ষকতার অভিজ্ঞতা', 'male teacher portrait'),
('আয়েশা সিদ্দিকা', 'সহকারী শিক্ষক (বাংলা)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01300000000', 'ayesha@example.com', 'এম.এ (বাংলা)', '৭ বছরের শিক্ষকতার অভিজ্ঞতা', 'female teacher portrait'),
('আরিফুল ইসলাম', 'সহকারী শিক্ষক (শরীরচর্চা)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01400000000', 'ariful@example.com', 'বিপিএড', '৫ বছরের শিক্ষকতার অভিজ্ঞতা', 'male teacher portrait');

