class InvitationController {
    constructor(storageService) {
        // We inject the storage service so the controller can use it
        this.storage = storageService;
    }

    /**
     * GET / - Show the Builder
     */
    renderBuilder = (req, res) => {
        res.render('index', { title: 'Invitation Builder' });
    }

    /**
     * POST /save-design - Save the data
     */
    saveDesign = (req, res) => {
        const { htmlContent } = req.body;
        
        // Use the service to save data
        this.storage.save(htmlContent);
        
        res.json({ success: true, message: 'Design Saved!' });
    }

    /**
     * GET /share - Show the final invitation
     */
    renderInvitation = (req, res) => {
        const guestName = req.query.to || 'Guest';
        
        // Use the service to get data
        const designHtml = this.storage.get();

        // Apply the personalization logic
        const personalizedContent = designHtml.replace(/{{GUEST_NAME}}/g, guestName);

        res.render('invitation', { 
            title: `Invitation for ${guestName}`,
            content: personalizedContent 
        });
    }
}

module.exports = InvitationController;