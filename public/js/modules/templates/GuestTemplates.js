export default {
    default: `
        <div style="text-align:center;">
            <p>Dear</p>
            <span class="guest-badge">{{GUEST_NAME}}</span>
        </div>`,

    simple: `
        <div style="text-align:center;">
            <p style="color: #888; font-size: 0.9em;">Specially invited:</p>
            <div class="guest-simple">{{GUEST_NAME}}</div>
        </div>`,

    fancy: `
        <div style="text-align:center;">
            <p style="font-family: serif; font-style: italic;">Honored Guest</p>
            <div class="guest-fancy">{{GUEST_NAME}}</div>
            <p>You are invited</p>
        </div>`
};