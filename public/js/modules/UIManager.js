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

        this.commonControls = document.getElementById('commonControls');
        this.moveUpBtn = document.getElementById('moveUpBtn');
        this.moveDownBtn = document.getElementById('moveDownBtn');

        // NEW: Save Modal Elements
        this.saveModal = document.getElementById('saveModal');
        this.shareUrlInput = document.getElementById('shareUrlInput');
        this.copyLinkBtn = document.getElementById('copyLinkBtn');
        this.openLinkBtn = document.getElementById('openLinkBtn');
    }

    init() {
        this.closeBtn.onclick = () => this.closeModal();
        window.onclick = (e) => { if (e.target == this.modal) this.closeModal(); };

        // NEW: Copy Link Logic
        this.copyLinkBtn.onclick = () => {
            this.shareUrlInput.select();
            document.execCommand('copy');
            this.copyLinkBtn.innerText = '✅ Copied!';
            setTimeout(() => this.copyLinkBtn.innerText = '📋 Copy', 2000);
        };

        // --- SELECTION LISTENER ---
        this.canvas.setSelectionListener((block, element) => {
            this.selectedBlock = block;
            this.selectedElement = element;
            this.updatePanelValues(); 
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

        // 🟢 FIXED DELETE LOGIC HERE 🟢
        this.deleteBtn.onclick = () => {
            if (confirm("Delete this block?")) {
                this.canvas.deleteSelected();
                
                // 1. Reset Selection
                this.selectedBlock = null;
                this.selectedElement = null;

                // 2. Hide the CONTROLS, but NOT the PANEL
                this.imageControls.style.display = 'none';
                this.textControls.style.display = 'none';
                
                // 3. Ensure panel stays visible (it's a flex container in CSS)
                // We don't set display='none' on this.panel anymore!
            }
        };

        this.moveUpBtn.onclick = () => {
            if (this.selectedBlock) this.canvas.moveBlockUp(this.selectedBlock);
        };

        this.moveDownBtn.onclick = () => {
            if (this.selectedBlock) this.canvas.moveBlockDown(this.selectedBlock);
        };
    }

    updatePanelValues() {
        // Ensure panel is visible (useful if it was hidden initially)
        // Note: In CSS it is 'display: flex', so we don't want to overwrite that with 'block' if possible, 
        // but forcing it visible is okay.
        if (this.panel.style.display === 'none') this.panel.style.display = 'flex';

        if (!this.selectedElement) {
            this.commonControls.style.display = 'none'; // Hide if nothing selected
            return;
        }

        this.commonControls.style.display = 'block';

        const tagName = this.selectedElement.tagName;

        if (tagName === 'IMG') {
            this.imageControls.style.display = 'block';
            this.textControls.style.display = 'none';

            this.imgWidthInput.value = parseInt(this.selectedElement.style.width) || 100;
            this.imgRadiusInput.value = parseInt(this.selectedElement.style.borderRadius) || 0;

        } else {
            this.imageControls.style.display = 'none';
            this.textControls.style.display = 'block';

            const style = window.getComputedStyle(this.selectedElement);
            
            // Update Text Inputs
            // ... (You can add more robust syncing here later)
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
        const theme = this.canvas.getTheme(); // Get the theme!

        // Send both to the server
        const result = await this.network.saveDesign(html, theme);
        
        if (result.success) {
            const shareUrl = `${window.location.origin}/share/${result.id}?to=GuestName`;
            this.shareUrlInput.value = shareUrl;
            this.openLinkBtn.href = shareUrl;
            this.saveModal.style.display = 'flex';
        } else {
            alert('Failed to save design.');
        }
    }

    closeModal() { this.modal.style.display = 'none'; }

    togglePreview() {
        document.body.classList.toggle('preview-mode');
    }

    
}