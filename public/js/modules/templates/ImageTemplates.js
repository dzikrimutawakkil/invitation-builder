export default {
    simple: `
        <div style="width: 100%; text-align: center;">
            <img src="https://via.placeholder.com/300x400?text=Photo" 
                 style="width: 100%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" 
                 alt="Photo">
        </div>`,

    circle: `
        <div style="text-align: center;">
            <img src="https://via.placeholder.com/250x250?text=Photo" 
                 style="width: 250px; height: 250px; border-radius: 50%; object-fit: cover; border: 5px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.15);" 
                 alt="Photo">
        </div>`,

    polaroid: `
        <div class="img-polaroid">
            <img src="https://via.placeholder.com/280x280?text=Photo" 
                 style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border: 1px solid #eee;" 
                 alt="Photo">
            <p style="font-family: 'Nothing You Could Do', cursive; color: #555; margin-top: 10px;">Our Love Story</p>
        </div>`
};