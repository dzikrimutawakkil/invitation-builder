export default class CanvasManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.onSelectionChange = null; // Callback function
    }

    /**
     * Set a function to call when a block is clicked
     */
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

        // EVENT LISTENER: When clicked/focused, select this block
        el.onclick = (e) => {
            e.stopPropagation(); // Prevent clicking background
            this.selectBlock(el);
        };

        this.canvas.appendChild(el);
        
        // Auto-select the new block
        this.selectBlock(el);
    }

    selectBlock(el) {
        // 1. Remove 'selected' class from old blocks
        document.querySelectorAll('.block.selected').forEach(b => b.classList.remove('selected'));
        
        // 2. Add 'selected' class to new block
        el.classList.add('selected');

        // 3. Notify UIManager
        if (this.onSelectionChange) {
            this.onSelectionChange(el);
        }
    }

    /**
     * Helper to delete the currently selected block
     */
    deleteSelected() {
        const selected = this.canvas.querySelector('.block.selected');
        if (selected) selected.remove();
    }

    getDesignHtml() {
        // Clean selection classes before saving so they don't show up in the final invite
        const clone = this.canvas.cloneNode(true);
        clone.querySelectorAll('.block').forEach(b => {
            b.classList.remove('selected');
            b.removeAttribute('contenteditable'); // Clean up editable attribute
        });
        return clone.innerHTML;
    }
}