CREATE TABLE `carousel_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src` varchar(255) NOT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `carousel_items` (`id`, `src`, `alt`, `title`, `description`, `dataAiHint`, `sort_order`) VALUES
(1, 'https://jrgbp.edu.bd/wp-content/uploads/2023/09/2022-12-09.jpg', 'School campus', 'স্বাগতম মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়ে', 'একটি আদর্শ ও আধুনিক শিক্ষা প্রতিষ্ঠান', 'school campus', 1),
(2, 'https://narayanganjpreparatoryschool.edu.bd/wp-content/uploads/2024/01/IMG-20230714-WA0003.jpg', 'Annual sports day', 'বার্ষিক ক্রীড়া প্রতিযোগিতা', 'শিক্ষার্থীদের শারীরিক ও মানসিক বিকাশে খেলাধুলার গুরুত্ব', 'sports day', 2),
(3, 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npEppKeyl0u8huo4z74e9lsi3VkjV1r6IvhRzM80FtS3C4i0O8EleFmwOKE3qt3e-el8V7cO9mG5j4OKEZIm9OPc_lwM-m9wLWl6aliRYfFE8alPOzE5JIliGedNvM6cSKzTS9Brw=s680-w680-h510-rw', 'Science fair', 'বিজ্ঞান মেলা', 'নতুন প্রজন্মের উদ্ভাবনী শক্তির প্রকাশ', 'science fair', 3);


CREATE TABLE `committee_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `committee_members` (`id`, `name`, `role`, `image`, `dataAiHint`, `sort_order`) VALUES
(1, 'প্রফেসর ড. মোঃ আখতারুজ্জামান', 'সভাপতি', 'https://placehold.co/300x400.png', 'male portrait', 1),
(2, 'অধ্যক্ষ মোসাঃ হাসিনা পারভীন', 'সদস্য সচিব', 'https://placehold.co/300x400.png', 'female portrait', 2),
(3, 'জনাব মোঃ আব্দুল্লাহ', 'অভিভাবক সদস্য', 'https://placehold.co/300x400.png', 'male portrait', 3),
(4, 'মিসেস ফরিদা ইয়াসমিন', 'অভিভাবক সদস্য', 'https://placehold.co/300x400.png', 'female portrait', 4),
(5, 'জনাব মোঃ কামরুল হাসান', 'শিক্ষক প্রতিনিধি', 'https://placehold.co/300x400.png', 'male teacher portrait', 5),
(6, 'মিসেস সালমা চৌধুরী', 'শিক্ষক প্রতিনিধি', 'https://placehold.co/300x400.png', 'female teacher portrait', 6),
(7, 'জেলা প্রশাসক, ঢাকা', 'সদস্য', 'https://placehold.co/300x400.png', 'official portrait', 7),
(8, 'প্রধান শিক্ষক', 'সদস্য', 'https://placehold.co/300x400.png', 'male teacher portrait', 8);


CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `videoUrl` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `dataAiHint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `videos` (`id`, `title`, `thumbnail`, `videoUrl`, `description`, `dataAiHint`) VALUES
(1, 'বার্ষিক সাংস্কৃতিক অনুষ্ঠান', 'https://placehold.co/600x400.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'আমাদের প্রতিষ্ঠানের বার্ষিক সাংস্কৃতিক অনুষ্ঠানের মনোমুগ্ধকর কিছু মুহূর্ত।', 'school event'),
(2, 'স্বাধীনতা দিবস উদযাপন', 'https://placehold.co/600x400.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'মহান স্বাধীনতা দিবস উপলক্ষে আয়োজিত বিশেষ অনুষ্ঠানের কিছু অংশ।', 'independence day'),
(3, 'বৃক্ষরোপণ কর্মসূচি', 'https://placehold.co/600x400.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'পরিবেশ রক্ষায় আমাদের শিক্ষার্থীদের স্বতঃস্ফূর্ত অংশগ্রহণ।', 'tree plantation'),
(4, 'বিজ্ঞান মেলা', 'https://placehold.co/600x400.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'শিক্ষার্থীদের উদ্ভাবনী প্রকল্পের প্রদর্শনী।', 'science fair'),
(5, 'ক্রীড়া প্রতিযোগিতা', 'https://placehold.co/600x400.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'বার্ষিক ক্রীড়া প্রতিযোগিতার উত্তেজনাপূর্ণ মুহূর্ত।', 'sports day'),
(6, 'নবীন বরণ', 'https://placehold.co/600x400.png', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'নতুন শিক্ষার্থীদের বরণ করে নেওয়ার আনন্দঘন মুহূর্ত।', 'student reception');


CREATE TABLE `nav_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `href` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `nav_links_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `nav_links` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `nav_links` (`id`, `title`, `href`, `parent_id`, `sort_order`, `icon`) VALUES
(1, 'হোম', '/', NULL, 1, 'Home'),
(2, 'স্কুল সম্পর্কিত', '/school-details', NULL, 2, NULL),
(3, 'কমিটি', '/committee', NULL, 3, NULL),
(4, 'ভর্তি নির্দেশিকা', '/admission-guidelines', NULL, 4, NULL),
(5, 'ফলাফল', '/results', NULL, 5, NULL),
(6, 'সকল ফরমস', '/forms', NULL, 6, NULL),
(7, 'যোগাযোগ ও ফিডব্যাক', '/contact', NULL, 7, NULL),
(8, 'গ্যালারি', NULL, NULL, 8, NULL),
(9, 'ছবি গ্যালারি', '/gallery', 8, 1, NULL),
(10, 'ভিডিও গ্যালারি', '/videos', 8, 2, NULL);


CREATE TABLE `about_school` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `data_ai_hint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `about_school` (`id`, `title`, `description`, `image_url`, `data_ai_hint`) VALUES
(1, 'আমাদের সম্পর্কে', 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয় একটি ঐতিহ্যবাহী এবং স্বনামধন্য শিক্ষা প্রতিষ্ঠান। আমরা শিক্ষার্থীদের মধ্যে জ্ঞান, সৃজনশীলতা এবং নৈতিক মূল্যবোধের বিকাশ ঘটাতে প্রতিশ্রুতিবদ্ধ। আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে একজন দায়িত্বশীল নাগরিক হিসেবে গড়ে তোলা। একটি অভিজ্ঞ শিক্ষক মণ্ডলী, আধুনিক শ্রেণীকক্ষ এবং সমৃদ্ধ লাইব্রেরি নিয়ে আমাদের পথচলা। আমরা বিশ্বাস করি, সঠিক পরিচর্যা এবং অনুকূল পরিবেশ পেলে প্রতিটি শিক্ষার্থীই তার সুপ্ত প্রতিভা বিকশিত করতে পারে।\r\n\r\n', 'https://dinajpureducationboard.gov.bd/sites/default/files/files/dinajpureducationboard.portal.gov.bd/officer_list/f9cf0e70_e4af_4764_8abe_83a9633483c9/Professor%20Md.%20Towhidul%20Islam.jpeg', NULL);


CREATE TABLE `school_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `school_features` (`id`, `icon`, `title`, `description`, `sort_order`) VALUES
(1, 'Target', 'আমাদের ইতিহাস', 'শিক্ষা অঙ্গন প্রতিষ্ঠিত হয়েছিল ১৯৯০ সালে। প্রতিষ্ঠার পর থেকে আমরা জ্ঞানের আলো ছড়িয়ে যাচ্ছি এবং হাজারো শিক্ষার্থীর भविष्य গড়ে তুলেছি। আমাদের রয়েছে দীর্ঘদিনের গৌরবময় ইতিহাস।\r\n\r\n', 0),
(2, '', 'আমাদের লক্ষ্য ও উদ্দেশ্য', 'আমাদের মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে নৈতিক ও মানবিক মূল্যবোধে উদ্বুদ্ধ করে একজন আদর্শ নাগরিক হিসেবে গড়ে তোলা। আমরা সৃজনশীলতা ও মননশীলতার বিকাশে বিশ্বাসী।\r\n\r\n', 1),
(3, 'History', 'আমাদের ইতিহাস', 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয় প্রতিষ্ঠিত হয়েছিল ১৯৯০ সালে।', 0),
(4, 'Target', 'আমাদের লক্ষ্য ও উদ্দেশ্য', 'আমাদের মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে নৈতিক ও মানবিক মূল্যবোধে উদ্বুদ্ধ করে একজন আদর্শ নাগরিক হিসেবে গড়ে তোলা।', 0),
(5, 'BookOpen', 'একাডেমিক কার্যক্রম', 'আমরা জাতীয় শিক্ষাক্রম অনুসরণ করে থাকি।', 0);


CREATE TABLE `important_link_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `data_ai_hint` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `important_link_groups` (`id`, `title`, `image`, `data_ai_hint`, `sort_order`) VALUES
(1, 'বিদ্যালয় সংক্রান্ত আদেশ', 'https://dinajpureducationboard.gov.bd/sites/default/files/files/dinajpureducationboard.portal.gov.bd/front_service_box/02688086_81fb_4a79_90ad_f435538f8d6d/scholarship.png', 'school orders', 1),
(2, 'নাম ও বয়স সংশোধন সংক্রান্ত', 'https://dinajpureducationboard.gov.bd/sites/default/files/files/dinajpureducationboard.portal.gov.bd/front_service_box/7c4909e0_609f_472a_b56c_c686e54532d7/images%20(1).png', 'name and age management', 2),
(3, 'পরীক্ষা সংক্রান্ত\r\n', 'https://dinajpureducationboard.gov.bd/sites/default/files/files/dinajpureducationboard.portal.gov.bd/front_service_box/d0310f06_67e3_4d24_9027_736d8a2a1ce9/Examination_ex.png', 'exam essentials ', 3);

CREATE TABLE `important_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL,
  `href` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `important_links_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `important_link_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `important_links` (`id`, `group_id`, `text`, `href`, `sort_order`) VALUES
(1, 1, 'ঢাকা শিক্ষা বোর্ড', '#', 1),
(2, 1, 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর', '#', 2),
(3, 1, 'বাংলাদেশ শিক্ষাতথ্য ও পরিসংখ্যান ব্যুরো', '#', 3),
(4, 1, 'পাঠদান ও স্বীকৃতি', '/recognition', 4),
(5, 2, 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড', '#', 1),
(6, 2, 'শিক্ষক বাতায়ন', '#', 2),
(7, 2, 'মুক্তপাঠ', '#', 3),
(8, 3, 'জেএসসি পরীক্ষা', 'https://dinajpureducationboard.gov.bd/', 0),
(9, 3, 'এসএসসি পরীক্ষা', 'https://dinajpureducationboard.gov.bd/', 0),
(10, 3, 'এইচএসসি পরীক্ষা', 'https://dinajpureducationboard.gov.bd/', 0);

CREATE TABLE `notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `fileUrl` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_marquee` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `notices` (`id`, `title`, `date`, `fileUrl`, `description`, `is_marquee`) VALUES
(1, 'ভর্তি পরীক্ষার ফলাফল প্রকাশ', '২০ জুলাই, ২০২৪', '#', '২০২৪-২৫ শিক্ষাবর্ষের ভর্তি পরীক্ষার ফলাফল প্রকাশিত হয়েছে। উত্তীর্ণ শিক্ষার্থীদের তালিকা এবং ভর্তির পরবর্তী নির্দেশনা জানতে পারবেন συνημμένο ফাইল থেকে।', 1),
(2, 'বার্ষিক ক্রীড়া প্রতিযোগিতার সময়সূচী', '১৮ জুলাই, ২০২৪', '#', 'প্রতিষ্ঠানের বার্ষিক ক্রীড়া প্রতিযোগিতা আগামী ২৫শে জুলাই অনুষ্ঠিত হবে। বিস্তারিত সময়সূচী জানতে পারবেন συνημμένο ফাইল থেকে।', 0),
(3, 'অভিভাবক সমাবেশ সংক্রান্ত বিজ্ঞপ্তি', '১৫ জুলাই, ২০২৪', '#', 'সকল শ্রেণীর শিক্ষার্থীদের অভিভাবকদের নিয়ে একটি গুরুত্বপূর্ণ সভা আগামী ২২শে জুলাই অনুষ্ঠিত হবে। আপনাদের উপস্থিতি একান্ত কাম্য।', 1),
(4, 'গ্রীষ্মকালীন ছুটির নোটিশ', '১০ জুলাই, ২০২৪', '#', 'আগামী ১লা আগস্ট থেকে ১৫ই আগস্ট পর্যন্ত গ্রীষ্মকালীন ছুটি উপলক্ষে প্রতিষ্ঠান বন্ধ থাকবে। ১৬ই আগস্ট থেকে যথারীতি ক্লাস চলবে।', 0),
(5, 'বিজ্ঞান মেলার আয়োজন', '০৫ জুলাই, ২০২৪', '#', 'আগামী ১০ই আগস্ট তারিখে বিদ্যালয়ে একটি বিজ্ঞান মেলার আয়োজন করা হয়েছে। আগ্রহী শিক্ষার্থীদের প্রকল্প জমা দেওয়ার জন্য অনুরোধ করা হলো।', 0);
