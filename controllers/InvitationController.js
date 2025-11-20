class InvitationController {
    constructor(storageService) {
        this.storage = storageService;
    }

    // 1. Builder Page (Empty)
    renderBuilder = (req, res) => {
        res.render('index', { 
            title: 'Invitation Builder',
            preloadDesign: null 
        });
    }

    // 2. Edit Mode (Loads saved design)
    editBuilder = async (req, res) => {
        try {
            const designId = req.params.id;
            const data = await this.storage.get(designId);

            if (!data) {
                return res.status(404).send("Design not found");
            }

            res.render('index', { 
                title: 'Edit Invitation',
                preloadDesign: data.content,
                preloadTheme: data.theme // Pass theme so builder knows it
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    // 3. Save Design (Handles HTML, Theme, and Music)
    saveDesign = async (req, res) => {
        try {
            // Receive music along with content and theme
            const { htmlContent, theme, music } = req.body;
            
            // Save all three to the database
            const designId = await this.storage.save(htmlContent, theme, music);
            
            res.json({ success: true, id: designId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Database Error' });
        }
    }

    // 4. View Invitation (The "Cinematic" View)
    renderInvitation = async (req, res) => {
        try {
            const designId = req.params.id;
            const guestName = req.query.to || '';
            
            // Fetch Design & RSVPs
            const data = await this.storage.get(designId);
            const rsvps = await this.storage.getRSVPs(designId);

            if (!data) {
                return res.status(404).send("<h1>404: Invitation Not Found</h1>");
            }

            // Build RSVP Message Board HTML
            let messagesHtml = '';
            if (rsvps.length > 0) {
                 messagesHtml = rsvps.map(msg => {
                     const badgeClass = msg.status === 'yes' ? 'bg-yes' : 'bg-no';
                     const badgeText = msg.status === 'yes' ? 'Going' : 'Not Going';
                     return `
                        <div class="msg-card status-${msg.status}">
                            <div class="msg-header">
                                <span class="msg-name">${msg.name}</span>
                                <span class="badge ${badgeClass}">${badgeText}</span>
                            </div>
                            <div class="msg-text">"${msg.message}"</div>
                        </div>`;
                 }).join('');
            } else {
                 messagesHtml = `<p style="text-align:center; color:#aaa; font-style:italic;">Be the first to send a wish!</p>`;
            }

            // Personalize Content & Inject RSVP Board
            const displayName = guestName || 'Guest';
            const finalContent = data.content
                .replace(/{{GUEST_NAME}}/g, displayName)
                .replace(/{{DESIGN_ID}}/g, designId)
                .replace(/{{RSVP_MESSAGES}}/g, messagesHtml);

            // Render the View with ALL data
            res.render('invitation', { 
                title: `Invitation for ${displayName}`,
                content: finalContent,
                theme: data.theme,
                music: data.music, // Pass music so the audio player works
                designId: designId,
                guestName: guestName
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    // 5. Handle RSVP Form Submission
    submitRSVP = async (req, res) => {
        try {
            const designId = req.params.id;
            const { name, status, message } = req.body;

            await this.storage.addRSVP(designId, name, status, message);

            // Redirect back to the invitation so they see their message
            res.redirect(`/share/${designId}?to=${encodeURIComponent(name)}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error submitting RSVP");
        }
    }
}

module.exports = InvitationController;