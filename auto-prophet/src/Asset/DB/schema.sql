DROP TABLE IF EXISTS LearningModule;
DROP TABLE IF EXISTS LearningModulePage;

CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT,
  lastName TEXT,
  username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS PublicCompany (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT,
    ticker TEXT NOT NULL UNIQUE,
    cik TEXT NOT NULL,
    isSP500 INTEGER DEFAULT 0
);

/*create a table to track changes to some tables that act as cache*/
CREATE TABLE IF NOT EXISTS modifications (
    tableName TEXT NOT NULL PRIMARY KEY ON CONFLICT REPLACE,
    action TEXT NOT NULL,
    changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*create a trigger to update the modificaitons table when Delete occurs on PublicCompany*/
CREATE TRIGGER IF NOT EXISTS PublicCompanyOnDelete AFTER DELETE ON PublicCompany
BEGIN
    INSERT INTO modifications (tableName, action) VALUES ('PublicCompany','DELETE');
END;

CREATE TABLE IF NOT EXISTS LearningModule(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT NOT NULL,
    timeEstimate REAL NOT NULL,
    category TEXT NOT NULL,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS LearningModulePage(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    moduleId INTEGER NOT NULL,
    title TEXT NOT NULL,
    subTitle TEXT,
    pageContentUrl TEXT,
    voiceoverUrl TEXT,
    pageNumber INTEGER NOT NULL,
    pageType TEXT CHECK(pageType IN ("TitlePage","SectionPage","ContentPage")) DEFAULT 'ContentPage',
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (moduleId) REFERENCES LearningModule(id)
);

CREATE TABLE IF NOT EXISTS LearningModuleQuiz(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    moduleId INTEGER NOT NULL,
    FOREIGN KEY (moduleId) REFERENCES LearningModule(id)
);

CREATE TABLE IF NOT EXISTS LearningModuleQuizQuestion(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    moduleQuizId INTEGER NOT NULL,
    question TEXT NOT NULL,
    option1 TEXT,
    option2 TEXT,
    option3 TEXT,
    option4 TEXT,
    option5 TEXT,
    option6 TEXT,
    correctOption INTEGER,
    explanation TEXT,
    FOREIGN KEY (moduleQuizId) REFERENCES LearningModuleQuiz(id)
);

CREATE TABLE IF NOT EXISTS LearningModuleQuizCompletion(
    userId INTEGER NOT NULL,
    moduleQuizId INTEGER NOT NULL,
    PRIMARY KEY (userId, moduleQuizId)
    FOREIGN KEY (moduleQuizId) REFERENCES LearningModuleQuiz(id)
    FOREIGN KEY (userId) REFERENCES User(id)    
);

INSERT OR IGNORE INTO LearningModule (id, title, description, keywords, timeEstimate, category) VALUES (1, "Introduction to Stocks", "This learning module provides you with an introduction to stocks and the stock market.", "stock market", 10, "Stock");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (1, "Introduction to Stocks", "What is a Stock and What Happens When you Invest?", 1, "TitlePage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, pageNumber) VALUES (1, "Topics Covered", "Stocks/Slide2.html", 2);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageNumber, pageType) VALUES (1, "What is a Stock?", 3, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (1, "Stock Shareholders", "Stocks/Slide4.html", "Stocks/Slide4_Stocks.mp3", 4);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (1, "Stock Value", "Stocks/Slide5.html", "Stocks/Slide5_Stocks.mp3", 5);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageNumber, pageType) VALUES (1, "Dividends", 6, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (1, "What is a Dividend", "Stocks/Slide7.html", "Stocks/Slide7_Stocks.mp3", 7);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageNumber, pageType) VALUES (1, "How to Invest", 8, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (1, "Buying and Selling Stock", "Stocks/Slide9.html", "Stocks/Slide9_Stocks.mp3", 9);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (1, "How to Invest in Common Stock", "Stocks/Slide10.html", "Stocks/Slide10_Stocks.mp3", 10);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (1, "Stock Options", "Stocks/Slide11.html", "Stocks/Slide11_Stocks.mp3", 11);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (1, "Returns", "Stocks/Slide12.html", "Stocks/Slide12_Stocks.mp3", 12);

INSERT OR IGNORE INTO LearningModule (id, title, description, keywords, timeEstimate, category) VALUES (2, "Introduction to Bonds", "This learning module provides you with an introduction to bonds.", "bonds investment introduction", 10, "Bond");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (2, "Introduction to Bonds", "What is a Bond?", 1, "TitlePage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, pageNumber) VALUES (2, "Topics Covered", "Bonds/Slide2.html",2);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (2, "Bonds", "What they are", 3, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Definitions and Explanations", "Bonds/Slide4.html", "Bonds_Voiceovers/Slide4_Bonds.mp3", 4);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Important to Note about Bonds", "Bonds/Slide5.html", "Bonds_Voiceovers/Slide5_Bonds.mp3", 5);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Bond Maturity: What is it?", "Bonds/Slide6.html", "Bonds_Voiceovers/Slide6_Bonds.mp3", 6);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (2, "Bonds", "The Different Types", 7, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Types of Bonds", "Bonds/Slide8.html", "Bonds_Voiceovers/Slide8_Bonds.mp3", 8);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Zero Coupon Bonds", "Bonds/Slide9.html", "Bonds_Voiceovers/Slide9_Bonds.mp3", 9);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "How Bonds Interact with Taxes", "Bonds/Slide10.html", "bonds_Voiceovers/Slide10_Bonds.mp3", 10);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (2, "Bonds", "The Risks", 11, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Two Main Risks", "Bonds/Slide12.html", "Bonds_Voiceovers/Slide12_Bonds.mp3", 12);

INSERT OR IGNORE INTO LearningModule (id, title, description, keywords, timeEstimate, category) VALUES (7, "What is stock screening?", "This learning module provides you with an introduction to stock screening.", "stock screening introduction", 10, "Stock Screening");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, pageNumber) VALUES (7, "Topics Covered", "StockScreening/Slide2.html",1);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (7, "Market Beta", "StockScreening/Slide3.html", "StockScreening/StockScreeningSlide3.mp3", 2);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (7, "Stock Screening", "Market Beta", 3, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (7, "Ratios", "StockScreening/Slide4.html", "StockScreening/StockScreeningSlide4.mp3", 4);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (7, "Build Your own Strategy", "StockScreening/Slide5.html", "StockScreening/StockScreeningSlide5.mp3", 5);

INSERT OR IGNORE INTO LearningModule (id, title, description, keywords, timeEstimate, category) VALUES (8, "Basics of Blockchain", "This learning module provides you with an introduction to blockchain.", "blockchain introduction", 10, "Blockchain");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (8, "A Beginner's Overview To Blockchain", "Blockchain/Slide2.html", "Blockchain/BlockchainSlide2.mp3", 1);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (8, "Blockchain Basics", "Blockchain/Slide3.html", "Blockchain/BlockchainSlide3.mp3", 2);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (8, "How to invest in Crypto and NFTs?", "Multiple exchanges and opportunities!", 3, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (8, "Ratios", "Blockchain/Slide4.html", "Blockchain/BlockchainSlide4.mp3", 4);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (8, "Crypto and NFTs", "Blockchain/Slide5.html", "Blockchain/BlockchainSlide5.mp3", 5);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (8, "Risks and Obligations", "Blockchain/Slide6.html", "Blockchain/BlockchainSlide6.mp3", 6);

INSERT OR IGNORE INTO LearningModule (id,title, description, keywords, timeEstimate, category) VALUES (4, "Risk Free Investments", "This learning module provides you with some helpful information about risk free investments", "risk free investments", 10, "Risk Free Investments");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, pageNumber) VALUES (4, "Topics Covered", "RiskFreeInvestments/Slide1.html", 1);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageNumber, pageType) VALUES (4, "What are risk free investments?", 2, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (4, "What types are there?", "RiskFreeInvestments/Slide3.html", "RiskFreeInvestments/Slide3_RiskFree.mp3", 3);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (4, "What does each type do? Savings Accounts", "RiskFreeInvestments/Slide4.html", "RiskFreeInvestments/Slide4_RiskFree.mp3", 4);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (4, "What does each type do? Treasury Bills", "RiskFreeInvestments/Slide5.html", "RiskFreeInvestments/Slide5_RiskFree.mp3", 5);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (4, "What does each type do? Treasury Bonds", "RiskFreeInvestments/Slide6.html", "RiskFreeInvestments/Slide6_RiskFree.mp3", 6);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (4, "What does each type do? Money Market", "RiskFreeInvestments/Slide7.html", "RiskFreeInvestments/Slide7_RiskFree.mp3", 7);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (4, "What does each type do? CD's", "RiskFreeInvestments/Slide8.html", "RiskFreeInvestments/Slide8_RiskFree.mp3", 8);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (4, "How safe are they?", "RiskFreeInvestments/Slide9.html", "RiskFreeInvestments/Slide9_RiskFree.mp3", 9);






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







