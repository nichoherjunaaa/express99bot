const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN,
        options: process.env.NODE_ENV === 'production'
            ? {} // webhook mode
            : { polling: true } // local dev
    },

    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-2.0-flash",
        generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
    },

    server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development',
        baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`
    },

    webhook: {
        path: "/api/webhook"
    },

    app: {
        name: "Gemini Telegram Bot",
        version: "1.0.0",
        maxHistoryLength: 20,
        typingDelay: 1000,
    }
};

// Validation
if (!config.telegram.token) throw new Error('TELEGRAM_BOT_TOKEN is required');
if (!config.gemini.apiKey) throw new Error('GEMINI_API_KEY is required');

module.exports = config;
