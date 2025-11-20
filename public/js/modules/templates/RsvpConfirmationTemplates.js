export default {
    default: `
        <div class="rsvp-section">
            <h3 class="rsvp-title">💌 Leave a Wish</h3>
            
            <form class="rsvp-form" action="/rsvp/{{DESIGN_ID}}" method="POST">
                <input type="text" name="name" placeholder="Your Name" value="{{GUEST_NAME}}" required>
                
                <select name="status">
                    <option value="yes">✅ I will attend</option>
                    <option value="no">❌ Sorry, I can't come</option>
                </select>
                
                <textarea name="message" rows="3" placeholder="Write a message for the couple..." required></textarea>
                
                <button type="submit" class="rsvp-btn">Send Message</button>
            </form>

            <div class="message-board">
                {{RSVP_MESSAGES}}
            </div>
        </div>`
};