export default class TemplateLibrary {
    constructor() {
        this.categories = {
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
                        <p>THE WEDDING</p>
                    </div>`,
                elegant: `
                    <div class="hero-section hero-elegant">
                        <h1 class="hero-title-script">Romeo <span class="and">&</span> Juliet</h1>
                        <p>Request the honor of your presence</p>
                    </div>`
            },
            text: {
                simple: `<p style="padding:20px;">We invite you to celebrate our joy.</p>`,
                boxed: `<div style="padding:20px; border: 1px solid #333; margin: 10px;"><p>We invite you to celebrate.</p></div>`
            },
            details: {
                classic: `<div style="padding:20px; text-align:center; background:#f9f9f9;"><strong>Oct 20th, 2025</strong><br>New York City</div>`
            },
            guest: {
                default: `<div style="padding:20px; text-align:center;">Dear <span class="guest-badge">{{GUEST_NAME}}</span></div>`
            }
        };
    }

    /**
     * Returns all design options for a specific category (e.g., 'hero')
     */
    getDesigns(category) {
        return this.categories[category] || {};
    }
}