const canvas = document.getElementById('canvas');

function addBlock(type) {
    // Remove placeholder text
    if (canvas.innerText.includes('Add blocks from')) canvas.innerHTML = '';

    let el = document.createElement('div');
    el.className = 'block';
    el.contentEditable = "true"; 

    if (type === 'hero') {
        el.className += ' hero-section';
        el.innerHTML = `<h1 class="hero-title">Romeo & Juliet</h1><p>Are getting married</p>`;
    } 
    else if (type === 'text') {
        el.style.padding = "20px";
        el.innerHTML = `<p>We invite you to celebrate our joy together.</p>`;
    } 
    else if (type === 'details') {
        el.style.padding = "20px";
        el.style.background = "#ecf0f1";
        el.style.textAlign = "center";
        el.innerHTML = `<strong>Sunday, 20th Oct 2025</strong><br>The Grand Ballroom<br>New York City`;
    } 
    else if (type === 'guest') {
        el.style.padding = "20px";
        el.style.textAlign = "center";
        el.innerHTML = `<div>Dear <span class="guest-badge">{{GUEST_NAME}}</span></div><p>You are invited!</p>`;
    }

    canvas.appendChild(el);
}

function saveDesign() {
    const html = canvas.innerHTML;
    
    fetch('/save-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlContent: html })
    })
    .then(res => res.json())
    .then(data => {
        alert('Design Saved! Try opening localhost:3000/share?to=YourName');
    });
}