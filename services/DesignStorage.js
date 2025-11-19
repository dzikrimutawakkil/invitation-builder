class DesignStorage {
    constructor() {
        // This mimics a database. 
        // Later, you can replace this logic with a real DB connection easily.
        this.latestDesign = "<h1>Welcome!</h1><p>Design not saved yet.</p>";
    }

    /**
     * Save the user's HTML design
     */
    save(htmlContent) {
        this.latestDesign = htmlContent;
        console.log('Storage Update: Design saved successfully.');
    }

    /**
     * Retrieve the current saved design
     */
    get() {
        return this.latestDesign;
    }
}

module.exports = DesignStorage;