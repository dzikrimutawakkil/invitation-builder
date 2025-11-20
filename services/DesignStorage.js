const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs'); // Import File System module

class DesignStorage {
    constructor() {
        const dbFolder = path.join(__dirname, '../data');
        const dbPath = path.join(dbFolder, 'database.sqlite');

        if (!fs.existsSync(dbFolder)) {
            fs.mkdirSync(dbFolder);
        }
        
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) console.error('DB Error', err);
            else console.log('Connected to SQLite database');
        });

        this.initDB();
    }

    initDB() {
        // 1. Invitations Table (Added 'theme' column)
        this.db.run(`
            CREATE TABLE IF NOT EXISTS invitations (
                id TEXT PRIMARY KEY,
                content TEXT,
                theme TEXT, 
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. RSVPs Table (No changes)
        this.db.run(`
            CREATE TABLE IF NOT EXISTS rsvps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invitation_id TEXT,
                name TEXT,
                status TEXT,
                message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    save(htmlContent, theme) {
        return new Promise((resolve, reject) => {
            const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            
            // UPDATED SQL: Added theme column
            const sql = `INSERT INTO invitations (id, content, theme) VALUES (?, ?, ?)`;
            
            this.db.run(sql, [id, htmlContent, theme], function(err) {
                if (err) reject(err);
                else resolve(id);
            });
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            // UPDATED SQL: Select * to get all columns including theme
            const sql = `SELECT * FROM invitations WHERE id = ?`;
            
            this.db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                // Return the whole row (content + theme)
                else resolve(row || null);
            });
        });
    }

    // --- NEW RSVP METHODS ---

    addRSVP(invitationId, name, status, message) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO rsvps (invitation_id, name, status, message) VALUES (?, ?, ?, ?)`;
            this.db.run(sql, [invitationId, name, status, message], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    getRSVPs(invitationId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM rsvps WHERE invitation_id = ? ORDER BY created_at DESC`;
            this.db.all(sql, [invitationId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = DesignStorage;