const express = require('express');
const path = require('path');
const mainRoutes = require('./routes/index');

class App {
    constructor() {
        this.app = express();
        this.port = 3000;

        this.initializeMiddleware();
        this.initializeRoutes();
    }

    initializeMiddleware() {
        // View Engine Setup
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));

        // --- FIX: INCREASE BODY SIZE LIMIT ---
        // Default is 100kb. We increase it to 50mb to handle images.
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

        // Static Files
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    initializeRoutes() {
        this.app.use('/', mainRoutes);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
            console.log(`Try the builder at http://localhost:${this.port}`);
        });
    }
}

// --- Run the App ---
const server = new App();
server.start();