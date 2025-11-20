const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs'); // Import File System module

class DesignStorage {
    constructor() {
        // 1. Define the folder and file paths
        const dbFolder = path.join(__dirname, '../data');
        const dbPath = path.join(dbFolder, 'database.sqlite');

        // 2. CRITICAL FIX: Create the 'data' folder if it doesn't exist
        if (!fs.existsSync(dbFolder)) {
            fs.mkdirSync(dbFolder);
            console.log('Created database folder.');
        }
        
        // 3. Connect to the Database
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
            } else {
                console.log('Connected to SQLite database');
            }
        });

        this.initDB();
    }

    // Create the table if it doesn't exist
    initDB() {
        const sql = `
            CREATE TABLE IF NOT EXISTS invitations (
                id TEXT PRIMARY KEY,
                content TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        this.db.run(sql);
    }

    /**
     * Save design to the database (Async)
     */
    save(htmlContent) {
        return new Promise((resolve, reject) => {
            // Generate a unique ID
            const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            
            const sql = `INSERT INTO invitations (id, content) VALUES (?, ?)`;
            
            this.db.run(sql, [id, htmlContent], function(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(`[DB] Row inserted with ID: ${id}`);
                    resolve(id);
                }
            });
        });
    }

    /**
     * Get design from the database (Async)
     */
    get(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT content FROM invitations WHERE id = ?`;
            
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    // If row exists, return content; otherwise return null
                    resolve(row ? row.content : null);
                }
            });
        });
    }
}

module.exports = DesignStorage;