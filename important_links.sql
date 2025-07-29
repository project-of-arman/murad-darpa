-- Create the table for link groups
CREATE TABLE `important_link_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image` longtext,
  `data_ai_hint` varchar(255) DEFAULT 'icon',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

-- Create the table for individual links
CREATE TABLE `important_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `text` varchar(255) NOT NULL,
  `href` varchar(2083) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `important_links_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `important_link_groups` (`id`) ON DELETE CASCADE
);
