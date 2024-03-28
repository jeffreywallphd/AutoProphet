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
    pageContentUrl TEXT NOT NULL,
    voiceoverUrl TEXT NOT NULL,
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

INSERT OR IGNORE INTO LearningModule (title, description, keywords, timeEstimate, category) VALUES ("Test1", "This is the first test", "test module learning", 15, "Stock");
INSERT OR IGNORE INTO LearningModule (title, description, keywords, timeEstimate, category) VALUES ("Test2", "This is the second test", "test dog cat", 10, "Stock");
INSERT OR IGNORE INTO LearningModule (title, description, keywords, timeEstimate, category) VALUES ("Test3", "This is the third test", "test apricot pear", 25, "Bond");