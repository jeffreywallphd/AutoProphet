DROP TABLE IF EXISTS LearningModule;
DROP TABLE IF EXISTS LearningModulePage;

CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT,
  lastName TEXT,
  username TEXT UNIQUE NOT NULL
);

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

INSERT OR IGNORE INTO LearningModule (id, title, description, keywords, timeEstimate, categry) VALUES (2, "Introduction to Bonds", "This learning module provides you with an introduction to bonds.", 10, "Bonds");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (2, "Introduction to Bonds", "What is a Bond?", 1, "TitlePage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, pageNumber) VALUES (2, "Topics Covered", "Bonds/Slide2.html",2);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (2, "Bonds", "What they are", 3, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Definitions and Explanations", "Bonds/Slide4.html", "Bonds_Voiceovers/Slide4_Bonds.mp3", 4);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Important to Note about Bonds", "Bonds/Slide5.html", "Bonds_Voiceovers/Slide5_Bonds.mp3", 5);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Bond Maturity: What is it?", "Bonds/Slide6.html", "Bonds_Voiceovers/Slide6_Bonds.mp3", 6);
INSERT OR IGNORE INTO LearningModulePage (moudleId, title, subTitle, pageNumber, pageType) VALUES (2, "Bonds", "The Different Types", 7, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Types of Bonds", "Bonds/Slide8.html", "Bonds_Voiceovers/Slide8_Bonds.mp3", 8);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Zero Coupon Bonds", "Bonds/Slide9.html", "Bonds_Voiceovers/Slide9_Bonds.mp3", 9);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "How Bonds Interact with Taxes", "Bonds/Slide10.html", "bonds_Voiceovers/Slide10_Bonds.mp3", 10);
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, subTitle, pageNumber, pageType) VALUES (2, "Bonds", "The Risks", 11, "SectionPage");
INSERT OR IGNORE INTO LearningModulePage (moduleId, title, pageContentUrl, voiceoverUrl, pageNumber) VALUES (2, "Two Main Risks", "Bonds/Slide12.htl", "Bonds_Voiceovers/Slide12_Bonds.mp3", 12);

