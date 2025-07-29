
CREATE TABLE IF NOT EXISTS teachers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  dataAiHint VARCHAR(255) NOT NULL
);

-- Note: You can uncomment the following lines to insert the mock data into your database.
-- Make sure to adjust the values to match your needs.

-- INSERT INTO teachers (id, name, role, image, address, phone, email, dataAiHint) VALUES
-- ('1', 'মোঃ আব্দুল্লাহ আল-আমিন', 'প্রধান শিক্ষক', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01700000000', 'abdullah@example.com', 'male teacher portrait'),
-- ('2', 'ফাতেমা আক্তার', 'সহকারী প্রধান শিক্ষক', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01800000000', 'fatema@example.com', 'female teacher portrait'),
-- ('3', 'রহিম উদ্দিন আহমেদ', 'সিনিয়র শিক্ষক (গণিত)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01900000000', 'rahim@example.com', 'male teacher portrait'),
-- ('4', 'সালমা চৌধুরী', 'সিনিয়র শিক্ষক (বিজ্ঞান)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01500000000', 'salma@example.com', 'female teacher portrait'),
-- ('5', 'কামরুল হাসান', 'সহকারী শিক্ষক (ইংরেজি)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01600000000', 'kamrul@example.com', 'male teacher portrait'),
-- ('6', 'আয়েশা সিদ্দিকা', 'সহকারী শিক্ষক (বাংলা)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01300000000', 'ayesha@example.com', 'female teacher portrait'),
-- ('7', 'আরিফুল ইসলাম', 'সহকারী শিক্ষক (শরীরচর্চা)', 'https://placehold.co/300x400.png', 'ঢাকা, বাংলাদেশ', '01400000000', 'ariful@example.com', 'male teacher portrait');


CREATE TABLE IF NOT EXISTS notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  description TEXT,
  fileUrl VARCHAR(255)
);

-- Note: You can uncomment the following lines to insert the mock data into your database.
-- INSERT INTO notices (title, date, description, fileUrl) VALUES
-- ('ভর্তি পরীক্ষার ফলাফল প্রকাশ', '২০ জুলাই, ২০২৪', '২০২৪-২৫ শিক্ষাবর্ষের ভর্তি পরীক্ষার ফলাফল প্রকাশিত হয়েছে। উত্তীর্ণ শিক্ষার্থীদের তালিকা এবং ভর্তির পরবর্তী নির্দেশনা জানতে পারবেন συνημμένο ফাইল থেকে।', '#'),
-- ('বার্ষিক ক্রীড়া প্রতিযোগিতার সময়সূচী', '১৮ জুলাই, ২০২৪', 'প্রতিষ্ঠানের বার্ষিক ক্রীড়া প্রতিযোগিতা আগামী ২৫শে জুলাই অনুষ্ঠিত হবে। বিস্তারিত সময়সূচী জানতে পারবেন συνημμένο ফাইল থেকে।', '#'),
-- ('অভিভাবক সমাবেশ সংক্রান্ত বিজ্ঞপ্তি', '১৫ জুলাই, ২০২৪', 'সকল শ্রেণীর শিক্ষার্থীদের অভিভাবকদের নিয়ে একটি গুরুত্বপূর্ণ সভা আগামী ২২শে জুলাই অনুষ্ঠিত হবে। আপনাদের উপস্থিতি একান্ত কাম্য।', '#'),
-- ('গ্রীষ্মকালীন ছুটির নোটিশ', '১০ জুলাই, ২০২৪', 'আগামী ১লা আগস্ট থেকে ১৫ই আগস্ট পর্যন্ত গ্রীষ্মকালীন ছুটি উপলক্ষে প্রতিষ্ঠান বন্ধ থাকবে। ১৬ই আগস্ট থেকে যথারীতি ক্লাস চলবে।', '#'),
-- ('বিজ্ঞান মেলার আয়োজন', '০৫ জুলাই, ২০২৪', 'আগামী ১০ই আগস্ট তারিখে বিদ্যালয়ে একটি বিজ্ঞান মেলার আয়োজন করা হয়েছে। আগ্রহী শিক্ষার্থীদের প্রকল্প জমা দেওয়ার জন্য অনুরোধ করা হলো।', '#'),
-- ('ডিবেটিং ক্লাব সদস্য আহ্বান', '০২ জুলাই, ২০২৪', 'আমাদের স্কুলের ডিবেটিং ক্লাবের নতুন সদস্য আহ্বান করা হচ্ছে। আগ্রহী শিক্ষার্থীদের যোগাযোগ করার জন্য বলা হলো।', '#'),
-- ('ঈদুল আযহা উপলক্ষে ছুটি', '২৮ জুন, ২০২৪', 'পবিত্র ঈদুল আযহা উপলক্ষে আগামী ৩০শে জুন থেকে ৫ই জুলাই পর্যন্ত স্কুল বন্ধ থাকবে।', '#'),
-- ('কলেজ ইউনিফর্ম সংক্রান্ত বিজ্ঞপ্তি', '২৫ জুন, ২০২৪', 'সকল শিক্ষার্থীদের নতুন শিক্ষাবর্ষ থেকে নির্ধারিত ইউনিফর্ম পরিধান করার জন্য নির্দেশ দেওয়া হচ্ছে।', '#'),
-- ('শিক্ষক-অভিভাবক সভা', '২০ জুন, ২০২৪', 'শিক্ষার্থীদের সার্বিক অবস্থা পর্যালোচনার জন্য একটি শিক্ষক-অভিভাবক সভা অনুষ্ঠিত হবে।', '#'),
-- ('আন্তঃস্কুল ফুটবল টুর্নামেন্ট', '১৫ জুন, ২০২৪', 'আন্তঃস্কুল ফুটবল টুর্নামেন্টে অংশগ্রহণের জন্য আগ্রহী খেলোয়াড়দের নাম জমা দেওয়ার অনুরোধ করা হচ্ছে।', '#');
