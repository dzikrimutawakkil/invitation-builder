import TemplateLibrary from './modules/TemplateLibrary.js';
import CanvasManager from './modules/CanvasManager.js';
import NetworkManager from './modules/NetworkManager.js';
import UIManager from './modules/UIManager.js';

// 1. Instantiate the Modules
const library = new TemplateLibrary();
const canvas = new CanvasManager('canvas');
const network = new NetworkManager();

// 2. Create the Controller
const ui = new UIManager(library, canvas, network);

// 3. Initialize
ui.init();

// 4. Expose functions to the Global Window so HTML buttons can see them
window.openSelector = (category) => ui.openCategorySelector(category);
window.saveWork = () => ui.handleSave();