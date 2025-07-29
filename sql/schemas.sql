-- NOTE: This file is not executed automatically. You need to manually run these queries on your database.

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  address VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  dataAiHint VARCHAR(255)
);

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  fileUrl VARCHAR(255),
  description TEXT
);

-- Create sidebar_widgets table
CREATE TABLE IF NOT EXISTS sidebar_widgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    widget_type ENUM('profile', 'links', 'image_link') NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    image_url VARCHAR(255),
    link_url VARCHAR(255),
    content TEXT, -- For JSON data like links array
    sort_order INT DEFAULT 0
);
