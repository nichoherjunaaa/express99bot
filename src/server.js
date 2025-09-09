const TelegramBotService = require('./bot');
const express = require('express');
const config = require('../config/config');

const app = express();
const botService = new TelegramBotService(); // <- hanya sekali

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Telegram Gemini Bot is running!',
        app: config.app.name,
        version: config.app.version,
        environment: config.server.environment,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/webhook', async (req, res) => {
    try {
        console.log('Received webhook update:', JSON.stringify(req.body));
        botService.handleUpdate(req.body); // gunakan instance global
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(200).send('OK');
    }
});

if (process.env.NODE_ENV !== 'production') {
    botService.start();
}

module.exports = app;
