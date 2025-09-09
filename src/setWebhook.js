const axios = require('axios');
const config = require('../config/config');

(async () => {
    const webhookUrl = `${config.server.baseUrl}/api/webhook`;
    try {
        const res = await axios.get(
            `https://api.telegram.org/bot${config.telegram.token}/setWebhook`,
            { params: { url: webhookUrl } }
        );
        console.log("Set Webhook Response:", res.data);
    } catch (err) {
        console.error("Failed to set webhook:", err.response?.data || err.message);
    }
})();
