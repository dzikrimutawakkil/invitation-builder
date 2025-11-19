export default class CanvasManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
    }

    /**
     * Clear placeholder text if it exists
     */
    cleanCanvas() {
        if (this.canvas.innerText.includes('Add blocks from')) {
            this.canvas.innerHTML = '';
        }
    }

    /**
     * Add a new block of HTML to the canvas
     */
    addBlock(htmlContent) {
        this.cleanCanvas();

        const el = document.createElement('div');
        el.className = 'block';
        el.contentEditable = "true"; // Make it editable
        el.innerHTML = htmlContent;

        this.canvas.appendChild(el);
        
        // Removed el.scrollIntoView() to prevent buggy jumping
    }

    /**
     * Get the final HTML string to save
     */
    getDesignHtml() {
        return this.canvas.innerHTML;
    }
}