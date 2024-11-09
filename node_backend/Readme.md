# AutoProphet Node Backend Setup

## Setting Up Node Backend

Follow these steps to set up the Node.js backend for the AutoProphet project:

1. **Install Packages**  
   Install the required packages by running the following command in your terminal:
   ```bash
   npm install
   ```

2. **Set Up or edit Environment Variables**  
   Create a `.env` file in the root of your project and set up your backend values for the database:
   ```plaintext
   DB_NAME=auto_prophetDB
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=5676
   DB_PORT=3306
   JWT_SECRET=yourjwtsecret

3. **Run the Application**  
   Start the application by running:
   ```bash
   npm run
   ```
   The server is set up to run on port **5000**.

4. **Check Endpoints**  
   Use Postman to manually check the API endpoints.

## Setting Up the Database

Run the following SQL queries to create the database and the necessary table for testing:

```sql
CREATE DATABASE auto_prophetDB;

USE auto_prophetDB;

CREATE TABLE IF NOT EXISTS users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   firstName VARCHAR(50) NOT NULL,
   middleName VARCHAR(50),
   lastName VARCHAR(50) NOT NULL,
   email VARCHAR(100) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   lastLoggedIn TIMESTAMP NULL,
   isLoggedIn BOOLEAN DEFAULT FALSE,
   isValid BOOLEAN DEFAULT FALSE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
  
```
## Additional Information
Make sure your MySQL server is running before executing the database setup queries or testing from Postman.