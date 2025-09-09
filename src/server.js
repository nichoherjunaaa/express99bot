const express = require('express');
const TelegramBotService = require('./bot');
const config = require('../config/config');

const app = express();
const botService = new TelegramBotService();

app.use(express.json());

// health check
app.get('/', (req, res) => {
    res.json({ status: 'OK', app: config.app.name, version: config.app.version });
});

// webhook endpoint
app.post('/api/webhook', (req, res) => {
    try {
        botService.handleUpdate(req.body);
    } catch (err) {
        console.error("Webhook error:", err);
    }
    res.status(200).send('OK');
});


botService.start(); 


module.exports = app;
