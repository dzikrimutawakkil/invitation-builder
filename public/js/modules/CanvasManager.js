export default class CanvasManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.onSelectionChange = null;

        // NEW: Listen for clicks globally on the canvas
        this.canvas.addEventListener('click', (e) => {
            const target = e.target;
            const block = target.closest('.block');

            // If we clicked something inside a block
            if (block) {
                // Pass both the Wrapper (block) AND the Specific Element (target)
                this.selectBlock(block, target);
            }
        });
        this.initScrollObserver();
    }

    initScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { 
            root: this.canvas, // Important: Watch scrolling inside the Phone Canvas
            threshold: 0.2 
        });

        // Observer needs to watch existing blocks AND new ones
        // We use a MutationObserver to detect when you add a NEW block
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('block')) {
                        observer.observe(node);
                    }
                });
            });
        });

        mutationObserver.observe(this.canvas, { childList: true });
    }

    setSelectionListener(callback) {
        this.onSelectionChange = callback;
    }

    cleanCanvas() {
        if (this.canvas.innerText.includes('Add blocks from')) {
            this.canvas.innerHTML = '';
        }
    }

    addBlock(htmlContent) {
        this.cleanCanvas();
        const el = document.createElement('div');
        el.className = 'block';
        el.contentEditable = "true"; 
        el.innerHTML = htmlContent;
        
        this.canvas.appendChild(el);
        // Select the new block immediately
        this.selectBlock(el, el); 
    }

    selectBlock(block, element) {
        // 1. Visual Highlight for the Block Wrapper
        document.querySelectorAll('.block.selected').forEach(b => b.classList.remove('selected'));
        block.classList.add('selected');

        // 2. Notify UI with BOTH pieces of info
        if (this.onSelectionChange) {
            this.onSelectionChange(block, element);
        }
    }

    deleteSelected() {
        const selected = this.canvas.querySelector('.block.selected');
        if (selected) selected.remove();
    }

    getDesignHtml() {
        const clone = this.canvas.cloneNode(true);
        clone.querySelectorAll('.block').forEach(b => {
            b.classList.remove('selected');
            b.removeAttribute('contenteditable');
        });
        return clone.innerHTML;
    }

    moveBlockUp(block) {
        // If there is a previous sibling, move this block before it
        if (block.previousElementSibling) {
            this.canvas.insertBefore(block, block.previousElementSibling);
            // Keep it selected / scroll to it
            block.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    moveBlockDown(block) {
        // If there is a next sibling, move it after (by inserting before the one after next)
        if (block.nextElementSibling) {
            this.canvas.insertBefore(block.nextElementSibling, block);
            block.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    getTheme() {
        return this.canvas.getAttribute('data-theme') || '';
    }
}