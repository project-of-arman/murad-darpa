-- This file contains the SQL schema for the application.

-- Drop tables if they exist to ensure a clean slate.
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `carousel_items`;
DROP TABLE IF EXISTS `about_school`;
DROP TABLE IF EXISTS `school_features`;

-- Create the site_settings table
-- This table stores global settings for the website, such as meta tags for SEO.
CREATE TABLE `site_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_title` varchar(255) DEFAULT 'মুরাদদর্প নারায়নপুর নিম্ন মাধ্যমিক বিদ্যালয়',
  `meta_description` text,
  `meta_keywords` text,
  `favicon_url` longtext,
  PRIMARY KEY (`id`)
);

-- Insert a default row into site_settings.
-- This ensures that there is always a row to update.
INSERT INTO `site_settings` (`id`) VALUES (1);

-- Create the carousel_items table
-- This table stores the slides for the homepage hero carousel.
CREATE TABLE `carousel_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `src` longtext NOT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `dataAiHint` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`)
);

-- Create the about_school table
-- This table stores the main information for the "About Us" section.
CREATE TABLE `about_school` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image_url` longtext,
  PRIMARY KEY (`id`)
);

-- Insert a default row into about_school.
INSERT INTO `about_school` (`id`, `title`, `description`, `image_url`) VALUES (1, 'আমাদের সম্পর্কে', 'আপনার স্কুল সম্পর্কে এখানে লিখুন।', 'https://placehold.co/400x500.png');

-- Create the school_features table
-- This table stores the feature cards displayed on the "School Details" page.
CREATE TABLE `school_features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
);

