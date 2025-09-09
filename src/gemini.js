const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/config');

class GeminiService {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: config.gemini.model,
            generationConfig: config.gemini.generationConfig,
            safetySettings: config.gemini.safetySettings
        });
        this.chatHistory = new Map();
        this.maxHistoryLength = config.app.maxHistoryLength;
    }

    async generateResponse(userId, message) {
        try {
            if (!this.chatHistory.has(userId)) this.chatHistory.set(userId, []);
            const history = this.chatHistory.get(userId);

            const result = await this.model.generateContent({
                contents: [
                    ...history,
                    { role: "user", parts: [{ text: message }] }
                ],
            });

            const text = this.cleanMarkdownFormatting(result.response.text());

            history.push(
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text }] }
            );
            return text;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "❌ Maaf, saya sedang mengalami gangguan.";
        }
    }

    cleanMarkdownFormatting(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/_(.*?)_/g, '$1')
            .replace(/^\s*[\*\-]\s+/gm, '• ')
            .replace(/^#+\s+(.*)$/gm, '$1:')
            .replace(/`(.*?)`/g, '$1');
    }

    clearHistory(userId) {
        this.chatHistory.delete(userId);
    }
}

module.exports = GeminiService;
