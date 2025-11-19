// --- 1. THE TEMPLATE LIBRARY ---
const templates = {
    hero: {
        classic: `
            <div class="hero-section hero-classic">
                <h1 class="hero-title">Romeo & Juliet</h1>
                <p>Are getting married</p>
            </div>`,
        modern: `
            <div class="hero-section hero-modern">
                <h1 class="hero-title-modern">ROMEO & JULIET</h1>
                <div class="modern-line"></div>
                <p>INVITE YOU TO THEIR WEDDING</p>
            </div>`,
        elegant: `
            <div class="hero-section hero-elegant">
                <h1 class="hero-title-script">Romeo <span class="and">&</span> Juliet</h1>
                <p>Request the honor of your presence</p>
            </div>`
    },
    text: {
        simple: `<p style="padding:20px;">We invite you to celebrate our joy.</p>`,
        boxed: `<div style="padding:20px; border: 2px solid #333; margin: 10px;"><p>We invite you to celebrate our joy.</p></div>`
    }
    // Add more categories (details, guest) here...
};

const canvas = document.getElementById('canvas');
const modal = document.getElementById('templateModal');
const modalGrid = document.getElementById('templateGrid');

// --- 2. SHOW THE SELECTION MODAL ---
function openTemplateSelector(type) {
    // Clear previous options
    modalGrid.innerHTML = '';
    
    // Get all styles for this type (e.g., 'hero' -> classic, modern, elegant)
    const options = templates[type];
    
    // Create a clickable preview card for each style
    for (const [styleName, html] of Object.entries(options)) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <div class="preview-box">${html}</div>
            <p>${styleName.toUpperCase()}</p>
        `;
        
        // When clicked, actually add the block
        card.onclick = () => {
            addBlockToCanvas(html);
            closeModal();
        };
        
        modalGrid.appendChild(card);
    }

    // Show the modal
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// --- 3. ADD TO CANVAS (The Final Step) ---
function addBlockToCanvas(htmlContent) {
    // Remove placeholder if exists
    if (canvas.innerText.includes('Add blocks from')) canvas.innerHTML = '';

    let el = document.createElement('div');
    el.className = 'block';
    el.contentEditable = "true"; 
    el.innerHTML = htmlContent;

    canvas.appendChild(el);
}

// Close modal if clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) closeModal();
}