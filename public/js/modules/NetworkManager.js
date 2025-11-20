export default class NetworkManager {
    async saveDesign(htmlContent, theme) {
        try {
            const response = await fetch('/save-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ htmlContent, theme }) // Send both
            });
            return await response.json();
        } catch (error) {
            console.error('Save failed:', error);
            return { success: false, message: 'Network Error' };
        }
    }
}