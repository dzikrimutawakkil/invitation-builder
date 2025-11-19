export default class UIManager {
    constructor(templateLibrary, canvasManager, networkManager) {
        this.library = templateLibrary;
        this.canvas = canvasManager;
        this.network = networkManager;
        
        this.selectedBlock = null;   // The Wrapper (for padding/delete)
        this.selectedElement = null; // The Specific Item (for color/font/image)

        // DOM Elements
        this.modal = document.getElementById('templateModal');
        this.grid = document.getElementById('templateGrid');
        this.closeBtn = document.querySelector('.close-btn');
        
        // Panel Sections
        this.panel = document.getElementById('propertiesPanel'); // Main Panel
        this.imageControls = document.getElementById('imageControls');
        this.textControls = document.getElementById('textControls'); 

        // Inputs
        this.imageInput = document.getElementById('imageInput');
        this.imgWidthInput = document.getElementById('imgWidthInput');
        this.imgRadiusInput = document.getElementById('imgRadiusInput');

        this.colorInput = document.getElementById('colorInput');
        this.bgColorInput = document.getElementById('bgColorInput');
        this.paddingInput = document.getElementById('paddingInput');
        this.fontSizeInput = document.getElementById('fontSizeInput');
        this.deleteBtn = document.getElementById('deleteBlockBtn');
        
        this.colorVal = document.getElementById('colorValue');
        this.bgVal = document.getElementById('bgColorValue');
    }

    init() {
        this.closeBtn.onclick = () => this.closeModal();
        window.onclick = (e) => { if (e.target == this.modal) this.closeModal(); };

        // --- SELECTION LISTENER (The Magic Part) ---
        this.canvas.setSelectionListener((block, element) => {
            this.selectedBlock = block;
            this.selectedElement = element;
            this.updatePanelValues(); // Switch the sidebar tools!
        });

        // --- IMAGE LOGIC ---
        this.imageInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file && this.selectedElement && this.selectedElement.tagName === 'IMG') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.selectedElement.src = event.target.result; 
                };
                reader.readAsDataURL(file);
            }
        };

        this.imgWidthInput.oninput = (e) => {
            if (this.selectedElement && this.selectedElement.tagName === 'IMG') {
                this.selectedElement.style.width = e.target.value + '%';
            }
        };
        
        this.imgRadiusInput.oninput = (e) => {
            if (this.selectedElement && this.selectedElement.tagName === 'IMG') {
                this.selectedElement.style.borderRadius = e.target.value + '%';
            }
        };

        // --- TEXT & BOX LOGIC ---
        this.colorInput.oninput = (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.color = e.target.value;
                this.colorVal.innerText = e.target.value;
            }
        };

        this.fontSizeInput.onchange = (e) => {
            if (this.selectedElement) this.selectedElement.style.fontSize = e.target.value;
        };

        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.onclick = () => {
                if (this.selectedElement) this.selectedElement.style.textAlign = btn.dataset.align;
            };
        });

        this.bgColorInput.oninput = (e) => {
            if (this.selectedBlock) {
                this.selectedBlock.style.backgroundColor = e.target.value;
                this.bgVal.innerText = e.target.value;
            }
        };

        this.paddingInput.oninput = (e) => {
            if (this.selectedBlock) this.selectedBlock.style.padding = e.target.value + 'px';
        };

        this.deleteBtn.onclick = () => {
            if (confirm("Delete this block?")) {
                this.canvas.deleteSelected();
                this.panel.style.display = 'none';
            }
        };
    }

    /**
     * Decides whether to show Image Controls or Text Controls
     */
    updatePanelValues() {
        if (!this.selectedElement) return;

        const tagName = this.selectedElement.tagName;

        if (tagName === 'IMG') {
            // It's a Photo -> Show Photo Tools
            this.imageControls.style.display = 'block';
            this.textControls.style.display = 'none';

            // Set slider values to match the current image
            this.imgWidthInput.value = parseInt(this.selectedElement.style.width) || 100;
            this.imgRadiusInput.value = parseInt(this.selectedElement.style.borderRadius) || 0;

        } else {
            // It's Text (or something else) -> Show Text Tools
            this.imageControls.style.display = 'none';
            this.textControls.style.display = 'block';

            // Sync Text inputs
            const style = window.getComputedStyle(this.selectedElement);
            this.fontSizeInput.value = style.fontSize;
            // (You can add more syncing logic here if needed)
        }
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
    
    togglePreview() {
            document.body.classList.toggle('preview-mode');
    }
}