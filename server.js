// Import Express and the 'path' module
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// --- 1. Middleware Setup ---

// Set the view engine to EJS (Embedded JavaScript)
app.set('view engine', 'ejs');
// Tell Express where to find the template files (views directory)
app.set('views', path.join(__dirname, 'views')); 

// Middleware to parse incoming POST request data (form data)
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files (CSS, images) from a 'public' folder (optional for now, but good practice)
app.use(express.static(path.join(__dirname, 'public')));


// --- 2. Routes ---

// GET Route: Main Builder Form Page (Home Page)
app.get('/', (req, res) => {
    // Renders the index.ejs file
    res.render('index', { title: 'Invitation Builder' }); 
});

// POST Route: Handle Form Submission and Generate Invitation
app.post('/create-invite', (req, res) => {
    // 'req.body' contains the form data submitted by the user
    const invitationData = req.body; 

    // You can inspect the data received in your terminal:
    console.log('Received Invitation Data:', invitationData);

    // Render the final invitation template, passing the received data to it.
    // The data object (invitationData) will be available in invitation.ejs
    res.render('invitation', { 
        title: 'Your Custom Invitation',
        // Pass all the form fields directly
        ...invitationData 
    });
});


// --- 3. Start Server ---

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('To view the form, open your browser to http://localhost:3000');
});

// For better error logging
app.on('error', (err) => {
    console.error('Server error:', err);
});