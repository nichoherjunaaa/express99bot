const TelegramBot = require('node-telegram-bot-api');
const GeminiService = require('./gemini');
const config = require('../config/config');

class TelegramBotService {
    constructor() {
        this.token = config.telegram.token;
        this.bot = new TelegramBot(this.token, config.telegram.options);
        this.geminiService = new GeminiService(config.gemini.apiKey);

        this.setupHandlers();
    }

    setupHandlers() {
        this.bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            const welcomeMessage = `👋 Halo! Saya adalah AI assistant yang ditenagai oleh Google Gemini.\n\n` +
                `Saya siap membantu menjawab pertanyaan Anda. Coba tanyakan sesuatu!\n\n` +
                `💡 Gunakan /help untuk melihat perintah yang tersedia.`;
            this.bot.sendMessage(chatId, welcomeMessage);
        }); ``

        this.bot.onText(/\/help/, (msg) => {
            const chatId = msg.chat.id;
            const helpMessage = `🤖 **Perintah yang Tersedia:**\n\n` +
                `/start - Memulai bot\n` +
                `/help - Menampilkan bantuan\n` +
                `/about - Tentang bot ini\n\n` +
                `Cukup ketik pesan biasa untuk berinteraksi dengan AI!`;
            this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
        });

        this.bot.onText(/\/clear/, (msg) => {
            const chatId = msg.chat.id;
            this.geminiService.clearHistory(chatId);
            this.bot.sendMessage(chatId, "✅ Riwayat percakapan telah dihapus. Percakapan dimulai dari awal.");
        });

        this.bot.onText(/\/about/, (msg) => {
            const chatId = msg.chat.id;
            const aboutMessage = `🤖 **Gemini AI Telegram Bot**\n\n` +
                `Dibangun dengan Node.js dan Google Gemini AI\n` +
                `Powered by Google's Generative AI technology\n\n` +
                `📍 Fitur:\n` +
                `• Percakapan kontekstual\n` +
                `• Multi-pengguna support\n` +
                `• Riwayat percakapan\n` +
                `• Respons cepat dan akurat`;
            this.bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
        });

        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const messageText = msg.text;

            if (messageText.startsWith('/')) return;

            this.bot.sendChatAction(chatId, 'typing');

            try {
                const response = await this.geminiService.generateResponse(chatId, messageText);
                this.bot.sendMessage(chatId, response);
            } catch (error) {
                console.error("Error:", error);
                this.bot.sendMessage(chatId, "❌ Maaf, terjadi kesalahan. Silakan coba lagi nanti.");
            }
        });

        this.bot.on('error', (error) => {
            console.error('Telegram Bot Error:', error);
        });
    }
    handleUpdate(update) {
        this.bot.processUpdate(update);
    }
<<<<<<< HEAD

=======
    
>>>>>>> 674a3f3 (testing deploy bot)
    start() {
        console.log('🤖 Telegram Bot started successfully!');
        console.log('📍 Bot is running and waiting for messages...');
    }
    async setupWebhook() {
        const webhookUrl = `${process.env.VERCEL_URL}/api/webhook`;
        await this.bot.setWebHook(webhookUrl);
        console.log(`Webhook set to: ${webhookUrl}`);
    }
}

module.exports = TelegramBotService;