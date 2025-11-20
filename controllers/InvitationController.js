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
            const designHtml = await this.storage.get(designId);
            if (!designHtml) return res.status(404).send("Design not found");

            res.render('index', { 
                title: 'Edit Invitation',
                preloadDesign: designHtml 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    saveDesign = async (req, res) => {
        try {
            const { htmlContent } = req.body;
            const designId = await this.storage.save(htmlContent);
            res.json({ success: true, id: designId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Database Error' });
        }
    }

    renderInvitation = async (req, res) => {
        try {
            const designId = req.params.id;
            const guestName = req.query.to || '';
            
            let designHtml = await this.storage.get(designId);
            const rsvps = await this.storage.getRSVPs(designId);

            if (!designHtml) {
                return res.status(404).send("<h1>404: Invitation Not Found</h1>");
            }

            // --- 1. BUILD MESSAGE BOARD HTML ---
            let messagesHtml = '';
            if (rsvps.length > 0) {
                messagesHtml += `<h4 style="text-align:center; color:#999; font-size:0.85em; margin-bottom:15px;">LATEST WISHES</h4>`;
                rsvps.forEach(msg => {
                    const badgeClass = msg.status === 'yes' ? 'bg-yes' : 'bg-no';
                    const badgeText = msg.status === 'yes' ? 'Going' : 'Not Going';
                    
                    messagesHtml += `
                        <div class="msg-card status-${msg.status}">
                            <div class="msg-header">
                                <span class="msg-name">${msg.name}</span>
                                <span class="badge ${badgeClass}">${badgeText}</span>
                            </div>
                            <div class="msg-text">"${msg.message}"</div>
                        </div>`;
                });
            } else {
                messagesHtml = `<p style="text-align:center; color:#aaa; font-size:0.9em; font-style:italic;">Be the first to send a wish!</p>`;
            }

            // --- 2. INJECT DYNAMIC CONTENT ---
            // Replace placeholders in the HTML string
            const displayName = guestName || 'Guest';
            
            let finalContent = designHtml
                .replace(/{{GUEST_NAME}}/g, displayName)
                .replace(/{{DESIGN_ID}}/g, designId)          // Fills the form action
                .replace(/{{RSVP_MESSAGES}}/g, messagesHtml); // Fills the message board

            res.render('invitation', { 
                title: `Invitation for ${displayName}`,
                content: finalContent,
                // We don't need to pass rsvps/designId separately anymore 
                // because we baked them into the 'content' string above!
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
}

module.exports = InvitationController;