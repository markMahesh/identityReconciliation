import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config(); 

export const db = mysql.createPool({
    port: Number(process.env.MYSQL_PORT),
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function initializeDatabase() {
    try {
        const connection = await db.getConnection();
        await connection.query(`
      CREATE TABLE IF NOT EXISTS abcdef (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phoneNumber VARCHAR(20) NULL,
        email VARCHAR(255) NULL,
        linkedId INT NULL,
        linkPrecedence ENUM('primary', 'secondary') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP NULL
      );
    `);
        console.log('DataBase initialisation successfull')
        connection.release();
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}