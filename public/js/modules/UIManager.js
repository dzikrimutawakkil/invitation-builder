export default class UIManager {
    constructor(templateLibrary, canvasManager, networkManager) {
        this.library = templateLibrary;
        this.canvas = canvasManager;
        this.network = networkManager;
        this.selectedBlock = null; // Track the active block

        // DOM Elements
        this.modal = document.getElementById('templateModal');
        this.grid = document.getElementById('templateGrid');
        this.closeBtn = document.querySelector('.close-btn');
        
        // Properties Panel Elements
        this.panel = document.getElementById('styleControls');
        this.colorInput = document.getElementById('colorInput');
        this.bgColorInput = document.getElementById('bgColorInput');
        this.paddingInput = document.getElementById('paddingInput');
        this.fontSizeInput = document.getElementById('fontSizeInput');
        this.deleteBtn = document.getElementById('deleteBlockBtn');
    }

    init() {
        // Modal Events
        this.closeBtn.onclick = () => this.closeModal();
        window.onclick = (e) => { if (e.target == this.modal) this.closeModal(); };

        // Canvas Event: When a block is selected
        this.canvas.setSelectionListener((block) => {
            this.selectedBlock = block;
            this.showProperties(block);
        });

        // --- PROPERTY LISTENERS ---
        
        // 1. Text Color
        this.colorInput.oninput = (e) => {
            if (this.selectedBlock) this.selectedBlock.style.color = e.target.value;
        };

        // 2. Background Color
        this.bgColorInput.oninput = (e) => {
            if (this.selectedBlock) this.selectedBlock.style.backgroundColor = e.target.value;
        };

        // 3. Padding
        this.paddingInput.oninput = (e) => {
            if (this.selectedBlock) this.selectedBlock.style.padding = e.target.value + 'px';
        };

        // 4. Font Size (Apply to the whole block for simplicity)
        this.fontSizeInput.onchange = (e) => {
            if (this.selectedBlock) this.selectedBlock.style.fontSize = e.target.value;
        };

        // 5. Alignment Buttons
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.onclick = () => {
                if (this.selectedBlock) this.selectedBlock.style.textAlign = btn.dataset.align;
            };
        });

        // 6. Delete
        this.deleteBtn.onclick = () => {
            if (confirm("Delete this block?")) {
                this.canvas.deleteSelected();
                this.panel.style.display = 'none'; // Hide panel
            }
        };
    }

    /**
     * Update the sidebar inputs to match the clicked block
     */
    showProperties(block) {
        this.panel.style.display = 'block';
        
        // Get computed styles (current values)
        const style = window.getComputedStyle(block);

        // Helper to convert rgb() to hex for the color picker
        const rgbToHex = (rgb) => {
            if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
            // Basic conversion logic or just ignore if complex
            return '#000000'; // Simplified for demo
        };

        // Update inputs
        this.paddingInput.value = parseInt(style.padding) || 20;
        // Note: Color pickers need HEX values. Doing robust RGB->HEX in JS is tricky, 
        // so for this demo we just default them or leave them as is.
    }

    openCategorySelector(category) {
        const options = this.library.getDesigns(category);
        this.grid.innerHTML = '';
        Object.entries(options).forEach(([name, html]) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `<div class="preview-box">${html}</div><p>${name.toUpperCase()}</p>`;
            card.onclick = () => {
                this.canvas.addBlock(html);
                this.closeModal();
            };
            this.grid.appendChild(card);
        });
        this.modal.style.display = 'flex';
    }

    async handleSave() {
        const html = this.canvas.getDesignHtml();
        const result = await this.network.saveDesign(html);
        alert(result.success ? 'Design Saved!' : 'Failed to save.');
    }

    closeModal() { this.modal.style.display = 'none'; }
}