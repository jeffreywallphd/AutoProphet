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
    ticker TEXT NOT NULL,
    cik TEXT NOT NULL
);

/*create a table to track changes to some tables that act as cache*/
CREATE TABLE modifications (
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