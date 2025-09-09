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
            this.bot.sendMessage(chatId,
                "👋 Halo! Saya adalah bot Express99.\n\n" +
                "Ketik pesan apapun untuk mulai.\nGunakan /help untuk bantuan.");
        });

        this.bot.onText(/\/help/, (msg) => {
            this.bot.sendMessage(msg.chat.id,
                "📖 Perintah:\n/start - mulai\n/help - bantuan\n/clear - hapus riwayat");
        });

        this.bot.onText(/\/clear/, (msg) => {
            this.geminiService.clearHistory(msg.chat.id);
            this.bot.sendMessage(msg.chat.id, "✅ Riwayat dihapus.");
        });

        this.bot.on('message', async (msg) => {
            if (msg.text.startsWith('/')) return;
            const chatId = msg.chat.id;
            this.bot.sendChatAction(chatId, 'typing');
            const reply = await this.geminiService.generateResponse(chatId, msg.text);
            this.bot.sendMessage(chatId, reply);
        });
    }

    handleUpdate(update) {
        return this.bot.processUpdate(update);
    }
    start() {
        console.log("🤖 Telegram bot is running in webhook mode!");
    }
}

module.exports = TelegramBotService;
