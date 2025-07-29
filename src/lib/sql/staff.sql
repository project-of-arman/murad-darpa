-- This is the SQL to create the `staff` table.
-- It is provided for reference and for setting up the database.
-- You can run this in your database management tool (e.g., phpMyAdmin, DBeaver) to create the table.

CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` longtext,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `data_ai_hint` varchar(255) DEFAULT 'staff portrait',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
