export default class UIManager {
    constructor(templateLibrary, canvasManager, networkManager) {
        this.library = templateLibrary;
        this.canvas = canvasManager;
        this.network = networkManager;
        
        this.selectedBlock = null;
        this.selectedElement = null;

        // --- DOM ELEMENTS ---
        this.modal = document.getElementById('templateModal');
        this.grid = document.getElementById('templateGrid');
        this.closeBtn = document.querySelector('.close-btn');
        this.panel = document.getElementById('propertiesPanel'); 

        // --- CONTROLS SECTIONS ---
        this.textControls = document.getElementById('textControls'); 
        this.imageControls = document.getElementById('imageControls');
        this.mapControls = document.getElementById('mapControls');
        this.musicControls = document.getElementById('musicControls');
        this.commonControls = document.getElementById('commonControls');

        // --- INPUTS ---
        // Text
        this.colorInput = document.getElementById('colorInput');
        this.fontSizeInput = document.getElementById('fontSizeInput');
        this.colorVal = document.getElementById('colorValue');
        
        // Box
        this.bgColorInput = document.getElementById('bgColorInput');
        this.paddingInput = document.getElementById('paddingInput');
        this.bgVal = document.getElementById('bgColorValue');
        this.deleteBtn = document.getElementById('deleteBlockBtn');

        // Image
        this.imageInput = document.getElementById('imageInput');
        this.imgWidthInput = document.getElementById('imgWidthInput');
        this.imgRadiusInput = document.getElementById('imgRadiusInput');

        // Map
        this.mapAddressInput = document.getElementById('mapAddressInput');
        this.updateMapBtn = document.getElementById('updateMapBtn');
        this.mapLinkInput = document.getElementById('mapLinkInput');
        this.extractMapBtn = document.getElementById('extractMapBtn');

        // Music
        this.musicInput = document.getElementById('musicInput');
        this.musicUrlInput = document.getElementById('musicUrlInput');
        this.currentMusicData = ""; 

        // Reorder
        this.moveUpBtn = document.getElementById('moveUpBtn');
        this.moveDownBtn = document.getElementById('moveDownBtn');

        // Save Modal
        this.saveModal = document.getElementById('saveModal');
        this.shareUrlInput = document.getElementById('shareUrlInput');
        this.copyLinkBtn = document.getElementById('copyLinkBtn');
        this.openLinkBtn = document.getElementById('openLinkBtn');

        // NEW: Background Controls
        this.bgImageInput = document.getElementById('bgImageInput');
        this.parallaxCheckbox = document.getElementById('parallaxCheckbox');
        this.removeBgImgBtn = document.getElementById('removeBgImgBtn');
    }

    init() {
        this.closeBtn.onclick = () => this.closeModal();
        window.onclick = (e) => { if (e.target == this.modal) this.closeModal(); };

        // SELECTION LISTENER
        this.canvas.setSelectionListener((block, element) => {
            this.selectedBlock = block;
            this.selectedElement = element;
            this.updatePanelValues(); 
        });

        // --- MUSIC LOGIC ---
        if (this.musicInput) {
            this.musicInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.currentMusicData = event.target.result;
                        alert("Music loaded! Don't forget to Save.");
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
        if (this.musicUrlInput) {
            this.musicUrlInput.oninput = (e) => {
                this.currentMusicData = e.target.value;
            };
        }

        // --- IMAGE LOGIC ---
        this.imageInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file && this.selectedElement?.tagName === 'IMG') {
                const reader = new FileReader();
                reader.onload = (event) => { this.selectedElement.src = event.target.result; };
                reader.readAsDataURL(file);
            }
        };
        this.imgWidthInput.oninput = (e) => {
            if (this.selectedElement?.tagName === 'IMG') this.selectedElement.style.width = e.target.value + '%';
        };
        this.imgRadiusInput.oninput = (e) => {
            if (this.selectedElement?.tagName === 'IMG') this.selectedElement.style.borderRadius = e.target.value + '%';
        };

