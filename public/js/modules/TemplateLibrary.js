// Import the separate template files
import HeroTemplates from './templates/HeroTemplates.js';
import TextTemplates from './templates/TextTemplates.js';
import DetailsTemplates from './templates/DetailsTemplates.js';
import GuestTemplates from './templates/GuestTemplates.js';
import ImageTemplates from './templates/ImageTemplates.js';
import RsvpTemplates from './templates/RsvpConfirmationTemplates.js';

export default class TemplateLibrary {
    constructor() {
        // The library is now just a collection of these imported modules
        this.categories = {
            hero: HeroTemplates,
            text: TextTemplates,
            details: DetailsTemplates,
            guest: GuestTemplates,
            image: ImageTemplates,
            rsvp: RsvpTemplates
        };
    }

    /**
     * Returns all design options for a specific category (e.g., 'hero')
     */
    getDesigns(category) {
        // If the category exists, return its templates; otherwise return empty object
        return this.categories[category] || {};
    }
}