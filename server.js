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

        // Body Parsing (for JSON and Form data)
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Static Files
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    initializeRoutes() {
        // Use the routes defined in our separate file
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