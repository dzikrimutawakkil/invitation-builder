export default class UIManager {
    constructor(templateLibrary, canvasManager, networkManager) {
        this.library = templateLibrary;
        this.canvas = canvasManager;
        this.network = networkManager;

        // DOM Elements
        this.modal = document.getElementById('templateModal');
        this.grid = document.getElementById('templateGrid');
        this.closeBtn = document.querySelector('.close-btn');
    }

    init() {
        // Setup Modal Close Events
        this.closeBtn.onclick = () => this.closeModal();
        window.onclick = (e) => { if (e.target == this.modal) this.closeModal(); };
    }

    /**
     * Called when a sidebar button is clicked
     */
    openCategorySelector(category) {
        const options = this.library.getDesigns(category);
        
        // 1. Clear previous items
        this.grid.innerHTML = '';

        // 2. Create cards for each template
        Object.entries(options).forEach(([name, html]) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="preview-box">${html}</div>
                <p>${name.toUpperCase()}</p>
            `;
            
            // Interaction: When card is clicked -> Add to Canvas
            card.onclick = () => {
                this.canvas.addBlock(html);
                this.closeModal();
            };

            this.grid.appendChild(card);
        });

        // 3. Show Modal
        this.modal.style.display = 'flex';
    }

    /**
     * Called when Save button is clicked
     */
    async handleSave() {
        const html = this.canvas.getDesignHtml();
        const result = await this.network.saveDesign(html);
        
        if (result.success) {
            alert('Design Saved Successfully!');
        } else {
            alert('Failed to save.');
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
    }
}