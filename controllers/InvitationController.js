class InvitationController {
    constructor(storageService) {
        this.storage = storageService;
    }

    // Normal Builder (Empty)
    renderBuilder = (req, res) => {
        res.render('index', { 
            title: 'Invitation Builder',
            preloadDesign: null // No design to load
        });
    }

    // Edit Mode (Pre-filled)
    editBuilder = async (req, res) => {
        try {
            const designId = req.params.id;
            const designHtml = await this.storage.get(designId);

            if (!designHtml) {
                return res.status(404).send("Design not found");
            }

            res.render('index', { 
                title: 'Edit Invitation',
                preloadDesign: designHtml // Pass the saved HTML
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    saveDesign = async (req, res) => {
        try {
            const { htmlContent } = req.body;
            // Save to DB and wait for the new ID
            const designId = await this.storage.save(htmlContent);
            res.json({ success: true, id: designId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Database Error' });
        }
    }

    // 🔴 CRITICAL FIX: Use the ID to find the specific invitation
    renderInvitation = async (req, res) => {
        try {
            // 1. Get the ID from the URL (the ':id' part)
            const designId = req.params.id;
            const guestName = req.query.to || 'Guest';
            
            // 2. Ask the Database for this specific ID
            const designHtml = await this.storage.get(designId);

            if (!designHtml) {
                return res.status(404).send("<h1>404: Invitation Not Found</h1>");
            }

            // 3. Personalize and Show
            const personalizedContent = designHtml.replace(/{{GUEST_NAME}}/g, guestName);

            res.render('invitation', { 
                title: `Invitation for ${guestName}`,
                content: personalizedContent 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
}

module.exports = InvitationController;