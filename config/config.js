const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
    // Telegram Bot Configuration
    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN,
        options: process.env.NODE_ENV === 'production'
            ? {} // webhook mode (Vercel)
            : { polling: true } // dev mode (lokal)
    },

    // Gemini AI Configuration
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
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    },

    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    },

    // Application Settings
    app: {
        name: "Gemini Telegram Bot",
        version: "1.0.0",
        maxHistoryLength: 20, // Max conversation history per user
        typingDelay: 1000, // Delay for typing indicator in ms
    },

    // Rate Limiting (Optional)
    rateLimit: {
        enabled: false,
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each user to 100 requests per windowMs
    }
};

// Validation - Pastikan environment variables ada
if (!config.telegram.token) {
    throw new Error('TELEGRAM_BOT_TOKEN is required in environment variables');
}

if (!config.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY is required in environment variables');
}

module.exports = config;
