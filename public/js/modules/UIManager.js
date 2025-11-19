export default class UIManager {
    constructor(templateLibrary, canvasManager, networkManager) {
        this.library = templateLibrary;
        this.canvas = canvasManager;
        this.network = networkManager;
        
        this.selectedBlock = null;   // The Wrapper (for padding/delete)
        this.selectedElement = null; // The Text (for color/font)

        // DOM Elements
        this.modal = document.getElementById('templateModal');
        this.grid = document.getElementById('templateGrid');
        this.closeBtn = document.querySelector('.close-btn');
        
        // Panel Inputs
        this.panel = document.getElementById('styleControls');
        this.colorInput = document.getElementById('colorInput');
        this.bgColorInput = document.getElementById('bgColorInput');
        this.paddingInput = document.getElementById('paddingInput');
        this.fontSizeInput = document.getElementById('fontSizeInput');
        this.deleteBtn = document.getElementById('deleteBlockBtn');
        
        // Color Value Labels
        this.colorVal = document.getElementById('colorValue');
        this.bgVal = document.getElementById('bgColorValue');
    }

    init() {
        this.closeBtn.onclick = () => this.closeModal();
        window.onclick = (e) => { if (e.target == this.modal) this.closeModal(); };

        // --- SELECTION LISTENER ---
        this.canvas.setSelectionListener((block, element) => {
            this.selectedBlock = block;
            this.selectedElement = element;
            this.updatePanelValues(); // Sync inputs with the clicked element
        });

        // --- 1. TEXT PROPERTIES (Apply to specific element) ---
        
        // Text Color
        this.colorInput.oninput = (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.color = e.target.value;
                this.colorVal.innerText = e.target.value;
            }
        };

        // Font Size
        this.fontSizeInput.onchange = (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.fontSize = e.target.value;
            }
        };

        // Text Alignment
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.onclick = () => {
                if (this.selectedElement) {
                    this.selectedElement.style.textAlign = btn.dataset.align;
                }
            };
        });

        // --- 2. BOX PROPERTIES (Apply to the wrapper block) ---

        // Background Color
        this.bgColorInput.oninput = (e) => {
            if (this.selectedBlock) {
                this.selectedBlock.style.backgroundColor = e.target.value;
                this.bgVal.innerText = e.target.value;
            }
        };

        // Padding
        this.paddingInput.oninput = (e) => {
            if (this.selectedBlock) {
                this.selectedBlock.style.padding = e.target.value + 'px';
            }
        };

        // Delete
        this.deleteBtn.onclick = () => {
            if (confirm("Delete this block?")) {
                this.canvas.deleteSelected();
                this.panel.style.display = 'none';
            }
        };
    }

    /**
     * Read the styles from the clicked element and update the sidebar
     */
    updatePanelValues() {
        this.panel.style.display = 'block';
        if (!this.selectedElement || !this.selectedBlock) return;

        // Get computed styles (what the browser actually shows)
        const textStyle = window.getComputedStyle(this.selectedElement);
        const boxStyle = window.getComputedStyle(this.selectedBlock);

        // Helper: Convert rgb(0,0,0) to #000000
        const rgbToHex = (rgb) => {
            if (!rgb || rgb.indexOf('rgb') === -1) return '#000000';
            const sep = rgb.indexOf(",") > -1 ? "," : " ";
            const rgbArr = rgb.substr(4).split(")")[0].split(sep);
            let r = (+rgbArr[0]).toString(16),
                g = (+rgbArr[1]).toString(16),
                b = (+rgbArr[2]).toString(16);
            if (r.length == 1) r = "0" + r;
            if (g.length == 1) g = "0" + g;
            if (b.length == 1) b = "0" + b;
            return "#" + r + g + b;
        };

        // Update UI Inputs
        this.colorInput.value = rgbToHex(textStyle.color);
        this.colorVal.innerText = this.colorInput.value;

        this.bgColorInput.value = rgbToHex(boxStyle.backgroundColor);
        this.bgVal.innerText = this.bgColorInput.value;
        
        this.paddingInput.value = parseInt(boxStyle.padding) || 20;
        
        // Try to match font size to dropdown, or default to Normal
        this.fontSizeInput.value = textStyle.fontSize; 
    }

    // ... (Keep openCategorySelector and handleSave unchanged) ...
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