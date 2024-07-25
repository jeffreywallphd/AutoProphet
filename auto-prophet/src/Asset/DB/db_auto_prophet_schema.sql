
-- added tables --

-- db name will pick filename with schema: db_auto_prophet.sql

-- Set current timestamp
PRAGMA foreign_keys = ON;
PRAGMA temp_store = MEMORY;

-- Create tutor_categ table
CREATE TABLE IF NOT EXISTS tutor_categ (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL
);

-- Insert data into tutor_categ
INSERT OR IGNORE INTO tutor_categ (id, name, code) VALUES (1, 'Stocks','Stock');
INSERT OR IGNORE INTO tutor_categ (id, name, code) VALUES (2, 'Index Funds','Index');
INSERT OR IGNORE INTO tutor_categ (id, name, code) VALUES (3, 'Bonds','Bond');
INSERT OR IGNORE INTO tutor_categ (id, name, code) VALUES (4, 'Taxes','Tax');
INSERT OR IGNORE INTO tutor_categ (id, name, code) VALUES (5, 'Risk Analysis','RiskAnalysis');
INSERT OR IGNORE INTO tutor_categ (id, name, code) VALUES (6, 'AI and Machine Learning','MLAI');

-- Create tutor_topic table
CREATE TABLE IF NOT EXISTS tutor_topic (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  heading TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT NOT NULL,
  categ_id INTEGER,
  dura_min INTEGER,
  is_pub INTEGER NOT NULL,
  source TEXT,
  author TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_upd DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert data into tutor_topic
INSERT OR IGNORE INTO tutor_topic (id, heading, description, keywords,categ_id, dura_min, is_pub, created, last_upd) VALUES 
(1, 'Introduction to Stocks', 'This learning module provides you with an introduction to stocks and the stock market.','stock market', 1, 10, 1, CURRENT_TIMESTAMP, NULL),
(2, 'Basics of Blockchain', 'This learning module provides you with an introduction to blockchain.','blockchain introduction', NULL, 10, 1, CURRENT_TIMESTAMP, NULL),
(3, 'What is stock screening?', 'This learning module provides you with an introduction to stock screening.','stock screening introduction', 1, 10, 1, CURRENT_TIMESTAMP, NULL),
(4, 'Introduction to Bonds', 'This learning module provides you with an introduction to bonds.','bond', 3, 10, 1, CURRENT_TIMESTAMP, NULL),
(5, 'Risk Free Investments', 'This learning module provides you with some helpful information about risk free investments.','risk free investments', 5, 10, 1, CURRENT_TIMESTAMP, NULL);

-- Create section_type table
CREATE TABLE IF NOT EXISTS section_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  desc TEXT NOT NULL,
  expect_type TEXT NOT NULL
);

-- Insert data into section_type
INSERT OR IGNORE INTO section_type (id, code, desc, expect_type) VALUES 
(1, 'DESC', 'Description', 'STR'),
(2, 'EXMP', 'Example', 'STR'),
(3, 'CODE', 'Code snippet', 'STR'),
(4, 'IMG', 'Image or Figure', 'URL');

-- Create tutor_section table
CREATE TABLE IF NOT EXISTS tutor_section (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  heading TEXT NOT NULL, 
  content_html TEXT, 
  voice_over_url TEXT,
  order_idx INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  sect_type_id INTEGER NOT NULL, 
  dura_min INTEGER,
  is_pub INTEGER NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_upd DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES tutor_topic (id) ON UPDATE CASCADE,
  FOREIGN KEY (sect_type_id) REFERENCES section_type (id) ON UPDATE CASCADE
);

-- Insert data into tutor_section
INSERT OR IGNORE INTO tutor_section (id, heading, content_html, voice_over_url, order_idx, topic_id, sect_type_id, dura_min, is_pub, created, last_upd) VALUES 
(1, 'What is a Stock and What Happens When you Invest?', '<p>Stocks topic 1 content...</p>', NULL, 1, 1, 1, NULL, 1, CURRENT_TIMESTAMP, NULL),
(2, 'Topics Covered', '<ul><li>What is a stock?</li><li>Dividends</li><li>How to invest</li><li>Returns</li></ul>', NULL, 2, 1, 1, NULL, 1, CURRENT_TIMESTAMP, NULL),
(3, 'What is a Stock?', '', NULL, 3, 1, 1, NULL, 1, CURRENT_TIMESTAMP, NULL),
(4, 'Stock Shareholders', '<ul><li>A stock represents ownership of a company</li><li>When you purchase a stock, you become a shareholder in the company</li><li>Your ownership stake in the company depends on the number of shares you own</li></ul>', 'Stocks/Slide4_Stocks.mp3', 4, 1, 1, NULL, 1, CURRENT_TIMESTAMP, NULL),
(5, 'Stock Value', '<p>The value of a stock can fluctuate based on various factors</p>', 'Stocks/Slide4_Stocks.mp3', 5, 1, 1, NULL, 1, CURRENT_TIMESTAMP, NULL);