        // --- MAP LOGIC ---
        this.updateMapBtn.onclick = () => {
            if (this.selectedBlock) {
                const iframe = this.selectedBlock.querySelector('iframe.map-frame');
                const btn = this.selectedBlock.querySelector('a.map-btn');
                const address = this.mapAddressInput.value;
                if (iframe && address) {
                    const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
                    iframe.src = embedUrl;
                    if (btn) btn.href = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
                }
            }
        };

        this.extractMapBtn.onclick = () => {
            const link = this.mapLinkInput.value;
            if (!link) return alert("Please paste a Google Maps link first.");
            const coordsMatch = link.match(/@([-0-9.]+),([-0-9.]+)/);
            if (coordsMatch && coordsMatch.length >= 3) {
                const coords = `${coordsMatch[1]},${coordsMatch[2]}`;
                if (this.selectedBlock) {
                    const iframe = this.selectedBlock.querySelector('iframe.map-frame');
                    const btn = this.selectedBlock.querySelector('a.map-btn');
                    const embedUrl = `https://maps.google.com/maps?q=${coords}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                    if (iframe) iframe.src = embedUrl;
                    if (btn) btn.href = link;
                    this.mapAddressInput.value = coords;
                    alert("Location extracted successfully!");
                }
            } else {
                alert("Could not find coordinates. Try a standard Google Maps link.");
            }
        };

        // --- TEXT & BOX LOGIC ---
        this.colorInput.oninput = (e) => { if (this.selectedElement) { this.selectedElement.style.color = e.target.value; this.colorVal.innerText = e.target.value; } };
        this.fontSizeInput.onchange = (e) => { if (this.selectedElement) this.selectedElement.style.fontSize = e.target.value; };
        this.bgColorInput.oninput = (e) => { if (this.selectedBlock) { this.selectedBlock.style.backgroundColor = e.target.value; this.bgVal.innerText = e.target.value; } };
        this.paddingInput.oninput = (e) => { if (this.selectedBlock) this.selectedBlock.style.padding = e.target.value + 'px'; };
        
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.onclick = () => { if (this.selectedElement) this.selectedElement.style.textAlign = btn.dataset.align; };
        });

        // --- COMMON TOOLS ---
        this.moveUpBtn.onclick = () => { if (this.selectedBlock) this.canvas.moveBlockUp(this.selectedBlock); };
        this.moveDownBtn.onclick = () => { if (this.selectedBlock) this.canvas.moveBlockDown(this.selectedBlock); };
        
        this.deleteBtn.onclick = () => {
            if (confirm("Delete this block?")) {
                this.canvas.deleteSelected();
                this.selectedBlock = null;
                this.selectedElement = null;
                this.hideAllControls();
            }
        };

        // --- SAVE MODAL ---
        if (this.copyLinkBtn) {
            this.copyLinkBtn.onclick = () => {
                this.shareUrlInput.select();
                document.execCommand('copy');
                this.copyLinkBtn.innerText = '✅ Copied!';
                setTimeout(() => this.copyLinkBtn.innerText = '📋 Copy', 2000);
            };
        }

        // 🔴 NEW: Background Image Logic
        this.bgImageInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file && this.selectedBlock) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Set background image
                    this.selectedBlock.style.backgroundImage = `url('${event.target.result}')`;
                    this.selectedBlock.style.backgroundSize = 'cover';
                    this.selectedBlock.style.backgroundPosition = 'center';

                    // Force text to be white so it's readable
                    this.selectedBlock.style.color = 'white';
                    // Add a text shadow for better readability
                    this.selectedBlock.style.textShadow = '0 2px 5px rgba(0,0,0,0.5)';
                };
                reader.readAsDataURL(file);
            }
        };

        // 🔴 NEW: Parallax Toggle
        this.parallaxCheckbox.onchange = (e) => {
            if (this.selectedBlock) {
                if (e.target.checked) {
                    this.selectedBlock.classList.add('parallax-bg');
                } else {
                    this.selectedBlock.classList.remove('parallax-bg');
                }
            }
        };

        // 🔴 NEW: Remove Image
        this.removeBgImgBtn.onclick = () => {
            if (this.selectedBlock) {
                this.selectedBlock.style.backgroundImage = '';
                this.selectedBlock.classList.remove('parallax-bg');
                this.parallaxCheckbox.checked = false;
                this.bgImageInput.value = ''; // Reset input
            }
        };
    }

    // --- HELPER METHODS ---

    openMusicSettings() {
        this.hideAllControls();
        if (this.musicControls) this.musicControls.style.display = 'block';
        if (this.panel.style.display === 'none') this.panel.style.display = 'flex';
    }

    hideAllControls() {
        if (this.textControls) this.textControls.style.display = 'none';
        if (this.imageControls) this.imageControls.style.display = 'none';
        if (this.mapControls) this.mapControls.style.display = 'none';
        if (this.commonControls) this.commonControls.style.display = 'none';
        if (this.musicControls) this.musicControls.style.display = 'none';
    }

    updatePanelValues() {
        if (this.panel.style.display === 'none') this.panel.style.display = 'flex';
        this.hideAllControls();
        
        // Always show reorder buttons if something is selected
        if (this.selectedBlock) {
            if (this.commonControls) this.commonControls.style.display = 'block';
        }

        if (!this.selectedElement) return;

        // 1. Check for Map
        if (this.selectedBlock && this.selectedBlock.querySelector('iframe.map-frame')) {
            if (this.mapControls) {
                this.mapControls.style.display = 'block';
                // Try to extract address from URL
                const iframe = this.selectedBlock.querySelector('iframe.map-frame');
                try {
                    if (iframe.src.includes('q=')) {
                        const query = iframe.src.split('q=')[1].split('&')[0];
                        this.mapAddressInput.value = decodeURIComponent(query);
                    }
                } catch(e) {}
            }
            return;
        }

        // 2. Check for Image
        if (this.selectedElement.tagName === 'IMG') {
            if (this.imageControls) this.imageControls.style.display = 'block';
            this.imgWidthInput.value = parseInt(this.selectedElement.style.width) || 100;
            this.imgRadiusInput.value = parseInt(this.selectedElement.style.borderRadius) || 0;
            return;
        }

        // 3. Default: Text Controls
        if (this.textControls) this.textControls.style.display = 'block';
        
        // Sync Inputs
        const textStyle = window.getComputedStyle(this.selectedElement);
        const boxStyle = window.getComputedStyle(this.selectedBlock);

        // 🔴 NEW: Sync Checkbox state
        if (this.selectedBlock.classList.contains('parallax-bg')) {
            this.parallaxCheckbox.checked = true;
        } else {
            this.parallaxCheckbox.checked = false;
        }
        
        // Helper: RGB to Hex
        const rgbToHex = (rgb) => {
            if (!rgb || rgb.indexOf('rgb') === -1) return '#000000';
            const sep = rgb.indexOf(",") > -1 ? "," : " ";
            const rgbArr = rgb.substr(4).split(")")[0].split(sep);
            let r = (+rgbArr[0]).toString(16), g = (+rgbArr[1]).toString(16), b = (+rgbArr[2]).toString(16);
            if (r.length == 1) r = "0" + r;
            if (g.length == 1) g = "0" + g;
            if (b.length == 1) b = "0" + b;
            return "#" + r + g + b;
        };

        this.colorInput.value = rgbToHex(textStyle.color);
        this.colorVal.innerText = this.colorInput.value;
        this.bgColorInput.value = rgbToHex(boxStyle.backgroundColor);
        this.bgVal.innerText = this.bgColorInput.value;
        this.paddingInput.value = parseInt(boxStyle.padding) || 20;
        this.fontSizeInput.value = textStyle.fontSize; 
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
        const theme = this.canvas.getTheme();
        const music = this.currentMusicData;

        const result = await this.network.saveDesign(html, theme, music);
        
        if (result.success) {
            const shareUrl = `${window.location.origin}/share/${result.id}?to=GuestName`;
            if (this.saveModal) {
                this.shareUrlInput.value = shareUrl;
                this.openLinkBtn.href = shareUrl;
                this.saveModal.style.display = 'flex';
            } else {
                prompt("Saved!", shareUrl);
            }
        } else {
            alert('Failed to save design.');
        }
    }

    closeModal() { this.modal.style.display = 'none'; }
    
    togglePreview() {
        document.body.classList.toggle('preview-mode');
    }
}