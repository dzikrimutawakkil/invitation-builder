export default {
    default: `
        <div class="rsvp-section">
            <h3 class="rsvp-title">💌 Leave a Wish</h3>
            <form class="rsvp-form" action="/rsvp/{{DESIGN_ID}}" method="POST">
                <input type="text" name="name" placeholder="Your Name" value="{{GUEST_NAME}}" required>
                <select name="status"><option value="yes">✅ I will attend</option><option value="no">❌ Sorry, I can't come</option></select>
                <textarea name="message" rows="3" placeholder="Write a message..." required></textarea>
                <button type="submit" class="rsvp-btn">Send Message</button>
            </form>
            <div class="message-board">{{RSVP_MESSAGES}}</div>
        </div>`,

    card: `
        <div class="rsvp-card">
            <h2 style="text-align:center; color:var(--primary-color);">RSVP</h2>
            <p style="text-align:center; color:#666; margin-bottom:20px;">Please let us know if you can make it.</p>
            <form class="rsvp-form" action="/rsvp/{{DESIGN_ID}}" method="POST">
                <input type="text" name="name" placeholder="Name" value="{{GUEST_NAME}}" style="background:#f0f0f0; border:none;" required>
                <select name="status" style="background:#f0f0f0; border:none;"><option value="yes">Going</option><option value="no">Not Going</option></select>
                <textarea name="message" rows="2" placeholder="Wishes..." style="background:#f0f0f0; border:none;" required></textarea>
                <button type="submit" class="rsvp-btn" style="border-radius: 30px;">Confirm Presence</button>
            </form>
            <div class="message-board" style="margin-top:20px;">{{RSVP_MESSAGES}}</div>
        </div>`,
        
    minimal: `
        <div style="width:100%; text-align:center;">
            <h3 style="text-transform: uppercase; letter-spacing: 2px;">Response</h3>
            <form class="rsvp-form" action="/rsvp/{{DESIGN_ID}}" method="POST" style="margin-top: 20px;">
                <input type="text" name="name" value="{{GUEST_NAME}}" style="border:none; border-bottom: 1px solid #333; background:transparent; border-radius:0;" required>
                <select name="status" style="border:none; border-bottom: 1px solid #333; background:transparent; border-radius:0;"><option value="yes">Yes</option><option value="no">No</option></select>
                <input type="text" name="message" placeholder="Message..." style="border:none; border-bottom: 1px solid #333; background:transparent; border-radius:0;" required>
                <button type="submit" class="rsvp-btn" style="background: transparent; color: #333; border: 1px solid #333; margin-top: 20px;">SEND</button>
            </form>
             <div class="message-board">{{RSVP_MESSAGES}}</div>
        </div>`
};