const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// --- Middleware ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- "DATABASE" (In-Memory Storage) ---
// In a real app, you would use MongoDB or MySQL. 
// Here, we store the latest design in a variable.
let latestDesign = "<h1>Welcome!</h1><p>Design not saved yet.</p>"; 


// --- Routes ---

// 1. The Builder (Admin View)
app.get('/', (req, res) => {
    res.render('index', { title: 'Invitation Builder' }); 
});

// 2. Save the Design (API)
app.post('/save-design', (req, res) => {
    const { htmlContent } = req.body;
    latestDesign = htmlContent; // Save the HTML to our variable
    console.log('Design saved!');
    res.json({ success: true, message: 'Design Saved!' });
});

// 3. The Public Shareable Link (The Magic Part)
// Example URL: http://localhost:3000/share?to=Dzikri
app.get('/share', (req, res) => {
    const guestName = req.query.to || 'Guest'; // Get 'to' from URL, default to 'Guest'
    
    // Inject the name into the saved HTML
    // We look for a special placeholder "{{GUEST_NAME}}" and replace it
    const personalizedContent = latestDesign.replace(/{{GUEST_NAME}}/g, guestName);

    res.render('invitation', { 
        title: `Invitation for ${guestName}`,
        content: personalizedContent 
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Try the builder at http://localhost:${PORT}`);
});