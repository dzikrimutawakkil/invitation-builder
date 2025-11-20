class InvitationController {
    constructor(storageService) {
        this.storage = storageService;
    }

    renderBuilder = (req, res) => {
        res.render('index', { 
            title: 'Invitation Builder',
            preloadDesign: null 
        });
    }

    editBuilder = async (req, res) => {
        try {
            const designId = req.params.id;
            const data = await this.storage.get(designId); // Returns whole row

            if (!data) return res.status(404).send("Design not found");

            res.render('index', { 
                title: 'Edit Invitation',
                preloadDesign: data.content,
                preloadTheme: data.theme // Pass theme
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    saveDesign = async (req, res) => {
        try {
            const { htmlContent, theme } = req.body;
            const designId = await this.storage.save(htmlContent, theme);
            res.json({ success: true, id: designId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
        }
    }

    renderInvitation = async (req, res) => {
        try {
            const designId = req.params.id;
            const guestName = req.query.to || '';
            
            const data = await this.storage.get(designId);
            const rsvps = await this.storage.getRSVPs(designId);

            if (!data) return res.status(404).send("Not Found");

            const displayName = guestName || 'Guest';
            const finalContent = data.content
                .replace(/{{GUEST_NAME}}/g, displayName)
                .replace(/{{DESIGN_ID}}/g, designId)
                .replace(/{{RSVP_MESSAGES}}/g, this._buildRsvpHtml(rsvps)); // (Assuming you kept the RSVP helper logic here)

            res.render('invitation', { 
                title: `Invitation for ${displayName}`,
                content: finalContent,
                theme: data.theme, // Pass theme
                designId: designId,
                guestName: guestName
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    // NEW: Handle Form Submission
    submitRSVP = async (req, res) => {
        try {
            const designId = req.params.id;
            const { name, status, message } = req.body;

            await this.storage.addRSVP(designId, name, status, message);

            // Reload the page to show the new message
            res.redirect(`/share/${designId}?to=${encodeURIComponent(name)}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error submitting RSVP");
        }
    }

    _buildRsvpHtml(rsvps) {
        // ... (Your existing RSVP HTML building logic) ...
        // If you didn't extract it to a helper, just keep the logic inside renderInvitation
        // but make sure to use 'data.content' and 'data.theme'.
        if (!rsvps.length) return `<p style="text-align:center; color:#aaa;">Be the first to send a wish!</p>`;
        return rsvps.map(msg => `<div class="msg-card"><b>${msg.name}</b>: ${msg.message}</div>`).join('');
    }
}

module.exports = InvitationController;