export default {
    classic: `
        <div class="details-block">
            <strong>Oct 20th, 2025</strong><br>
            New York City
            
            <div class="map-wrapper" style="margin-top: 15px;">
                <iframe class="map-frame" width="100%" height="200" src="https://maps.google.com/maps?q=ADDRESS&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no"></iframe>
            </div>
            <a href="https://maps.google.com/maps?q=ADDRESS&t=&z=13&ie=UTF8&iwloc=&output=embed" target="_blank" class="map-btn" style="margin-top: 10px;">📍 Get Directions</a>
        </div>`,

    modern: `
        <div class="details-modern">
            <h2 style="margin: 0; font-size: 3em; color: var(--primary-color);">20</h2>
            <p style="margin: 0; letter-spacing: 3px;">OCTOBER</p>
            <div style="width: 50px; height: 2px; background: var(--accent-color); margin: 15px auto;"></div>
            <p>NEW YORK CITY</p>

            <div class="map-wrapper" style="margin-top: 20px; border: 1px solid var(--primary-color);">
                <iframe class="map-frame" width="100%" height="200" src="https://maps.google.com/maps?q=ADDRESS&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no"></iframe>
            </div>
            <a href="https://maps.google.com/maps?q=ADDRESS&t=&z=13&ie=UTF8&iwloc=&output=embed" target="_blank" class="map-btn" style="margin-top: 15px;">📍 Get Directions</a>
        </div>`,

    elegant: `
        <div class="details-elegant">
            <p>Saturday, the Twentieth of October</p>
            <p style="font-style: italic; margin-top: 10px; margin-bottom: 20px;">The Grand Ballroom</p>

            <div class="map-wrapper" style="border: 1px solid var(--accent-color);">
                <iframe class="map-frame" width="100%" height="200" src="https://maps.google.com/maps?q=ADDRESS&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no"></iframe>
            </div>
            <a href="https://maps.google.com/maps?q=ADDRESS&t=&z=13&ie=UTF8&iwloc=&output=embed" target="_blank" class="map-btn" style="margin-top: 15px; background: var(--accent-color);">📍 Get Directions</a>
        </div>`,
};