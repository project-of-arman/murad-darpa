
CREATE TABLE `committee_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` longtext,
  `dataAiHint` varchar(255) DEFAULT 'committee member portrait',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- You can optionally pre-populate with some data
INSERT INTO `committee_members` (name, role, image, sort_order) VALUES
('প্রফেসর ড. মোঃ আখতারুজ্জামান', 'সভাপতি', 'https://placehold.co/300x400.png', 1),
('অধ্যক্ষ মোসাঃ হাসিনা পারভীন', 'সদস্য সচিব', 'https://placehold.co/300x400.png', 2),
('জনাব মোঃ আব্দুল্লাহ', 'অভিভাবক সদস্য', 'https://placehold.co/300x400.png', 3);
